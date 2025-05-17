import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyA6NQOZMBi724WGp1IY4qi0o8rnDBxK3jE",
    authDomain: "taskmanager-46834.firebaseapp.com",
    projectId: "taskmanager-46834",
    storageBucket: "taskmanager-46834.appspot.com",
    messagingSenderId: "242018315298",
    appId: "1:242018315298:web:5838d691c7a7f3179eee7b",
    measurementId: "G-J86FXPY1QP"
  };

  const app = initializeApp(firebaseConfig);
  
export const auth = getAuth(app)  
export const db = getFirestore(app);
