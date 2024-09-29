import React, { useState, useEffect, useContext, useCallback } from 'react';
import { ThemeContext } from '../../context/ThemeContext';  // Import ThemeContext
import questionsData from '../data/questions.json';

interface Question {
    id: number;
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
    onProblemFetched: (problem: Question | null) => void;
    moveToNextProblem: () => void;
    currentProblemIndex: number;
    setStartTimer: (shouldStart: boolean) => void;
    gameStarted: boolean;
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
    onProblemFetched,
    setStartTimer,
    gameStarted
}) => {
    const [difficulty, setDifficulty] = useState<string>('easy');
    const [problemSet, setProblemSet] = useState<Question[]>([]);
    const [currentProblemIndex, setCurrentProblemIndex] = useState<number>(0);
    const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
    const [hasGameStarted, setHasGameStarted] = useState(false);
    const [isQuestionBlurred, setIsQuestionBlurred] = useState(true);
    const [showNextButton, setShowNextButton] = useState(false); // Show "Next" button after correct answer

    const themeContext = useContext(ThemeContext);

    if (!themeContext) {
        throw new Error('ThemeContext is undefined. Ensure that ThemeProvider is wrapping the component.');
    }

    const { colors } = themeContext;

    // Function to fetch a new question from the same difficulty level
    const fetchSingleQuestion = useCallback(() => {
        const filteredQuestions = questionsData.questions.filter(q => q.difficulty === difficulty);
        const randomQuestion = filteredQuestions[Math.floor(Math.random() * filteredQuestions.length)];
        setProblemSet([randomQuestion]);
        setCurrentQuestion(randomQuestion);
        onProblemFetched(randomQuestion);
    }, [difficulty, onProblemFetched]);

    // Ensure questions are only fetched once when the component mounts
    useEffect(() => {
        if (!hasGameStarted) {
            fetchSingleQuestion(); // Fetch a question only once
        }
    }, [fetchSingleQuestion, hasGameStarted]);

    // When a question is answered correctly, show the "Next" button
    useEffect(() => {
        if (isCorrect && mode === 'single') {
            setShowNextButton(true);  // Show the "Next" button after a correct answer
            setStartTimer(false);  // Stop the timer when the question is answered correctly
        }
    }, [isCorrect, mode, setStartTimer]);

    // Handle Start Game
    const handleStartGame = () => {
        setIsQuestionBlurred(false);
        setStartTimer(true);
        setHasGameStarted(true);
        setShowNextButton(false);  // Hide the "Next" button when a new game starts
        onStartMatch();
    };

    // Handle changing difficulty (always present in single-player mode)
    const handleDifficultyChange = (newDifficulty: string) => {
        if (newDifficulty !== difficulty) {
            setDifficulty(newDifficulty);
            setShowNextButton(false);  // Reset the "Next" button when difficulty changes
            fetchSingleQuestion();  // Fetch a new question from the selected difficulty
            setStartTimer(true);  // Start the timer for the new question
        }
    };

    // Handle moving to the next question manually (single-player)
    const handleNextQuestion = () => {
        setShowNextButton(false);
        fetchSingleQuestion();  // Fetch a new question from the same difficulty level
        setStartTimer(true);  // Restart the timer for the new question
    };

    return (
        <div
            style={{
                width: '48%',
                backgroundColor: colors.background,
                padding: '10px',
                borderRadius: '10px', // Adjusted border-radius
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start', // Align items to the top
                minHeight: '300px', // Ensure the height remains constant
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                color: colors.text,
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: "1.25em",
            }}
        >
            {/* Difficulty Dropdown for Single Player */}
            {mode === 'single' && (
                <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <label style={{ color: '#aaaaaa', marginRight: '5px' }}>Difficulty:</label>
                    <select
                        value={difficulty}
                        onChange={(e) => handleDifficultyChange(e.target.value)}
                        style={{
                            backgroundColor: colors.background,
                            color: colors.text,
                            padding: '5px',
                            borderRadius: '5px', // Adjusted padding and border-radius
                            border: `1px solid ${colors.text}`,
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
            <div style={{ width: '100%' }}> {/* Ensure full width */}
                <h3 style={{ padding: "5px", color: '#aaaaaa', marginBottom: '10px' }}>Problem Description</h3>
                <div style={{
                    filter: isQuestionBlurred ? 'blur(5px)' : 'none',
                    transition: 'filter 0.3s ease',
                }}>
                    {currentQuestion ? (
                        <div>
                            <p><strong style={{ color: '#39FF14' }}>Difficulty:</strong> {currentQuestion.difficulty}</p>
                            <p><strong style={{ color: '#39FF14' }}>Question:</strong> {currentQuestion.question}</p>
                            <p><strong style={{ color: '#39FF14' }}>Expected Output:</strong> {currentQuestion.expected_output}</p>
                        </div>
                    ) : (
                        <p>Loading question...</p>
                    )}
                </div>
            </div>

            {/* Next Button (Visible after answering correctly in single-player mode) */}
            {showNextButton && (
                <button
                    onClick={handleNextQuestion}
                    style={{
                        backgroundColor: colors.buttonBackground,
                        color: colors.buttonTextRun,
                        padding: '10px',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        fontSize: '16px',  // Adjusted font-size for better alignment
                        marginTop: '10px',  // Adjusted margin-top
                        border: 'none',
                    }}
                >
                    Next Question
                </button>
            )}

            {/* Start Game Button */}
            {!hasGameStarted && (
                <button
                    onClick={handleStartGame}
                    style={{
                        backgroundColor: colors.buttonBackground,
                        color: colors.buttonTextRun,
                        padding: '10px',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        fontSize: '16px', // Adjusted font-size for better alignment
                        marginTop: '10px',  // Adjusted margin-top
                        border: 'none',
                    }}
                >
                    Start Game
                </button>
            )}
        </div>
    );
};

export default ProblemDescription;
