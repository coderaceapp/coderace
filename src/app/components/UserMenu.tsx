"use client";

import React, { useState, useEffect, useRef, useContext } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "../lib/firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { ThemeContext } from '../../context/ThemeContext';  // Import the ThemeContext
import Settings from './Settings';  // Import Settings

interface UserMenuProps {
    buttonStyles: React.CSSProperties;  // Accept buttonStyles prop
}

const UserMenu: React.FC<UserMenuProps> = ({ buttonStyles }) => {
    const [username, setUsername] = useState<string | null>(null);
    const [uid, setUid] = useState<string | null>(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const [showSettings, setShowSettings] = useState(false);  // State to toggle settings view

    const themeContext = useContext(ThemeContext);  // Access the theme context

    if (!themeContext) {
        console.error('ThemeContext is unavailable!');
        return null;
    }

    const { colors, theme } = themeContext;  // Destructure colors and theme

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
            window.location.href = "/login"; // Force reload to apply theme changes
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
                        style={{
                            ...buttonStyles,
                            backgroundColor: colors.buttonBackground,  // Apply dynamic button background
                            color: colors.text,  // Apply dynamic text color
                        }}  // Apply custom styles here
                    >
                        {username}
                        <svg
                            className="-mr-1 h-5 w-5 text-gray-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            style={{ color: colors.text }}  // Apply dynamic color to icon
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
                            style={{
                                backgroundColor: colors.background,  // Apply dynamic dropdown background
                                color: colors.text,  // Apply dynamic dropdown text color
                            }}
                        >
                            <div className="py-1" role="none">
                                <button
                                    className="block w-full px-4 py-2 text-left text-sm text-gray-700"
                                    role="menuitem"
                                    style={{
                                        backgroundColor: 'transparent',
                                        color: colors.text,
                                    }}
                                    onClick={() => {
                                        if (uid) {
                                            // Trigger a full page reload to the profile page
                                            window.location.href = `/profile?uid=${uid}`;
                                        }
                                    }}
                                >
                                    Profile
                                </button>
                                <button
                                    className="block w-full px-4 py-2 text-left text-sm"
                                    style={{ backgroundColor: 'transparent', color: colors.text }}
                                    onClick={() => setShowSettings(true)}  // Toggle settings view
                                >
                                    Settings
                                </button>
                                <button
                                    className="block w-full px-4 py-2 text-left text-sm text-gray-700"
                                    role="menuitem"
                                    style={{
                                        backgroundColor: 'transparent',
                                        color: colors.text,
                                    }}
                                    onClick={handleLogout}
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    )}

                    {showSettings && (
                        <div style={{
                            position: 'fixed',
                            top: '0',
                            left: '0',
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            zIndex: 1000,
                        }}>
                            <div style={{
                                backgroundColor: colors.background,
                                color: colors.text,
                                padding: '20px',
                                borderRadius: '10px',
                                maxWidth: '400px',
                                width: '100%',
                            }}>
                                <Settings />  {/* Render Settings component */}
                                <button
                                    style={{
                                        marginTop: '20px',
                                        padding: '10px 20px',
                                        backgroundColor: colors.buttonBackground,
                                        color: colors.text,
                                        border: 'none',
                                        borderRadius: '5px',
                                        cursor: 'pointer',
                                    }}
                                    onClick={() => setShowSettings(false)}  // Close settings modal
                                >
                                    Close Settings
                                </button>
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <button
                    className="inline-flex justify-center w-full rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    onClick={() => window.location.href = "/login"}  // Full reload for login
                    style={{
                        ...buttonStyles,
                        backgroundColor: colors.buttonBackground,  // Dynamic theme color
                        color: colors.text,  // Dynamic text color
                    }}  // Apply custom styles here as well
                >
                    Login
                </button>
            )}
        </div>
    );
};

export default UserMenu;
