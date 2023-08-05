import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage"
import { getReactNativePersistence } from "firebase/auth/react-native"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyDinbgz4FlAxQ5P9FwZer857NJZj9DuINI",
  authDomain: "motivationapp-9dc3f.firebaseapp.com",
  projectId: "motivationapp-9dc3f",
  storageBucket: "motivationapp-9dc3f.appspot.com",
  messagingSenderId: "753565448361",
  appId: "1:753565448361:web:37d1a9630b021e6c5b91b8",
  measurementId: "G-YBELM1PPRK"
};

export const Firebase = initializeApp(firebaseConfig);

initializeAuth(Firebase, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export const auth = getAuth(Firebase);

export const db = getFirestore(Firebase);

export const storage = getStorage(Firebase);