// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// new project firebase
const firebaseConfig = {
    apiKey: "AIzaSyCr5Q5X4URc6tT9DXvcgjTeVmupPJO_ZXw",
    authDomain: "swphoathanhly.firebaseapp.com",
    projectId: "swphoathanhly",
    storageBucket: "swphoathanhly.appspot.com",
    messagingSenderId: "459714702534",
    appId: "1:459714702534:web:586e1bc51183080a0dbbc7",
    measurementId: "G-9LK03836YV"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

export {storage, googleProvider};