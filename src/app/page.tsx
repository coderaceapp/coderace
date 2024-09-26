"use client";

import React, { useState, useEffect, useRef } from "react";
import { useCodeMirror } from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { javascript } from "@codemirror/lang-javascript";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrophy, faGamepad, faUserFriends } from "@fortawesome/free-solid-svg-icons";
import questions from "../app/data/questions.json";
import { io } from 'socket.io-client';
import './globals.css';

interface Question {
    id: number;
    difficulty: string;
    question: string;
    expected_output: string;
}

const Home: React.FC = () => {
    const [code, setCode] = useState<string>("# Write your Python code here...");
    const [output, setOutput] = useState<string>("");
    const [language, setLanguage] = useState<"python" | "javascript">("python");
    const [mode, setMode] = useState<"single" | "multiplayer">("single");
    const [showDropdown, setShowDropdown] = useState(false);
    const [pyodide, setPyodide] = useState<any>(null); // Pyodide instance
    const editorRef = useRef<HTMLDivElement | null>(null);
    const [gameStarted, setGameStarted] = useState(false);
    const [playerStreak, setPlayerStreak] = useState(0); // New streak tracker
    const [opponentStreak, setOpponentStreak] = useState(0);
    const socketRef = useRef<any>(null);
    const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);

    // Initialize Pyodide
    useEffect(() => {
        const initializePyodide = async () => {
            if (typeof window !== "undefined") {
                try {
                    const script = document.createElement("script");
                    script.src = "https://cdn.jsdelivr.net/pyodide/v0.22.1/full/pyodide.js";
                    script.async = true;
                    script.onload = async () => {
                        const pyodideInstance = await (window as any).loadPyodide();
                        console.log("Pyodide loaded");
                        setPyodide(pyodideInstance);
                    };
                    document.body.appendChild(script);
                } catch (error) {
                    console.error("Failed to load Pyodide:", error);
                }
            }
        };

        if (language === "python") {
            initializePyodide();
        }
    }, [language]);

    const runPythonCode = async () => {
        if (pyodide) {
            try {
                // Redirect Python print output
                pyodide.runPython(`
                    import sys
                    from io import StringIO
                    sys.stdout = StringIO()
                `);
                await pyodide.runPythonAsync(code); // Run the user's Python code
                const result = pyodide.runPython('sys.stdout.getvalue()'); // Get the printed output
                setOutput(result || 'No output');
            } catch (error: unknown) {
                if (error instanceof Error) {
                    setOutput(`Error: ${error.message}`);
                } else {
                    setOutput('An unknown error occurred.');
                }
            }
        } else {
            setOutput('Pyodide is not ready yet');
        }
    };

    const runJavaScriptCode = () => {
        try {
            const result = eval(code);
            setOutput(result !== undefined ? result.toString() : 'No output');
        } catch (error: unknown) {
            if (error instanceof Error) {
                setOutput(`Error: ${error.message}`);
            } else {
                setOutput('An unknown error occurred.');
            }
        }
    };

    // Handle running code based on the selected language
    const runCode = async () => {
        if (language === 'javascript') {
            runJavaScriptCode();
        } else if (language === 'python') {
            await runPythonCode();
        }
    };

    // Initialize socket connection
    useEffect(() => {
        socketRef.current = io('http://localhost:3001');
        socketRef.current.on('game-start', () => {
            setGameStarted(true);
        });

        socketRef.current.on('update-progress', (data: any) => {
            setOpponentStreak(data.opponentStreak);
        });

        socketRef.current.on('code-erased', () => {
            setCode('');
        });

        return () => {
            socketRef.current.disconnect();
        };
    }, []);

    const startGame = () => {
        socketRef.current.emit('start-game');
    };

    const handleSolveProblem = () => {
        setPlayerStreak((prevStreak) => prevStreak + 1);
        socketRef.current.emit('player-progress', { playerStreak });
    };

    const eraseOpponentCode = () => {
        socketRef.current.emit('erase-opponent-code', socketRef.current.id);
    };

    useEffect(() => {
        if (questions && questions.questions.length > 0) {
            setCurrentQuestion(questions.questions[0]);
        }
    }, []);

    const { setContainer } = useCodeMirror({
        container: editorRef.current,
        value: code,
        height: "300px",
        extensions: [language === "python" ? python() : javascript()],
        onChange: (value) => setCode(value),
    });

    useEffect(() => {
        if (editorRef.current) {
            setContainer(editorRef.current);
        }
    }, [editorRef.current, setContainer, language]);

    return (
        <div style={{ fontFamily: "JetBrains Mono", color: "#ffffff", backgroundColor: "black", minHeight: "100vh" }}>
            {/* Dark-themed Navbar */}
            <nav
                style={{
                    display: "flex",
                    justifyContent: "space-around",
                    alignItems: "center",
                    backgroundColor: "#161617",
                    padding: "5px 10px",
                    borderRadius: "15px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                    width: "60%",
                    margin: "3% auto 20px auto", // Center the navbar
                }}
            >
                <button style={{ color: "#aaaaaa", fontSize: "14px" }}>
                    <FontAwesomeIcon icon={faTrophy} /> Rankings
                </button>
                <button style={{ color: "#aaaaaa", fontSize: "14px" }}>
                    <FontAwesomeIcon icon={faGamepad} /> Join a Game
                </button>
                <button style={{ color: "#aaaaaa", fontSize: "14px" }}>
                    <FontAwesomeIcon icon={faUserFriends} /> Host a Game
                </button>

                {/* Dropdown for Single/Multiplayer */}
                <div style={{ position: "relative", display: "inline-block" }}>
                    <button
                        className="dropbtn"
                        onClick={() => setShowDropdown(!showDropdown)}
                        style={{
                            backgroundColor: "#161617",
                            color: "#aaaaaa",
                            padding: "10px 15px",
                            fontSize: "14px",
                            border: "none",
                            cursor: "pointer",
                            borderRadius: "5px",
                        }}
                    >
                        {mode === "single" ? "Single Player" : "Multiplayer"}
                    </button>

                    {/* Show or hide dropdown based on showDropdown state */}
                    {showDropdown && (
                        <ul
                            style={{
                                listStyle: "none",
                                padding: 0,
                                margin: 0,
                                position: "absolute",
                                top: "100%",
                                left: 0,
                                backgroundColor: "#161617",
                                boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.2)",
                                zIndex: 1,
                                borderRadius: "5px",
                                overflow: "hidden",
                            }}
                        >
                            <li>
                                <button
                                    onClick={() => {
                                        setMode("single");
                                        setShowDropdown(false);
                                    }}
                                    style={{
                                        backgroundColor: "#161617",
                                        color: "#aaaaaa",
                                        padding: "12px 16px",
                                        textAlign: "left",
                                        border: "none",
                                        width: "100%",
                                        cursor: "pointer",
                                        borderBottom: "1px solid #444",
                                    }}
                                >
                                    Single Player
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => {
                                        setMode("multiplayer");
                                        setShowDropdown(false);
                                    }}
                                    style={{
                                        backgroundColor: "#161617",
                                        color: "#aaaaaa",
                                        padding: "12px 16px",
                                        textAlign: "left",
                                        border: "none",
                                        width: "100%",
                                        cursor: "pointer",
                                    }}
                                >
                                    Multiplayer
                                </button>
                            </li>
                        </ul>
                    )}
                </div>
            </nav>

            <div style={{ textAlign: 'center' }}>
                {!gameStarted ? <button onClick={startGame}>Start Game</button> : <p>Game has started!</p>}
            </div>

            {/* Progress and Streak UI */}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                <div style={{ backgroundColor: '#161617', padding: '10px', borderRadius: '15px', marginRight: '20px' }}>
                    <h4>Your Streak: {playerStreak}</h4>
                    {playerStreak >= 3 && (
                        <button onClick={eraseOpponentCode} style={{ backgroundColor: 'red', color: 'white', padding: '10px', borderRadius: '5px', cursor: 'pointer' }}>
                            Erase Opponent's Code!
                        </button>
                    )}
                </div>

                <div style={{ backgroundColor: '#161617', padding: '10px', borderRadius: '15px' }}>
                    <h4>Opponent's Streak: {opponentStreak}</h4>
                </div>
            </div>


            {/* Main content with problem description and code editor */}
            <div style={{ display: "flex", justifyContent: "space-between", width: "80%", margin: "0 auto" }}>
                <div style={{ width: "48%", backgroundColor: "#161617", padding: "20px", borderRadius: "15px" }}>
                    <h3 style={{ color: "#aaaaaa" }}>Problem</h3>
                    {currentQuestion ? (
                        <>
                            <p>
                                <strong>Difficulty:</strong> {currentQuestion.difficulty}
                            </p>
                            <p>
                                <strong>Question:</strong> {currentQuestion.question}
                            </p>
                            <p>
                                <strong>Expected Output:</strong> {currentQuestion.expected_output}
                            </p>
                        </>
                    ) : (
                        <p>Please select a question to view the details.</p>
                    )}
                </div>

                <div style={{ width: "48%", backgroundColor: "#161617", padding: "20px", borderRadius: "15px" }}>
                    <h3 style={{ color: "#aaaaaa" }}>Code Interpreter</h3>
                    <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value as 'python' | 'javascript')}
                        style={{ backgroundColor: '#161617', color: '#ffffff', padding: '5px', borderRadius: '5px', border: 'none' }}
                    >
                        <option value="python">Python</option>
                        <option value="javascript">JavaScript</option>
                    </select>
                    <div ref={editorRef} style={{ marginTop: '10px' }} />
                    <button
                        onClick={runCode}
                        style={{
                            backgroundColor: '#161617',
                            color: '#aaaaaa',
                            padding: '10px',
                            borderRadius: '10px',
                            marginTop: '10px',
                            cursor: 'pointer',
                        }}
                    >
                        Run Code
                    </button>
                </div>
            </div>

            {/* Output box */}
            <div
                style={{
                    backgroundColor: '#161617',
                    padding: '20px',
                    borderRadius: '15px',
                    marginTop: '20px',
                    width: '80%',
                    margin: '20px auto',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                }}
            >
                <h4 style={{ color: '#888888' }}>Output:</h4>
                <pre style={{ color: '#ffffff', fontSize: '14px', whiteSpace: 'pre-wrap' }}>{output}</pre>
            </div>
        </div>
    );
};

export default Home;