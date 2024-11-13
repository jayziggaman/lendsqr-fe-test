// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA-k4jGowJY0ETZUkRM7hnwoQTqatl2vug",
  authDomain: "ozorchisom-lendsqr-fe-test.firebaseapp.com",
  projectId: "ozorchisom-lendsqr-fe-test",
  storageBucket: "ozorchisom-lendsqr-fe-test.firebasestorage.app",
  messagingSenderId: "632806017356",
  appId: "1:632806017356:web:437a633da2f54ca25167e9",
  measurementId: "G-NPZ9L5KGVJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);