import { initializeApp, getApps, applicationDefault } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import logger from '../logs/logger';

// Initialize Firebase Admin SDK
if (getApps().length === 0) {
  try {
    initializeApp({
      credential: applicationDefault(), // Uses GOOGLE_APPLICATION_CREDENTIALS
    });
    logger.info("Firebase Admin Initialized successfully.");
  } catch (error) {
    console.error("Firebase Admin Initialization error", error);
  }
}

export const firebaseAdminAuth = getAuth();
