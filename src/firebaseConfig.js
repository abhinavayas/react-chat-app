import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBmuXv6CyEUT535e3EhGDCu6y7701PNLWE",
  authDomain: "react-chat-app-3fc01.firebaseapp.com",
  projectId: "react-chat-app-3fc01",
  storageBucket: "react-chat-app-3fc01.appspot.com",
  messagingSenderId: "493094305970",
  appId: "1:493094305970:web:7d4797a131e233d7c189ab",
  measurementId: "G-YQDLLW830K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
