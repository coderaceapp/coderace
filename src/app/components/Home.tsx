'use client';

import React, { useState, useEffect, useContext, useCallback } from "react";
import Navbar from './Navbar';
import ProblemDescription from './ProblemDescription'; // Make sure this is the correct path
import CodeEditor from './CodeEditor';
import CodeOutput from './CodeOutput';
import Modal from './Modals';
import { ApolloProvider } from '@apollo/client';
import client from '../lib/apolloClient';
import { runCode } from '../utils/codeUtils';
import { useWebSocket } from '../hooks/useWebSocket';
import { usePyodide } from '../hooks/usePyodide';
import NavigationModal from './NavigationModal';
import PowerUpsBar from './PowerUpsBar';
import { ThemeContext } from '../../context/ThemeContext';  // Import ThemeContext

interface Question {
    id: number;
    difficulty: string;
    question: string;
    expected_output: string;
    example_1: string;
    example_2: string;
    example_3: string;
}

const Home: React.FC = () => {
    const [output, setOutput] = useState<string>("");
    const [language, setLanguage] = useState<"python" | "javascript">("python");
    const [showDropdown, setShowDropdown] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null); // Ensure this type matches the Question interface
    const [isLoading, setIsLoading] = useState(false);
    const [validatorOutput, setValidatorOutput] = useState<string>("");
    const [isValidating, setIsValidating] = useState(false);
    const [showHostModal, setShowHostModal] = useState(false);
    const [showJoinModal, setShowJoinModal] = useState(false);
    const [roomInput, setRoomInput] = useState<string>("");
    const [exampleOutputs, setExampleOutputs] = useState<{
        name: string;
        userOutput: string;
        expectedOutput: string;
        isCorrect: boolean;
    }[]>([]);
    const [activeTab, setActiveTab] = useState(0);
    const [mode, setMode] = useState<"multiplayer" | "single">("multiplayer");
    const [isConnected, setIsConnected] = useState(false);
    const [roomCode, setRoomCode] = useState<string>("");
    const [playerCount, setPlayerCount] = useState<number>(1);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [currentProblemIndex, setCurrentProblemIndex] = useState<number>(0);  // Index for the current problem
    const [problemSet, setProblemSet] = useState<Question[]>([]);  // Store a set of problems

    const themeContext = useContext(ThemeContext);

    // Safety check to ensure ThemeContext is defined
    if (!themeContext) {
        throw new Error('ThemeContext is undefined. Ensure that ThemeProvider is wrapping the component.');
    }

    const { colors } = themeContext;

    // Define isModalVisible state and its setter
    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleProblemFetched = (problem: Question | null) => {
        if (problem) {
            setCurrentQuestion(problem);  // Update the current question
        }
    };

    const pyodide = usePyodide(language);
    const ws = useWebSocket(mode, setRoomCode, setPlayerCount);

    const moveToNextProblem = useCallback(() => {
        if (currentProblemIndex < problemSet.length - 1) {
            const nextIndex = currentProblemIndex + 1;
            setCurrentProblemIndex(nextIndex);  // Update to the next problem
        } else {
            console.log("No more problems in the set.");
        }
    }, [currentProblemIndex, problemSet]);

    // state to control modal visibility
    const [code, setCode] = useState<string>("# Write your Python code here...");

    // When two players are connected, retrieve a question
    useEffect(() => {
        if (playerCount === 2 && problemSet.length === 0) {
            console.log("Fetching problems because both players are connected...");
            // Fetch problems logic here
        }
    }, [playerCount, problemSet.length]);

    useEffect(() => {
        setIsConnected(playerCount === 2);
    }, [playerCount]);

    const createRoom = () => {
        if (ws && ws.readyState === WebSocket.OPEN) {
            const code = Math.random().toString(36).substr(2, 5);
            ws.send(JSON.stringify({ type: "createRoom", roomCode: code }));
        }
    };

    const joinRoom = (code: string) => {
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: "joinRoom", roomCode: code }));
        }
    };

    const handleRunCode = async () => {
        await runCode(language, code, pyodide, currentQuestion, setOutput, setExampleOutputs, setActiveTab);
    };

    // Handle the checkCode functionality when submitting code to GPT
    const handleCheckCode = (evaluationResults: any[]) => {
        console.log('Check code result:', evaluationResults);

        // Check if all test cases are correct
        const allCorrect = evaluationResults.every(result => result.isCorrect === true);

        // Update the UI with evaluation results (for displaying in the output section)
        setExampleOutputs(evaluationResults);

        // If all examples are correct, move to the next problem
        if (allCorrect) {
            moveToNextProblem();  // Ensure this function is properly defined to move to the next question
        }
    };

    // Global Event Listener for Escape Key
    useEffect(() => {
        const handleKeydown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                // Toggle the modal visibility
                setIsModalVisible(prev => !prev);
            }
        };

        window.addEventListener('keydown', handleKeydown);
        return () => {
            window.removeEventListener('keydown', handleKeydown);
        };
    }, []);

    return (
        <ApolloProvider client={client}>
            <div style={{ fontFamily: "JetBrains Mono", color: colors.text, backgroundColor: colors.background, minHeight: "100vh" }}>
                {/* Add your logo here */}
                <div style={{ fontSize: "2em", display: "flex", justifyContent: "center", padding: "20px" }}>
                    coderacer.io
                </div>

                <div style={{ width: "80%", margin: "0 auto" }}>
                    <Navbar
                        setShowJoinModal={setShowJoinModal}
                        setShowHostModal={setShowHostModal}
                        mode={mode}
                        setMode={setMode}
                        showDropdown={showDropdown}
                        setShowDropdown={setShowDropdown}
                    />
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <ProblemDescription
                            mode={mode}
                            isConnected={isConnected}
                            ws={ws}
                            roomCode={roomCode}
                            playerCount={playerCount}
                            onStartMatch={() => console.log("Match started!")}
                            validatorOutput=""
                            isCorrect={null}
                            onProblemFetched={handleProblemFetched}  // Pass the current problem to this handler
                        />

                        <div style={{ padding: "0 10px" }}>  {/* Ensure a bit of padding for breathing room */}
                            <PowerUpsBar />
                        </div>

                        <CodeEditor
                            code={code}
                            setCode={setCode}
                            runCode={setValidatorOutput}
                            checkCode={handleCheckCode}
                            language={language}
                            setLanguage={setLanguage}
                            isLoading={isLoading}
                            currentProblem={currentQuestion}  // Use dynamic current question
                            setStartTimer={() => { }}
                            pyodide={pyodide}  // Make sure to pass the pyodide instance
                        />
                    </div>

                    <CodeOutput
                        exampleOutputs={exampleOutputs}  // Correctly pass the example outputs
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        validatorOutput={validatorOutput}
                        isValidating={isValidating}
                        isCorrect={isCorrect}
                    />
                </div>

                <Modal
                    show={showHostModal}
                    handleClose={() => setShowHostModal(false)}
                    createRoom={createRoom}
                    roomCode={roomCode}
                    isConnected={isConnected}
                    isHostModal={true}
                />
                <Modal
                    show={showJoinModal}
                    handleClose={() => setShowJoinModal(false)}
                    joinRoom={joinRoom}
                    setRoomCode={setRoomInput}
                    roomInput={roomInput}
                    isConnected={isConnected}
                    isHostModal={false}
                />

                {/* Navigation modal triggered by Escape key */}
                <NavigationModal isVisible={isModalVisible} onClose={() => setIsModalVisible(false)} />
            </div>
        </ApolloProvider>
    );
};

export default Home;