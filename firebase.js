import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAuth, getAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Firebase web config is safe to ship in the client; access is controlled by
// firestore.rules and storage.rules in the repo root.
const firebaseConfig = {
  apiKey: 'AIzaSyDinbgz4FlAxQ5P9FwZer857NJZj9DuINI',
  authDomain: 'motivationapp-9dc3f.firebaseapp.com',
  projectId: 'motivationapp-9dc3f',
  storageBucket: 'motivationapp-9dc3f.appspot.com',
  messagingSenderId: '753565448361',
  appId: '1:753565448361:web:37d1a9630b021e6c5b91b8',
  measurementId: 'G-YBELM1PPRK',
};

const isFirstInit = getApps().length === 0;
export const Firebase = isFirstInit ? initializeApp(firebaseConfig) : getApp();

// initializeAuth throws if called twice (e.g. on fast refresh), so only do it once.
// On web, getAuth already persists to IndexedDB (and getReactNativePersistence doesn't exist).
export const auth =
  isFirstInit && Platform.OS !== 'web'
    ? initializeAuth(Firebase, { persistence: getReactNativePersistence(AsyncStorage) })
    : getAuth(Firebase);

export const db = getFirestore(Firebase);

export const storage = getStorage(Firebase);
