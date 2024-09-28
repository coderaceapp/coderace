import { useState } from 'react';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    setPersistence,
    browserLocalPersistence,
    browserSessionPersistence,
    signOut,
} from "firebase/auth";
import { auth, db } from "../lib/firebaseConfig";
import { collection, setDoc, doc, serverTimestamp } from "firebase/firestore";

export const useAuth = () => {
    const [error, setError] = useState<string | null>(null);

    const handleSignUp = async (email: string, password: string, username: string, rememberMe: boolean): Promise<boolean> => {
        try {
            // Set persistence based on "remember me" checkbox
            const persistence = rememberMe ? browserLocalPersistence : browserSessionPersistence;
            await setPersistence(auth, persistence);

            // Create user with email and password
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Store the user data in Firestore using UID as the document ID
            await setDoc(doc(collection(db, "users"), user.uid), {
                username: username,
                email: email,
                createdAt: serverTimestamp(),
            });

            console.log("Signed up user: ", user);
            setError(null);
            return true; // Sign-up success
        } catch (error: any) {
            switch (error.code) {
                case 'auth/email-already-in-use':
                    setError("The email address is already in use by another account.");
                    break;
                case 'auth/invalid-email':
                    setError("The email address is not valid.");
                    break;
                case 'auth/weak-password':
                    setError("The password is too weak. It must be at least 6 characters.");
                    break;
                default:
                    setError("Error during sign up: " + error.message);
                    break;
            }
            return false; // Sign-up failure
        }
    };

    const handleSignIn = async (email: string, password: string, rememberMe: boolean): Promise<boolean> => {
        try {
            // Set persistence based on "remember me" checkbox
            const persistence = rememberMe ? browserLocalPersistence : browserSessionPersistence;
            await setPersistence(auth, persistence);

            // Sign in user with email and password
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            console.log("Signed in user: ", user);
            setError(null);
            return true; // Sign-in success
        } catch (error: any) {
            switch (error.code) {
                case 'auth/user-not-found':
                    setError("No user found with the provided email.");
                    break;
                case 'auth/wrong-password':
                    setError("Incorrect password.");
                    break;
                case 'auth/invalid-email':
                    setError("The email address is not valid.");
                    break;
                default:
                    setError("Error during sign in: " + error.message);
                    break;
            }
            return false; // Sign-in failure
        }
    };

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            console.log("User signed out");
        } catch (error: any) {
            console.error("Error signing out: ", error.message);
        }
    };

    return {
        handleSignUp,
        handleSignIn,
        handleSignOut,
        error,
    };
};
