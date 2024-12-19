import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "./config";

interface RegisterParams {
  email: string;
  password: string;
  nickname: string;
}

export const login = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const register = async ({ email, password, nickname }: RegisterParams) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);

  const userId = userCredential.user.uid;

  const request = {
    nickname,
    email,
    createdAt: serverTimestamp(),
    avatar: '',
  }

  return await setDoc(doc(db, 'users', userId), request);
};

export const logout = () => {
  return signOut(auth);
}

export { auth };
