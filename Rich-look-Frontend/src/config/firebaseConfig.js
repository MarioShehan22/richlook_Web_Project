import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';

// Firebase configuration object
const firebaseConfig = {
    apiKey: "AIzaSyB66AYZpVWtLMU1leMhab6HJAfrQ789FUQ",
    authDomain: "richlook-web.firebaseapp.com",
    projectId: "richlook-web",
    storageBucket: "richlook-web.firebasestorage.app",
    messagingSenderId: "829548694463",
    appId: "1:829548694463:web:f8ca6694f785eb80bbaf0a",
    measurementId: "G-495N6CMH3T"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get the auth instance
export const auth = getAuth(app); // This gives you the auth instance
