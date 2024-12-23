import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
  apiKey: "AIzaSyDrFDCSFPB-H9VzWSNKW4swlIL__gUZPzo",
  authDomain: "ekisde-fe4e1.firebaseapp.com",
  projectId: "ekisde-fe4e1",
  storageBucket: "ekisde-fe4e1.appspot.com",
  messagingSenderId: "153625592264",
  appId: "1:153625592264:web:9a18da227fe07c313e80fd"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
//connectFirestoreEmulator(db, "localhost", 8080);

const auth = getAuth(app);
//connectAuthEmulator(auth, "http://localhost:9099");

const functions = getFunctions(app);
//connectFunctionsEmulator(functions, "127.0.0.1", 5001);

export { app, auth, db, functions };
