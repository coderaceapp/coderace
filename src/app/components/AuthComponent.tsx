"use client";

import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../lib/firebaseConfig';

const AuthComponent: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(true);

    const handleAuth = async () => {
        try {
            if (isSignUp) {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                console.log("User signed up: ", userCredential.user);
            } else {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                console.log("User signed in: ", userCredential.user);
            }
        } catch (error: any) {
            console.error("Error with authentication: ", error.message);
        }
    };

    return (
        <div>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
            />
            <button onClick={handleAuth}>
                {isSignUp ? "Sign Up" : "Sign In"}
            </button>
            <button onClick={() => setIsSignUp(!isSignUp)}>
                {isSignUp ? "Already have an account? Sign In" : "Need an account? Sign Up"}
            </button>
        </div>
    );
};

export default AuthComponent;
