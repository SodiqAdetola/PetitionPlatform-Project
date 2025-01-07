// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDcPiOCfH5ZYCOdWBtY5Ep5CSDvm6uLcSw",
  authDomain: "slpp-f9f1b.firebaseapp.com",
  projectId: "slpp-f9f1b",
  storageBucket: "slpp-f9f1b.firebasestorage.app",
  messagingSenderId: "792682656031",
  appId: "1:792682656031:web:4c8953514c696e1e69802a",
  measurementId: "G-X7E7Q06T22"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)

