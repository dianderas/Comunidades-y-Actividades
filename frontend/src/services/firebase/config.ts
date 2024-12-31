import { initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';
import { connectFunctionsEmulator, getFunctions } from "firebase/functions";
import { getDatabase, connectDatabaseEmulator } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDrFDCSFPB-H9VzWSNKW4swlIL__gUZPzo",
  authDomain: "ekisde-fe4e1.firebaseapp.com",
  projectId: "ekisde-fe4e1",
  storageBucket: "ekisde-fe4e1.appspot.com",
  messagingSenderId: "153625592264",
  appId: "1:153625592264:web:9a18da227fe07c313e80fd",
  databaseURL: process.env.NODE_ENV === "development"
    ? "http://127.0.0.1:9000?ns=ekisde-fe4e1"
    : "ekisde-fe4e1.firebaseio.com",
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);
const functions = getFunctions(app);
const database = getDatabase(app);

if (process.env.NODE_ENV === "development") {
  connectFirestoreEmulator(db, "localhost", 8080);
  connectAuthEmulator(auth, "http://localhost:9099");
  connectFunctionsEmulator(functions, "127.0.0.1", 5001);
  connectDatabaseEmulator(database, 'localhost', 9000);
}

export { app, auth, db, functions, database };
