import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { auth } from './firebase';
import { User } from '../models';

export const isLoggedIn = (): boolean => {
  // console.log('auth', auth);
  // console.log('currentUser', auth.currentUser);
  return getCurrentUser() ? true : false;
};

export const getCurrentUser = (): User => {
  const value = sessionStorage.getItem('user');
  return value ? JSON.parse(value) : null;
};

onAuthStateChanged(auth, (user) => {
  if (user) {
    sessionStorage.setItem('user', JSON.stringify(user));
  } else {
    sessionStorage.removeItem('user');
  }
});

export const logIn = (email: string, password: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        resolve(user);
      })
      .catch((error) => reject(error));
  });
};

export const logOut = (): Promise<User> => {
  return new Promise((resolve, reject) => {
    signOut(auth)
      .then(() => resolve)
      .catch((error) => reject(error));
  });
};
