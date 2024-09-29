'use client';

import React, { useState, useEffect, useCallback, useContext } from "react";
import Navbar from './Navbar';
import ProblemDescription from './ProblemDescription';
import CodeEditor from './CodeEditor';
import CodeOutput from './CodeOutput';
import Modal from './Modals';
import { ApolloProvider } from '@apollo/client';
import client from '../lib/apolloClient';
import { runCode } from '../utils/codeUtils';
import { usePyodide } from '../hooks/usePyodide';
import NavigationModal from './NavigationModal';
import PowerUpsBar from './PowerUpsBar';
import WrappedMultipleQuestionRetriever from './WrappedMultipleQuestionRetriever';  // Import the retriever
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
    const [language, setLanguage] = useState<'python' | 'javascript' | 'C++'>('python');
    const [showDropdown, setShowDropdown] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
    const [validatorOutput, setValidatorOutput] = useState<string>("");
    const [isValidating, setIsValidating] = useState(false);
    const [showHostModal, setShowHostModal] = useState(false);
    const [showJoinModal, setShowJoinModal] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    const [exampleOutputs, setExampleOutputs] = useState<{
        name: string;
        userOutput: string;
        expectedOutput: string;
        isCorrect: boolean;
    }[]>([]);
    const [activeTab, setActiveTab] = useState(0);
    const [connectedPlayers, setConnectedPlayers] = useState<boolean[]>([false, false]);
    const [mode, setMode] = useState<"multiplayer" | "single">("multiplayer");
    const [isConnected, setIsConnected] = useState(false);
    const [currentProblemIndex, setCurrentProblemIndex] = useState<number>(0);
    const [problemSet, setProblemSet] = useState<Question[]>([]);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);  // Initially null, then true/false based on validation


    const themeContext = useContext(ThemeContext);


    if (!themeContext) {
        throw new Error('ThemeContext is undefined. Make sure you are using ThemeProvider to wrap the component.');
    }


    const { colors } = themeContext;

    const pyodide = usePyodide();

    const [isModalVisible, setIsModalVisible] = useState(false);

    // Toggle the modal visibility
    const toggleModal = () => {
        setIsModalVisible(prev => !prev);  // Toggle the modal state
    };

    // Open the modal when the Escape key is pressed
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsModalVisible(true);  // Open the modal
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    const handleProblemFetched = (questions: Question | Question[] | null) => {
        if (questions) {
            if (Array.isArray(questions) && questions.length > 0) {
                if (mode === "multiplayer") {
                    setProblemSet(questions);  // Set the entire problem set in multiplayer
                    const firstQuestion = questions[0];
                    setCurrentProblemIndex(0);  // Reset the problem index
                    setCurrentQuestion(firstQuestion);  // Set the first question as current
                }
            } else if (mode === "single" && questions) {
                setCurrentQuestion(questions as Question);  // Handle a single question
            }
        } else {
            console.error("No questions found or questions is undefined.");
        }
    };

    const moveToNextProblem = useCallback(() => {
        setCurrentProblemIndex((prevIndex) => prevIndex + 1);
    }, []);

    const handleCheckCode = (evaluationResults: any[]) => {
        setExampleOutputs(evaluationResults);
        const allCorrect = evaluationResults.every((result) => result.isCorrect);
        setIsCorrect(allCorrect);  // Update the `isCorrect` state based on validation result
        if (allCorrect) {
            moveToNextProblem();
        }
    };

    useEffect(() => {
        if (problemSet.length > 0 && !currentQuestion) {
            setCurrentQuestion(problemSet[0]);  // Set the first problem if not set
        }
    }, [problemSet]);

    const handleRunCode = async () => {
        await runCode(language, code, pyodide, currentQuestion, setOutput, setExampleOutputs, setActiveTab);
    };

    const [code, setCode] = useState<string>("# Write your Python code here...");

    // Global Event Listener for Escape Key
    useEffect(() => {
        const handleKeydown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                // Toggle the modal visibility
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
                <div style={{ fontSize: "2em", display: "flex", justifyContent: "center", padding: "20px" }}>
                    coderace.io
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
                            isConnected={true}
                            ws={null}
                            roomCode="test"
                            playerCount={1}
                            onStartMatch={() => setGameStarted(true)}  // Start game when clicked
                            validatorOutput={validatorOutput}
                            isCorrect={isCorrect}  // Pass the state here
                            onProblemFetched={handleProblemFetched}
                            moveToNextProblem={moveToNextProblem}
                            currentProblemIndex={currentProblemIndex}
                            setStartTimer={() => { }}  // Implement timer functionality if needed
                            gameStarted={gameStarted}
                        />

                        {/* PlayerConnectionStatus handles all WebSocket connection logic */}

                        {mode === "multiplayer" && (
                            <div style={{ padding: "0 10px" }}>
                                <PowerUpsBar />
                            </div>
                        )}

                        <CodeEditor
                            code={code}
                            setCode={setCode}
                            runCode={handleRunCode}  // This is the function handling the code execution
                            checkCode={handleCheckCode}  // This checks whether the code output is correct
                            language={language}
                            setLanguage={setLanguage}
                            currentProblem={currentQuestion}  // Pass the current problem here
                            pyodide={pyodide}
                            moveToNextProblem={moveToNextProblem}  // Move to the next problem when correct
                            gameStarted={gameStarted}
                        />
                    </div>

                    <CodeOutput
                        exampleOutputs={exampleOutputs}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        validatorOutput={validatorOutput}
                        isValidating={isValidating}
                    />
                    {output}
                </div>

                <Modal
                    show={showHostModal}
                    handleClose={() => console.log('Close modal')}
                    isHostModal={true}
                    setConnectedPlayers={setConnectedPlayers}
                />
                <Modal
                    show={showJoinModal}
                    handleClose={() => console.log('Close modal')}
                    isHostModal={false}
                    setConnectedPlayers={setConnectedPlayers}
                />

                <div>
                    {/* Modal is triggered by Escape and closed by buttons inside the modal */}
                    <NavigationModal
                        isVisible={isModalVisible}
                        onClose={() => setIsModalVisible(false)}  // Close the modal via buttons inside
                    />
                </div>
            </div>
        </ApolloProvider>
    );
};

export default Home;