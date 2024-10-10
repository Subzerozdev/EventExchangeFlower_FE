// Import các chức năng cần dùng từ Firebase SDK
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { GoogleAuthProvider } from "firebase/auth";

// Cấu hình Firebase cho ứng dụng của bạn
const firebaseConfig = {
    apiKey: "AIzaSyCr5Q5X4URc6tT9DXvcgjTeVmupPJO_ZXw",
    authDomain: "swphoathanhly.firebaseapp.com",
    projectId: "swphoathanhly",
    storageBucket: "swphoathanhly.appspot.com",
    messagingSenderId: "459714702534",
    appId: "1:459714702534:web:586e1bc51183080a0dbbc7",
    measurementId: "G-9LK03836YV"
};

// Khởi tạo ứng dụng Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app); // Khởi tạo storage để upload file
const googleProvider = new GoogleAuthProvider();

export { storage, googleProvider };
