import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBswFktcSJwsE2Z_PPlLGH56c2SEIldI-A",
    authDomain: "coderace-3f853.firebaseapp.com",
    projectId: "coderace-3f853",
    storageBucket: "coderace-3f853.appspot.com",
    messagingSenderId: "908544668971",
    appId: "1:908544668971:web:8b13ee4a0ffda0fd8bc16e",
    measurementId: "G-JP3WLLDJ12",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get the Firestore instance
const db = getFirestore(app);

// Export the authentication instance to use it in other parts of the app
export const auth = getAuth(app);
export { db };
export default app;
