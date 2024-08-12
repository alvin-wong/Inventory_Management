// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDFNYX2IWDENvDHh3BLR-uqZgNVypkfqms",
  authDomain: "inventory-management-8815c.firebaseapp.com",
  projectId: "inventory-management-8815c",
  storageBucket: "inventory-management-8815c.appspot.com",
  messagingSenderId: "1022993164550",
  appId: "1:1022993164550:web:e055b88827e93f19b2d687",
  measurementId: "G-7X5PBYQK3Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export {firestore};