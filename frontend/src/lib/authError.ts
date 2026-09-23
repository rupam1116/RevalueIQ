/**
 * RevalueIQ — Centralized Production Authentication Error Translation Layer
 * 
 * Ensures technical Firebase, MongoDB, or FastAPI error details and codes
 * are NEVER rendered to end users in the production UI.
 */

export function getAuthErrorMessage(err: any): string {
  if (!err) {
    return "Something went wrong. Please try again.";
  }

  const code = typeof err === "string" ? err : err?.code || "";
  const rawMsg = typeof err === "string" ? err : err?.message || "";

  // Extract Firebase error code pattern e.g. "(auth/email-already-in-use)" or "auth/invalid-credential"
  const codeMatch = rawMsg.match(/\(auth\/[a-z0-9-]+\)/i) || rawMsg.match(/auth\/[a-z0-9-]+/i);
  const targetCode = (code || (codeMatch ? codeMatch[0].replace(/[()]/g, "") : "")).toLowerCase().trim();

  // 1. Exact Match against Firebase Authentication Error Codes
  switch (targetCode) {
    case "auth/email-already-in-use":
      return "This email is already registered. Please log in instead.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/weak-password":
      return "Your password does not meet the required security rules.";
    case "auth/missing-password":
      return "Please enter your password.";
    case "auth/invalid-credential":
    case "auth/user-not-found":
    case "auth/wrong-password":
      return "Email or password is incorrect.";
    case "auth/too-many-requests":
      return "Too many attempts. Please try again later.";
    case "auth/network-request-failed":
      return "Unable to connect. Please check your internet connection and try again.";
    case "auth/user-disabled":
      return "This account has been disabled. Please contact support.";
    case "auth/operation-not-allowed":
      return "This sign-in method is currently unavailable.";
    case "auth/popup-closed-by-user":
      return "Sign-in popup was closed before completing.";
  }

  // 2. Substring Fallback Matching
  if (rawMsg.includes("email-already-in-use")) {
    return "This email is already registered. Please log in instead.";
  }
  if (rawMsg.includes("invalid-email")) {
    return "Please enter a valid email address.";
  }
  if (rawMsg.includes("weak-password")) {
    return "Your password does not meet the required security rules.";
  }
  if (rawMsg.includes("missing-password")) {
    return "Please enter your password.";
  }
  if (
    rawMsg.includes("invalid-credential") ||
    rawMsg.includes("user-not-found") ||
    rawMsg.includes("wrong-password")
  ) {
    return "Email or password is incorrect.";
  }
  if (rawMsg.includes("too-many-requests")) {
    return "Too many attempts. Please try again later.";
  }
  if (
    rawMsg.includes("network-request-failed") ||
    rawMsg.includes("network error") ||
    rawMsg.includes("Failed to fetch")
  ) {
    return "Unable to connect. Please check your internet connection and try again.";
  }
  if (rawMsg.includes("user-disabled")) {
    return "This account has been disabled. Please contact support.";
  }
  if (rawMsg.includes("operation-not-allowed")) {
    return "This sign-in method is currently unavailable.";
  }
  if (rawMsg.includes("popup-closed-by-user")) {
    return "Sign-in popup was closed before completing.";
  }

  // 3. Allow safe custom user-facing validation strings (must not contain technical leak terms)
  if (
    typeof rawMsg === "string" &&
    rawMsg.length > 0 &&
    !/firebase/i.test(rawMsg) &&
    !/auth\//i.test(rawMsg) &&
    !/mongo/i.test(rawMsg) &&
    !/fastapi/i.test(rawMsg) &&
    !/exception/i.test(rawMsg) &&
    !/http/i.test(rawMsg) &&
    !/error\s*\(/i.test(rawMsg) &&
    !/\[object/i.test(rawMsg)
  ) {
    return rawMsg;
  }

  // 4. Secure Default Fallback
  return "Something went wrong. Please try again.";
}

export const parseFirebaseError = getAuthErrorMessage;
