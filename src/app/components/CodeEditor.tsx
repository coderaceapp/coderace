import React, { useRef, useEffect, useState, useContext } from 'react';
import { useCodeMirror } from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { javascript } from "@codemirror/lang-javascript";
import { cpp } from "@codemirror/lang-cpp";
import axios from 'axios';
import LoadingAnimation from './LoadingAnimation';
import { ThemeContext } from '../../context/ThemeContext'; // Import ThemeContext
import { usePyodide } from '../hooks/usePyodide'; // Import usePyodide hook
import { EditorView } from "@codemirror/view";
import { eventBus } from '../utils/EventBus';

interface CodeEditorProps {
    code: string;
    setCode: (code: string) => void;
    runCode: (output: string) => void;
    checkCode: (evaluation: any[]) => void;
    language: 'python' | 'javascript' | 'C++';
    setLanguage: (language: 'python' | 'javascript' | 'C++') => void;
    isLoading: boolean;
    currentProblem: {
        question: string;
        expected_output: string;
        example_1: string;
        example_2: string;
        example_3: string;
    } | null;
    setStartTimer: (shouldStart: boolean) => void;
    pyodide: any;
    moveToNextProblem: () => void;
    mode: 'single' | 'multiplayer';
    gameStarted: boolean;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
    code,
    setCode,
    runCode,
    checkCode,
    language,
    setLanguage,
    currentProblem,
    setStartTimer,
    moveToNextProblem,
    mode,
    gameStarted,
}) => {
    const { pyodide, isLoading: isPyodideLoading } = usePyodide();
    const editorRef = useRef<HTMLDivElement | null>(null);
    const [isRunning, setIsRunning] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);  // Timer state
    const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);

    const themeContext = useContext(ThemeContext);

    if (!themeContext) {
        throw new Error('ThemeContext is undefined. Make sure you are using ThemeProvider to wrap the component.');
    }

    const { colors } = themeContext;

    // Timer handling functions
    const startTimer = () => {
        if (!timerInterval) {
            const interval = setInterval(() => {
                setElapsedTime(prevTime => prevTime + 1);
            }, 1000);
            setTimerInterval(interval);
        }
    };

    const stopTimer = () => {
        if (timerInterval) {
            clearInterval(timerInterval);
            setTimerInterval(null);
        }
    };

    const resetTimer = () => {
        setElapsedTime(0);
        stopTimer();
    };

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const getDefaultCode = (lang: 'python' | 'javascript' | 'C++'): string => {
        switch (lang) {
            case 'python':
                return "# Write your Python code here...";
            case 'javascript':
                return "// Write your JavaScript code here...";
            case 'C++':
                return `#include <iostream>
using namespace std;

int main() {
   // Write your C++ code here...
   return 0;
}`;
            default:
                return "";
        }
    };

    const pasteBlockerExtension = EditorView.domEventHandlers({
        paste: (event) => {
            event.preventDefault(); // Prevent paste action
        },
    });

    // Initialize the code editor with the current problem's code
    const { setContainer } = useCodeMirror({
        container: editorRef.current,
        value: code,
        height: "300px",
        extensions: [
            language === "python" ? python() : language === "javascript" ? javascript() : cpp(),
            pasteBlockerExtension,
        ],
        onChange: (value) => {
            setCode(value);
            console.log('Code updated: ', value);  // Debug logging
        },
    });

    // Ensure the code editor is set up correctly
    useEffect(() => {
        if (editorRef.current) {
            setContainer(editorRef.current);
        }
    }, [editorRef.current, setContainer, language]);

    // Reset code when language changes
    useEffect(() => {
        setCode(getDefaultCode(language));
    }, [language, setCode]);

    const handleRunCode = async () => {
        console.log('Running code...');
        if (!currentProblem) {
            console.error("No problem selected to run code against.");
            return;
        }

        if (language === 'python') {
            if (isPyodideLoading) {
                runCode('Pyodide is still loading. Please wait...');
                return;
            }

            if (!pyodide) {
                runCode('Pyodide is not initialized.');
                return;
            }

            setIsRunning(true);
            try {
                pyodide.runPython(`
                   import sys
                   from io import StringIO
                   sys.stdout = stdout = StringIO()
                   sys.stderr = stderr = StringIO()
               `);

                await pyodide.loadPackagesFromImports(code);
                pyodide.runPython(code);

                const stdout = pyodide.runPython("stdout.getvalue()");
                const stderr = pyodide.runPython("stderr.getvalue()");

                const output = stderr ? `Error: ${stderr}` : stdout || 'No output returned.';

                eventBus.emit("output", { message: output });
                runCode(output);  // Pass the output back to the UI
                console.log('Code output: ', output);  // Debug logging

                return output;
            } catch (error) {
                console.error("Error running Python code:", error);
            } finally {
                setIsRunning(false);
            }
        } else if (language === 'javascript') {
            setIsRunning(true);
            try {
                let output = '';
                const originalLog = console.log;
                console.log = (msg) => { output += msg + '\n'; };
                eval(code);
                console.log = originalLog;
                const message = output || 'No output returned';
                eventBus.emit("output", { message: message });
                runCode(message);  // Pass the output back to the UI
                console.log('Code output: ', message);  // Debug logging
            } catch (error) {
                console.error("Error running JavaScript code:", error);
            } finally {
                setIsRunning(false);
            }
        }
    };

    const handleSubmitCode = async () => {
        console.log('Submitting code:', code);
        if (!currentProblem) {
            alert("No problem selected.");
            return;
        }

        setIsSubmitting(true);

        const testCases = [
            { name: 'Example 1', expected_output: currentProblem.example_1 },
            { name: 'Example 2', expected_output: currentProblem.example_2 },
            { name: 'Example 3', expected_output: currentProblem.example_3 },
        ];

        try {
            const evaluationResults = await Promise.all(
                testCases.map(async (testCase) => {
                    const response = await axios.post("/api/gpt-check", {
                        code,
                        question: currentProblem.question,
                        expected_output: testCase.expected_output,
                        language,
                    });

                    return {
                        name: testCase.name,
                        userOutput: response.data.user_output || 'No output',  // Add user output
                        expectedOutput: testCase.expected_output,
                        evaluation: response.data.evaluation,
                        isCorrect: response.data.evaluation.includes("Correct"),
                    };
                })
            );

            checkCode(evaluationResults);  // Pass the array of evaluation results

            const allCorrect = evaluationResults.every(result => result.isCorrect);

            // Stop the timer if the code is correct
            if (allCorrect) {
                stopTimer();  // Stop the timer on successful code submission
                moveToNextProblem();
            }
        } catch (error) {
            console.error("Error submitting code:", error);
            alert("An error occurred while submitting the code.");
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        if (gameStarted) {
            startTimer();
        } else {
            stopTimer();
        }
    }, [gameStarted]);

    return (
        <div
            id="code-editor"
            style={{
                width: '48%',
                backgroundColor: colors.background,
                padding: '20px',
                borderRadius: '15px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '300px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                color: colors.text,
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '1.25em',
            }}
        >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ color: colors.text }}>Code Interpreter</h3>
                {/* Timer Display */}
                <div style={{ fontSize: '1.25em', color: colors.text }}>Timer: {formatTime(elapsedTime)}</div>
            </div>

            <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as 'python' | 'javascript' | 'C++')}
                style={{
                    backgroundColor: colors.background,
                    color: colors.text,
                    padding: '10px',
                    borderRadius: '10px',
                    border: `1px solid ${colors.text}`,
                    cursor: 'pointer',
                    appearance: 'none',
                    transition: 'background-color 0.3s ease',
                }}
            >
                <option value="python">Python</option>
                <option value="javascript">JavaScript</option>
                <option value="C++">C++</option>
            </select>

            <div ref={editorRef} style={{ marginTop: "10px" }} />

            <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginTop: "20px" }}>
                <button
                    onClick={handleRunCode}
                    style={{
                        backgroundColor: colors.buttonBackground,
                        color: colors.buttonTextRun,
                        padding: '10px',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        fontSize: '25px'
                    }}
                    disabled={isRunning || isSubmitting}
                >
                    {isRunning ? <LoadingAnimation /> : "Run Code"}
                </button>

                <button
                    onClick={handleSubmitCode}
                    style={{
                        backgroundColor: colors.buttonBackground,
                        color: colors.buttonTextSubmit,
                        padding: '10px',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        fontSize: '25px'
                    }}
                    disabled={isRunning || isSubmitting}
                >
                    {isSubmitting ? <LoadingAnimation /> : "Submit Code"}
                </button>
            </div>
        </div>
    );
};

export default CodeEditor;
