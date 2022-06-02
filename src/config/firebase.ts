/* eslint-disable no-undef */

const {
    REACT_APP_FIREBASE_API_KEY: apiKey,
    REACT_APP_FIREBASE_AUTH_DOMAIN: authDomain,
    REACT_APP_FIREBASE_PROJECT_ID: projectId,
    REACT_APP_FIREBASE_STORAGE_BUCKET: storageBucket,
    REACT_APP_FIREBASE_MESSAGING_SENDER_ID: messagingSenderId,
    REACT_APP_FIREBASE_APP_ID: appId,
    REACT_APP_FIREBASE_MEASUREMENT_ID: measurementId,
  } = process.env;

  export const firebaseConfig =  {
    apiKey,
    authDomain,
    projectId,
    storageBucket,
    messagingSenderId,
    appId,
    measurementId,
  };
