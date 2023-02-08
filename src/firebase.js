import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBXrJ5iVn4mdvxjedJZGHFha084MFjZSkU",
  authDomain: "team-chat-eb32d.firebaseapp.com",
  databaseURL: "https://team-chat-eb32d-default-rtdb.firebaseio.com",
  projectId: "team-chat-eb32d",
  storageBucket: "team-chat-eb32d.appspot.com",
  messagingSenderId: "460927722983",
  appId: "1:460927722983:web:d09aa82c85ee37bb534942",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();
