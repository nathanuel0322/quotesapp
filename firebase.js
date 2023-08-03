// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, setDoc, doc, getDoc, collection, addDoc } from "firebase/firestore";
import {ref, getStorage, uploadBytes, } from "firebase/storage";
import Globals from './src/GlobalValues';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDinbgz4FlAxQ5P9FwZer857NJZj9DuINI",
  authDomain: "motivationapp-9dc3f.firebaseapp.com",
  projectId: "motivationapp-9dc3f",
  storageBucket: "motivationapp-9dc3f.appspot.com",
  messagingSenderId: "753565448361",
  appId: "1:753565448361:web:37d1a9630b021e6c5b91b8",
  measurementId: "G-YBELM1PPRK"
};

// Initialize Firebase
export const Firebase = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(Firebase);

export const db = getFirestore(Firebase);
// const firestore = getFirestore(Firebase);
// getDoc(doc(firestore, "Businesses", "BizData"))
// // .then is genuinely the most essential thing here as it threw me off for hours
//   .then(result => Globals.businesses=result.data());

// export default Firebase;

