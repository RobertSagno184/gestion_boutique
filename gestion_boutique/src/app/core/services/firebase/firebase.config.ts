import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { environment } from '../../../../environments/environment';

// Configuration Firebase depuis les variables d'environnement
export const firebaseConfig = {
  apiKey: environment.firebase.apiKey,
  authDomain: environment.firebase.authDomain,
  projectId: environment.firebase.projectId,
  storageBucket: environment.firebase.storageBucket,
  messagingSenderId: environment.firebase.messagingSenderId,
  appId: environment.firebase.appId
};

// Initialisation Firebase
let app: FirebaseApp;
let auth: Auth;
let firestore: Firestore;
let storage: FirebaseStorage;

export function initializeFirebase(): void {
  if (!app) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    firestore = getFirestore(app);
    storage = getStorage(app);
  }
}

export function getFirebaseAuth(): Auth {
  if (!auth) {
    initializeFirebase();
  }
  return auth;
}

export function getFirebaseFirestore(): Firestore {
  if (!firestore) {
    initializeFirebase();
  }
  return firestore;
}

export function getFirebaseStorage(): FirebaseStorage {
  if (!storage) {
    initializeFirebase();
  }
  return storage;
}
