import { initializeApp, getApps, applicationDefault, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import logger from '../logs/logger';

// Initialize Firebase Admin SDK
if (getApps().length === 0) {
  try {
    if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
      initializeApp({
        credential: cert(serviceAccount),
      });
      logger.info("Firebase Admin Initialized successfully from ENV JSON.");
    } else {
      initializeApp({
        credential: applicationDefault(), // Uses GOOGLE_APPLICATION_CREDENTIALS path
      });
      logger.info("Firebase Admin Initialized successfully from Application Default.");
    }
  } catch (error) {
    console.error("Firebase Admin Initialization error", error);
  }
}

export const firebaseAdminAuth = getAuth();
