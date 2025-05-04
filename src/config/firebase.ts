// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCsdyLz51Vnqfly3Hua9aNDIEshERC1NPg",
  authDomain: "skillkart-40c6c.firebaseapp.com",
  projectId: "skillkart-40c6c",
  storageBucket: "skillkart-40c6c.firebasestorage.app",
  messagingSenderId: "994952178044",
  appId: "1:994952178044:web:7b69434e1411088e555cf9",
  measurementId: "G-SNHPWHLE3H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export { auth };