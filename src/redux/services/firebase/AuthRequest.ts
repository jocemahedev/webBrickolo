import {
  signInWithEmailAndPassword,
  signOut as signOutFirebase,
  sendPasswordResetEmail,
  createUserWithEmailAndPassword,
  updateProfile,
  User,
} from "firebase/auth";
import { auth } from "./firebaseConfig";

export async function signIn(email: string, password: string) {
  try {
    return signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error("error", error);
  }
}
export async function resetPassword(email: string) {
  try {
    sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error("error", error);
  }
}

export async function signOut() {
  try {
    signOutFirebase(auth);
  } catch (error) {
    console.log("error", error);
  }
}
