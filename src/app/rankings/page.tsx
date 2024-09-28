"use client"; // Ensure this is a Client Component

import React, { useState, useEffect, useContext } from 'react';
import HomeButton from '../components/HomeButton';
import { ThemeContext } from '../../context/ThemeContext'; // Import ThemeContext
import { ThemeProvider } from '../../context/ThemeContext'; // Import your ThemeProvider


// Define the structure of the ranking data with numeric keys
const singlePlayerData: Record<number, { name: string; time: number }[]> = {
    1: [
        { name: 'Player1', time: 120 },
        { name: 'Player2', time: 950 },
        { name: 'Player3', time: 870 },
        { name: 'Player4', time: 600 },
    ],
    2: [
        { name: 'PlayerA', time: 200 },
        { name: 'PlayerB', time: 180 },
        { name: 'PlayerC', time: 300 },
        { name: 'PlayerD', time: 250 },
    ],
    // Add rankings for each question...
};

const RankingsPage: React.FC = () => {
    const [selectedQuestionId, setSelectedQuestionId] = useState<number>(1); // Default to first question
    const [questions, setQuestions] = useState<{ id: number; question: string }[]>([]);
    const [currentRankings, setCurrentRankings] = useState(singlePlayerData[1]); // Default to question 1 rankings
    const [error, setError] = useState<string | null>(null);

    // Fetch theme context
    const themeContext = useContext(ThemeContext);

    // Fallback if context is unavailable
    if (!themeContext) {
        console.error('ThemeContext is unavailable!');
        return null;  // Optional: you can return a default loading UI or fallback UI here.
    }

    const { colors } = themeContext;

    // Handle question selection
    const handleQuestionSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = parseInt(event.target.value, 10);
        setSelectedQuestionId(selectedId);
        // Update rankings based on selected question
        setCurrentRankings(singlePlayerData[selectedId] || []);
    };

    if (error) return <p>{error}</p>;

    return (
        <ThemeProvider>
            <div style={{ fontFamily: "JetBrains Mono", color: colors.text, backgroundColor: colors.background, minHeight: "100vh", padding: "20px" }}>
                <nav className="relative flex items-center w-full px-5 mb-5">
                    <div className="flex-shrink-0">
                        <HomeButton />
                    </div>
                    <h2 className="absolute left-1/2 transform -translate-x-1/2 text-center" style={{ color: colors.text }}>
                        Rankings
                    </h2>
                </nav>


                {/* Tables Section */}
                <div style={{ display: "flex", justifyContent: "space-around", gap: "20px" }}>
                    {/* Single Player Ranking Table */}
                    <div style={{ backgroundColor: colors.background, padding: "20px", borderRadius: "15px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", width: "45%" }}>
                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "20px", position: "relative" }}>
                            {/* Dropdown for selecting a problem */}
                            <select
                                onChange={handleQuestionSelect}
                                value={selectedQuestionId || ""}
                                style={{
                                    backgroundColor: colors.buttonBackground,
                                    color: colors.text,
                                    padding: "10px",
                                    borderRadius: "5px",
                                    border: "none",
                                    cursor: "pointer",
                                    position: "absolute",
                                    left: "0",
                                    marginRight: "20px",
                                }}>
                                {questions.map((question) => (
                                    <option key={question.id} value={question.id}>
                                        {`Question ${question.id}`}
                                    </option>
                                ))}
                            </select>

                            <h3 style={{ color: colors.text, textAlign: "center", width: "100%" }}>
                                Single Player Rankings
                            </h3>
                        </div>

                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                                <tr style={{ backgroundColor: colors.buttonBackground, color: colors.text }}>
                                    <th style={{ padding: "10px", textAlign: "left" }}>Rank</th>
                                    <th style={{ padding: "10px", textAlign: "left" }}>Username</th>
                                    <th style={{ padding: "10px", textAlign: "right" }}>Time (seconds)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentRankings.map((user, index) => (
                                    <tr key={index} style={{ backgroundColor: index % 2 === 0 ? colors.background : colors.buttonBackground, color: colors.text }}>
                                        <td style={{ padding: "10px", textAlign: "left", borderBottom: `1px solid ${colors.text}` }}>{index + 1}</td>
                                        <td style={{ padding: "10px", textAlign: "left", borderBottom: `1px solid ${colors.text}` }}>{user.name}</td>
                                        <td style={{ padding: "10px", textAlign: "right", borderBottom: `1px solid ${colors.text}` }}>{user.time}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Multiplayer Ranking Table */}
                    <div style={{ backgroundColor: colors.background, padding: "20px", borderRadius: "15px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", width: "45%" }}>
                        <h3 style={{ textAlign: "center", marginBottom: "10px", color: colors.text }}>Multiplayer Rankings</h3>
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                                <tr style={{ backgroundColor: colors.buttonBackground, color: colors.text }}>
                                    <th style={{ padding: "10px", textAlign: "left" }}>Rank</th>
                                    <th style={{ padding: "10px", textAlign: "left" }}>Username</th>
                                    <th style={{ padding: "10px", textAlign: "right" }}>Points</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* Multiplayer data can go here */}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </ThemeProvider>
    );

};

export default RankingsPage;