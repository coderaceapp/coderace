"use client";

import React, { useState } from "react";
import GitHubLoginButton from "../components/GitHubLoginButton";
import { useAuth } from "../hooks/useAuth";
import { useRouter } from "next/navigation"; // Importing useRouter for redirection

const LoginForm: React.FC = () => {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [username, setUsername] = useState("");
    const [isSignUp, setIsSignUp] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

    const { handleSignUp, handleSignIn, error } = useAuth();

    const validateFields = () => {
        const errors: { [key: string]: string } = {};

        if (isSignUp && !username) {
            errors.username = "Required";
        }
        if (!email) {
            errors.email = "Required";
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            errors.email = "Invalid email address";
        }
        if (!password) {
            errors.password = "Required";
        }
        if (isSignUp && password !== confirmPassword) {
            errors.confirmPassword = "Passwords do not match";
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSignUpSubmit = async () => {
        if (validateFields()) {
            const success = await handleSignUp(email, password, username, rememberMe);
            if (success) {
                router.push("/"); // Redirect to the homepage on successful sign-up
            }
        }
    };

    const handleSignInSubmit = async () => {
        if (validateFields()) {
            const success = await handleSignIn(email, password, rememberMe);
            if (success) {
                router.push("/"); // Redirect to the homepage on successful sign-in
            }
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-black text-white">
            <div className="bg-black p-6 rounded-lg shadow-md w-full max-w-sm border border-gray-700">
                <h1 className="text-2xl font-bold text-center mb-6 flex items-center justify-center">
                    <span className="mr-2"></span> {isSignUp ? "Sign Up" : "Login"}
                </h1>

                {/* OAuth Login Options */}
                <div className="flex justify-center mb-4 space-x-4">
                    {/* GitHub Login Button */}
                    <GitHubLoginButton isSignUp={isSignUp} />
                </div>

                <div className="text-center text-gray-400 mb-4">or</div>

                {/* Email, Username, and Password Input */}
                <div className="space-y-4">
                    {isSignUp && (
                        <>
                            <input
                                type="text"
                                placeholder="Username"
                                className={`w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 ${fieldErrors.username ? "border-red-500" : "focus:ring-blue-500"
                                    }`}
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            {fieldErrors.username && (
                                <p className="text-red-500 text-sm">{fieldErrors.username}</p>
                            )}
                        </>
                    )}
                    <input
                        type="email"
                        placeholder="Email"
                        className={`w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 ${fieldErrors.email ? "border-red-500" : "focus:ring-blue-500"
                            }`}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    {fieldErrors.email && (
                        <p className="text-red-500 text-sm">{fieldErrors.email}</p>
                    )}
                    <input
                        type="password"
                        placeholder="Password"
                        className={`w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 ${fieldErrors.password ? "border-red-500" : "focus:ring-blue-500"
                            }`}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {fieldErrors.password && (
                        <p className="text-red-500 text-sm">{fieldErrors.password}</p>
                    )}
                    {isSignUp && (
                        <>
                            <input
                                type="password"
                                placeholder="Confirm Password"
                                className={`w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 ${fieldErrors.confirmPassword ? "border-red-500" : "focus:ring-blue-500"
                                    }`}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            {fieldErrors.confirmPassword && (
                                <p className="text-red-500 text-sm">
                                    {fieldErrors.confirmPassword}
                                </p>
                            )}
                        </>
                    )}
                </div>

                {/* Error Message */}
                {error && (
                    <div className="text-red-500 text-sm text-center mt-4">{error}</div>
                )}

                {/* Remember Me and Sign In/Sign Up Button */}
                {!isSignUp && (
                    <div className="mt-4">
                        <label className="inline-flex items-center">
                            <input
                                type="checkbox"
                                className="form-checkbox bg-white text-black rounded"
                                checked={rememberMe}
                                onChange={() => setRememberMe(!rememberMe)}
                            />
                            <span className="ml-2 text-gray-400">remember me</span>
                        </label>
                    </div>
                )}

                <div className="flex justify-center mt-4">
                    <button
                        onClick={isSignUp ? handleSignUpSubmit : handleSignInSubmit}
                        className="bg-white text-black py-2 px-6 rounded-lg flex items-center"
                    >
                        <span className="mr-2"></span> {isSignUp ? "Sign Up" : "Sign In"}
                    </button>
                </div>

                {/* Toggle Sign-Up / Sign-In */}
                <div className="flex justify-between text-sm text-gray-400 mt-4">
                    <button
                        onClick={() => setIsSignUp(!isSignUp)}
                        className="hover:underline"
                    >
                        {isSignUp
                            ? "Already have an account? Sign In"
                            : "Need an account? Sign Up"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
