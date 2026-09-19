import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, browserLocalPersistence, setPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Configure client auth persistence
if (typeof window !== 'undefined') {
  setPersistence(auth, browserLocalPersistence).catch((err) => {
    console.warn('Firebase persistence setup notice:', err);
  });
}

// In this project firestoreDatabaseId is provided in firebaseConfig
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || '(default)');

// Hardcoded administrator credentials known only to the site owner
export const ADMIN_CREDENTIALS = {
  username: 'erex-admin',
  secretPasscode: 'ErexStore2026!Admin',
  // Accepted secret admin aliases if typed
  acceptedAliases: [
    'erex-admin',
    'shopmoney962@gmail.com',
    'shopmoney926@gmail.com'
  ]
};

export function verifyAdminCredentials(username: string, passcode: string): boolean {
  if (!username || !passcode) return false;
  const cleanUser = username.trim().toLowerCase();
  const cleanPass = passcode.trim();

  const isUserValid = 
    ADMIN_CREDENTIALS.acceptedAliases.some(alias => alias.toLowerCase() === cleanUser);

  const isPassValid = cleanPass === ADMIN_CREDENTIALS.secretPasscode;

  return isUserValid && isPassValid;
}
