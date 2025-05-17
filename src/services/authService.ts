import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import { auth } from "../firebase";

export const loginUser = (email: string, password: string) =>
  signInWithEmailAndPassword(auth, email, password);

export const registerUser = async (name: string, email: string, password: string) => {
const userCredential = await createUserWithEmailAndPassword(auth, email, password);
if (auth.currentUser) {
  await updateProfile(userCredential.user, {
    displayName: name,
  });
}
return userCredential;
}

export const logoutUser = () => signOut(auth);

export { auth };
