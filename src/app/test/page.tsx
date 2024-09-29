"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '../lib/firebaseConfig';
import { doc, updateDoc, increment, getDoc } from 'firebase/firestore';
import HomeButton from '../components/HomeButton';

const TestPage: React.FC = () => {
    const router = useRouter();
    const [fakePlayerElo, setFakePlayerElo] = useState<number | null>(null);
    const [userElo, setUserElo] = useState<number | null>(null);

    useEffect(() => {
        const fetchUserElo = async () => {
            const user = auth.currentUser;

            if (!user) {
                return;
            }

            try {
                const userDoc = await getDoc(doc(db, "users", user.uid));
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setUserElo(userData?.elo || 1400);
                }
            } catch (error) {
                console.error("Error fetching user elo: ", error);
            }
        };

        fetchUserElo();
    }, []);

    const handleAddRandomElo = () => {
        // Generate random fake player elo
        const randomElo = Math.floor(Math.random() * 800) + 1200; // Elo between 1200 and 2000
        setFakePlayerElo(randomElo);
    };

    const handleWinOrLose = async (win: boolean) => {
        const user = auth.currentUser;

        if (!user) {
            alert("You must be logged in to update your elo");
            router.push('/login');
            return;
        }

        try {
            const eloChange = win ? 30 : -30; // Example elo change values
            const userRef = doc(db, "users", user.uid);

            await updateDoc(userRef, {
                elo: increment(eloChange),
            });

            setUserElo((prevElo) => (prevElo !== null ? prevElo + eloChange : 1400 + eloChange));
            alert(`Elo ${win ? "increased" : "decreased"} successfully!`);
        } catch (error: any) {
            console.error("Error updating elo: ", error.message);
        }
    };

    return (
        <div className="p-6 text-white">
            <HomeButton />
            <h1 className="text-2xl mb-4">Test Page</h1>
            <p className="mb-6">This is a test page</p>
            <button
                onClick={handleAddRandomElo}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mb-4"
            >
                Add Random Elo (Fake Player)
            </button>
            {fakePlayerElo !== null && (
                <p className="text-lg mb-4">Generated Fake Player Elo: {fakePlayerElo}</p>
            )}
            <br />
            <button
                onClick={() => handleWinOrLose(true)}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 mr-4"
            >
                Win Match
            </button>
            <button
                onClick={() => handleWinOrLose(false)}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
                Lose Match
            </button>
            <br />
            {userElo !== null && (
                <p className="text-lg mt-6">Your Current Elo: {userElo}</p>
            )}
        </div>
    );
};

export default TestPage;
