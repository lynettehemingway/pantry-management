// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCJcCQoALa8ozeiKEniedFAyWTPY2KrV74",
  authDomain: "list-tracker-6e582.firebaseapp.com",
  projectId: "list-tracker-6e582",
  storageBucket: "list-tracker-6e582.appspot.com",
  messagingSenderId: "525390866274",
  appId: "1:525390866274:web:525ee3b5138e0a68ab2e3b",
  measurementId: "G-YV116R247K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export{firestore}