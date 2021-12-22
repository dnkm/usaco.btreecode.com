// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBalrOfSxynKJcA-fQRM_thZc6obLB8Hrw",
  authDomain: "usaco-btreecode-com.firebaseapp.com",
  projectId: "usaco-btreecode-com",
  storageBucket: "usaco-btreecode-com.appspot.com",
  messagingSenderId: "366641017107",
  appId: "1:366641017107:web:d24f99fcdd4d954cef2ae6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const fstore = getFirestore(app);
const auth = getAuth(app);

export { app, fstore, auth };
