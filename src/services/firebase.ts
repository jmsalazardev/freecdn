import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { connectAuthEmulator, getAuth } from 'firebase/auth';
import { firebaseConfig, appConfig, emulatorsConfig } from '../config';

export const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const auth = getAuth();

export const storage = getStorage(app);

if (appConfig.isDev) {
  connectAuthEmulator(auth, `${emulatorsConfig.auth.url}`);
  connectFirestoreEmulator(
    db,
    emulatorsConfig.firestore.host,
    emulatorsConfig.firestore.port
  );
  connectStorageEmulator(
    storage,
    emulatorsConfig.storage.host,
    emulatorsConfig.storage.port
  );
}
