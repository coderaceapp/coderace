"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { db } from "../lib/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import HomeButton from "../components/HomeButton";

interface UserProfile {
    username: string;
    email: string;
    createdAt: string;
}

const ProfilePage: React.FC = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const uid = searchParams?.get("uid");
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

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
        return <div className="text-white p-4">Loading...</div>;
    }

    if (!userProfile) {
        return <div className="text-white p-4">User profile not found.</div>;
    }

    return (
        <div>
            <HomeButton />
            <div className="text-white p-6 max-w-lg mx-auto mt-10 bg-gray-900 rounded-lg shadow-lg">

                {/* Username as the main heading */}
                <h1 className="text-3xl font-bold mb-4">{userProfile.username}</h1>

                {/* Email */}
                <div className="mb-2">
                    <strong>Email:</strong> {userProfile.email}
                </div>

                {/* Account Created Date */}
                <div className="mb-2">
                    <strong>Account Created On:</strong> {userProfile.createdAt}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
