"use client";

import React, { useEffect, useState, useContext } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { db } from "../lib/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import HomeButton from "../components/HomeButton";
import { ThemeContext } from '../../context/ThemeContext';


interface UserProfile {
    username: string;
    email: string;
    createdAt: string;
    elo: number;
}

const ProfilePage: React.FC = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const uid = searchParams?.get("uid");
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const themeContext = useContext(ThemeContext);

    if (!themeContext) {
        console.error('ThemeContext is unavailable!');
        return null;
    }

    const { colors, theme } = themeContext;

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (!uid) {
                router.push("/login"); // Redirect to login if UID is not available
                return;
            }

            try {
                const userDoc = await getDoc(doc(db, "users", uid));
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setUserProfile({
                        username: userData?.username || "Unknown",
                        email: userData?.email || "Unknown",
                        createdAt: userData?.createdAt?.toDate().toLocaleString() || "Unknown",
                        elo: userData?.elo || 1400,
                    });
                } else {
                    console.error("User not found");
                }
            } catch (error) {
                console.error("Error fetching user profile: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [uid, router]);

    if (loading) {
        return <div style={{ color: colors.text, padding: '16px' }}>Loading...</div>;
    }

    if (!userProfile) {
        return <div style={{ color: colors.text, padding: '16px' }}>User profile not found.</div>;
    }

    return (
        <div style={{ backgroundColor: colors.background, minHeight: '100vh', padding: '20px' }}>
            <HomeButton />
            <div
                style={{
                    backgroundColor: colors.cardBackground, // Use card or surface background color
                    color: colors.text,
                    padding: '24px',
                    maxWidth: '600px',
                    margin: '40px auto 0',
                    borderRadius: '10px',
                    boxShadow: `0px 4px 8px rgba(0, 0, 0, 0.3)`,
                }}
            >
                {/* Username as the main heading */}
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '16px', color: colors.text }}>
                    {userProfile.username}
                </h1>

                {/* Email */}
                <div style={{ marginBottom: '8px', color: colors.text }}>
                    <strong>Email:</strong> {userProfile.email}
                </div>

                {/* Account Created Date */}
                <div style={{ marginBottom: '8px', color: colors.text }}>
                    <strong>Account Created </strong> {userProfile.createdAt}
                </div>

                {/* Elo rating */}
                <div style={{ marginBottom: '8px', color: colors.text }}>
                    <strong>Elo:</strong> {userProfile.elo}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
