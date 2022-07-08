/* eslint-disable no-undef */

const {
  REACT_APP_EMULATOR_AUTH_URL: authUrl,
  REACT_APP_EMULATOR_FIRESTORE_HOST: firestoreHost,
  REACT_APP_EMULATOR_FIRESTORE_PORT: firestorePort,
  REACT_APP_EMULATOR_STORAGE_HOST: storageHost,
  REACT_APP_EMULATOR_STORAGE_PORT: storagePort,
  REACT_APP_EMULATOR_FUNCTIONS_URL: functionsUrl,
} = process.env;

export const emulatorsConfig = {
  auth: {
    url: authUrl,
  },
  firestore: {
    host: firestoreHost || 'localhost',
    port: firestorePort ? parseInt(firestorePort, 10) : 8080,
  },
  storage: {
    host: storageHost || 'localhost',
    port: storagePort ? parseInt(storagePort, 10) : 9199,
  },
  functions: {
    url: functionsUrl,
  },
};
