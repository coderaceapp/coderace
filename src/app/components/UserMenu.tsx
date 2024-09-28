"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "../lib/firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

interface UserMenuProps {
    buttonStyles: React.CSSProperties;  // Accept buttonStyles prop
}

const UserMenu: React.FC<UserMenuProps> = ({ buttonStyles }) => {
    const [username, setUsername] = useState<string | null>(null);
    const [uid, setUid] = useState<string | null>(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const router = useRouter();
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userDoc = await getDoc(doc(db, "users", user.uid));
                if (userDoc.exists()) {
                    setUsername(userDoc.data()?.username || null);
                    setUid(user.uid); // Store the uid
                }
            } else {
                setUsername(null);
                setUid(null);
            }
        });

        return () => unsubscribe();
    }, []);

    // Handle closing the dropdown when clicking outside of it
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setShowDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            setUsername(null);
            setUid(null);
            router.push("/login");
        } catch (error: any) {
            console.error("Error logging out: ", error.message);
        }
    };

    return (
        <div className="relative inline-block text-left" ref={dropdownRef}>
            {username ? (
                <>
                    <button
                        type="button"
                        className="inline-flex justify-center w-full gap-x-1.5 rounded-md px-3 py-2 text-sm font-semibold shadow-sm transform transition duration-150 ease-in-out active:translate-y-1"
                        id="menu-button"
                        aria-expanded="true"
                        aria-haspopup="true"
                        onClick={() => setShowDropdown((prev) => !prev)}
                        style={buttonStyles}  // Apply custom styles here
                    >
                        {username}
                        <svg
                            className="-mr-1 h-5 w-5 text-gray-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                        >
                            <path
                                fillRule="evenodd"
                                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </button>

                    {showDropdown && (
                        <div
                            className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                            role="menu"
                            aria-orientation="vertical"
                            aria-labelledby="menu-button"
                        >
                            <div className="py-1" role="none">
                                <button
                                    className="block w-full px-4 py-2 text-left text-sm text-gray-700"
                                    role="menuitem"
                                    onClick={() => {
                                        if (uid) {
                                            router.push(`/profile?uid=${uid}`);
                                        }
                                    }}
                                >
                                    Profile
                                </button>
                                <button
                                    className="block w-full px-4 py-2 text-left text-sm text-gray-700"
                                    role="menuitem"
                                    onClick={() => {
                                        console.log("Settings Clicked");
                                    }}
                                >
                                    Settings
                                </button>
                                <button
                                    className="block w-full px-4 py-2 text-left text-sm text-gray-700"
                                    role="menuitem"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <button
                    className="inline-flex justify-center w-full rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    onClick={() => router.push("/login")}
                    style={buttonStyles}  // Apply custom styles here as well
                >
                    Login
                </button>
            )}
        </div>
    );
};

export default UserMenu;