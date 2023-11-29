// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB9FByCs2P0ysDt6Kxno3eZJDYrKX8Km1Q",
  authDomain: "financely-8017a.firebaseapp.com",
  projectId: "financely-8017a",
  storageBucket: "financely-8017a.appspot.com",
  messagingSenderId: "746891314090",
  appId: "1:746891314090:web:8dea73d494cdee714aa1d3",
  measurementId: "G-6KMQ912FY7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const firestore = getFirestore(app);
const provider = new GoogleAuthProvider();
export {db, auth, provider, doc, setDoc, firestore,};