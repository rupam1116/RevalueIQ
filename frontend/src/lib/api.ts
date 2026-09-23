/**
 * Centralized API configuration for the RevalueIQ frontend.
 */
export const getApiUrl = (): string => {
  const url = process.env.NEXT_PUBLIC_API_URL;
  if (!url) {
    if (process.env.NODE_ENV === 'production') {
      console.warn('Warning: NEXT_PUBLIC_API_URL is not defined in production. Using default.');
      return 'https://revalueiq.onrender.com';
    }
    return 'http://localhost:8000';
  }
  
  // Ensure no trailing slash
  return url.replace(/\/$/, '');
};

/**
 * Reusable authenticated fetch wrapper that attaches Firebase Authorization header.
 * Automatically attempts a 1-time token force-refresh if HTTP 401 Unauthorized is encountered.
 */
export async function fetchWithAuth(
  endpoint: string,
  token?: string | null,
  options: RequestInit = {}
): Promise<Response> {
  const baseUrl = getApiUrl();
  const url = endpoint.startsWith('http') ? endpoint : `${baseUrl}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  const headers = new Headers(options.headers || {});
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  let authToken = token;
  if (!authToken && typeof window !== 'undefined') {
    try {
      const { auth } = await import('./firebase');
      if (auth.currentUser) {
        authToken = await auth.currentUser.getIdToken();
      }
    } catch (e) {
      // ignore
    }
  }

  if (authToken) {
    headers.set('Authorization', `Bearer ${authToken}`);
  }

  let response = await fetch(url, {
    ...options,
    headers,
  });

  // Automatic 401 Retry: If token expired, force-refresh ID token via Firebase Client SDK and retry request once
  if (response.status === 401 && typeof window !== 'undefined') {
    try {
      const { auth } = await import('./firebase');
      if (auth.currentUser) {
        const freshToken = await auth.currentUser.getIdToken(true);
        if (freshToken) {
          const retryHeaders = new Headers(options.headers || {});
          if (!retryHeaders.has('Content-Type') && !(options.body instanceof FormData)) {
            retryHeaders.set('Content-Type', 'application/json');
          }
          retryHeaders.set('Authorization', `Bearer ${freshToken}`);
          response = await fetch(url, {
            ...options,
            headers: retryHeaders,
          });
        }
      }
    } catch (e) {
      console.warn("Automatic token refresh retry failed on 401:", e);
    }
  }

  return response;
}
