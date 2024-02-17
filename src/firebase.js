import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyDgElHBzBrbuLGECaI1nOMxm29Tg_0WD6s",
  authDomain: "chat-471ce.firebaseapp.com",
  projectId: "chat-471ce",
  storageBucket: "chat-471ce.appspot.com",
  messagingSenderId: "247243257774",
  appId: "1:247243257774:web:2891095b489b9405593a3f",
  measurementId: "G-YRQ66DD45B"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth()
export const storage = getStorage();
export const db = getFirestore();