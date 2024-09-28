import React, { useState, useEffect, useCallback, useContext } from 'react';
import PlayerConnectionStatus from './PlayerConnectionStatus';
import WrappedMultipleQuestionRetriever from './WrappedMultipleQuestionRetreiver';
import { ThemeContext } from '../../context/ThemeContext';  // Import ThemeContext

interface Question {
    id: string;
    difficulty: string;
    question: string;
    expected_output: string;
    example_1: string;
    example_2: string;
    example_3: string;
}

interface ProblemDescriptionProps {
    mode: "multiplayer" | "single";
    isConnected: boolean;
    ws: WebSocket | null;
    roomCode: string;
    playerCount: number;
    onStartMatch: () => void;
    validatorOutput: string;
    isCorrect: boolean | null;
    onProblemFetched: (problem: Question | null) => void;  // Pass the current problem to parent
}

const ProblemDescription: React.FC<ProblemDescriptionProps> = ({
    mode,
    isConnected,
    ws,
    roomCode,
    playerCount,
    onStartMatch,
    validatorOutput,
    isCorrect,
    onProblemFetched  // New prop to pass problem up to parent
}) => {
    const [difficulty, setDifficulty] = useState<string>('easy');  // Default difficulty is 'easy'
    const [problemSet, setProblemSet] = useState<Question[]>([]);  // Store a set of problems
    const [currentProblemIndex, setCurrentProblemIndex] = useState<number>(0);  // Track current problem
    const [completedProblems, setCompletedProblems] = useState<number>(0);  // Track completed problems

    const themeContext = useContext(ThemeContext);

    // Safety check to ensure ThemeContext is defined
    if (!themeContext) {
        throw new Error('ThemeContext is undefined. Ensure that ThemeProvider is wrapping the component.');
    }

    const { colors } = themeContext;

    const currentQuestion = problemSet[currentProblemIndex];

    // Handle setting problem set (multiple questions)
    const handleQuestionSetFetched = useCallback((questions: Question[]) => {
        const newProblems = questions.slice(0, 5);
        setProblemSet(newProblems);
        if (newProblems.length > 0) {
            console.log("Current Problem:", newProblems[0]);
            onProblemFetched(newProblems[0]);  // Set the first question in the set
        }
    }, [onProblemFetched]);

    // Move to the next problem if the user's answer is correct
    useEffect(() => {
        if (isCorrect) {
            if (currentProblemIndex < problemSet.length - 1) {
                setTimeout(() => {
                    const nextIndex = currentProblemIndex + 1;
                    setCurrentProblemIndex(nextIndex);
                    setCompletedProblems((prevCount) => prevCount + 1);
                    console.log("Next Problem:", problemSet[nextIndex]);
                    onProblemFetched(problemSet[nextIndex]);  // Pass the next problem to the parent
                }, 1000);  // Delay progression to show feedback
            } else {
                console.log("No more problems in the set.");
                // Optionally, show a message or reset the state
                alert("Congratulations! You have completed all the problems.");
                // Here you can trigger an action (e.g., fetch more problems, reset, etc.)
            }
        }
    }, [isCorrect, currentProblemIndex, problemSet.length, onProblemFetched]);

    // Progress Bar
    const progressPercentage = problemSet.length
        ? ((completedProblems) / problemSet.length) * 100
        : 0;

    // Handle difficulty selection
    const handleDifficultyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setDifficulty(event.target.value);
    };

    return (
        <div
            style={{
                width: '48%',
                backgroundColor: colors.background,  // Use background color from theme
                padding: '20px',
                borderRadius: '15px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '300px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                color: colors.text,  // Use text color from theme
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: "1.25em",
            }}
        >
            {/* Difficulty Dropdown for Single Player */}
            {mode === 'single' && (
                <div
                    style={{
                        marginBottom: '15px',
                        position: 'relative',
                    }}
                >
                    <label style={{ color: '#aaaaaa' }}>Select Difficulty:</label>
                    <select
                        value={difficulty}
                        onChange={handleDifficultyChange}
                        style={{
                            backgroundColor: colors.background,  // Use dropdown background from theme
                            color: colors.text,  // Use dropdown text color from theme
                            padding: '10px',
                            borderRadius: '10px',
                            border: `1px solid ${colors.text}`,  // Border color matches text
                            cursor: 'pointer',
                            appearance: 'none',
                            transition: 'background-color 0.3s ease',
                        }}
                    >
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                    </select>
                </div>
            )}

            {/* Problem Description */}
            <div>
                <h3 style={{ padding: "10px", color: '#aaaaaa', marginBottom: '15px' }}>Problem Description</h3>
                {problemSet.length > 0 && problemSet[currentProblemIndex] ? (
                    <div>
                        <p><strong style={{ marginBottom: "10px", color: '#39FF14' }}>Difficulty:</strong> {problemSet[currentProblemIndex].difficulty}</p>
                        <p><strong style={{ marginBottom: "10px", color: '#39FF14' }}>Question:</strong> {problemSet[currentProblemIndex].question}</p>
                        <p><strong style={{ marginBottom: "10px", color: '#39FF14' }}>Expected Output:</strong> {problemSet[currentProblemIndex].expected_output}</p>
                    </div>
                ) : (
                    <p>No question available. Please wait or check your connection.</p>
                )}
            </div>

            {/* Fetch 5 problems based on difficulty */}
            <WrappedMultipleQuestionRetriever difficulty={difficulty} onQuestionsFetched={handleQuestionSetFetched} />

            {/* Player Connection Status */}
            {mode === "multiplayer" && (
                <PlayerConnectionStatus
                    mode={mode}  // Use actual mode
                    isConnected={isConnected}  // Pass actual connection status
                    ws={ws}  // Pass WebSocket connection
                    roomCode={roomCode}
                    playerCount={playerCount}
                    onStartMatch={onStartMatch}
                />
            )}

            {/* Problem Progress Bar */}
            <div style={{ marginBottom: '15px' }}>
                <div
                    style={{
                        backgroundColor: '#888',
                        height: '10px',
                        borderRadius: '5px',
                        width: '100%',
                    }}
                >
                    <div
                        style={{
                            backgroundColor: colors.buttonTextSubmit,  // Progress bar color from theme
                            height: '100%',
                            width: `${progressPercentage}%`,
                            transition: 'width 0.3s ease',
                            borderRadius: '5px',
                        }}
                    />
                </div>
                <p style={{ color: '#aaa', textAlign: 'center', marginTop: '5px' }}>
                    {completedProblems} / {problemSet.length} problems completed
                </p>
            </div>
        </div>
    );
};

export default ProblemDescription;