import React, { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext'; // Import ThemeContext

interface CodeOutputProps {
    exampleOutputs: {
        name: string;
        userOutput: string;
        expectedOutput: string;
        evaluation: string;
        isCorrect: boolean;
    }[];
    activeTab: number;
    setActiveTab: (index: number) => void;
    validatorOutput: string;
    isValidating: boolean;
    isCorrect: boolean | null;
}

const CodeOutput: React.FC<CodeOutputProps> = ({
    exampleOutputs,
    activeTab,
    setActiveTab,
    validatorOutput,
    isValidating,
    isCorrect
}) => {

    const themeContext = useContext(ThemeContext);

    // Safety check to ensure ThemeContext is defined
    if (!themeContext) {
        throw new Error('ThemeContext is undefined. Ensure that ThemeProvider is wrapping the component.');
    }

    const { colors } = themeContext;

    return (
        <div
            style={{
                backgroundColor: colors.background,
                padding: '20px',
                borderRadius: '15px',
                marginTop: '20px',
                width: '100%',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                display: 'flex',
                justifyContent: 'space-between',
                gap: '20px',
            }}
        >
            {/* Run Code Output Section with Tabs */}
            <div style={{ width: '48%' }}>
                <h4 style={{ fontSize: "1.25em", color: '#888888', marginBottom: '10px', textAlign: 'center' }}>
                    Run Code Output
                </h4>

                {/* Tabs */}
                <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '10px' }}>
                    {exampleOutputs.map((example, index) => (
                        <button
                            key={index}
                            onClick={() => setActiveTab(index)}
                            style={{
                                backgroundColor: activeTab === index ? colors.buttonBackground : colors.background,
                                color: example.isCorrect ? '#43A146' : 'red',  // Green if correct, red if incorrect
                                padding: '10px',
                                borderRadius: '10px',
                                cursor: 'pointer',
                                border: 'none',
                                transition: 'background-color 0.3s ease',
                            }}
                        >
                            {example.name}
                        </button>
                    ))}
                </div>

                {/* Conditional rendering for example output */}
                {exampleOutputs.length > 0 && exampleOutputs[activeTab] ? (
                    <div
                        style={{
                            backgroundColor: colors.buttonBackground,
                            padding: '10px',
                            borderRadius: '10px',
                            minHeight: '150px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            color: colors.text,
                            fontSize: "1.25em",
                            whiteSpace: 'pre-wrap',
                            overflowY: 'auto',
                        }}
                    >
                        {/* <div style={{ textAlign: 'center', marginBottom: '10px' }}>
                            <strong>Your Output:</strong>
                        </div>
                        <pre>{exampleOutputs[activeTab].userOutput}</pre>

                        <div style={{ textAlign: 'center', margin: '20px 0' }}>
                            <strong>Expected Output:</strong>
                        </div> */}
                        <pre>{exampleOutputs[activeTab].expectedOutput}</pre>

                        <div style={{ textAlign: 'center', marginTop: '20px' }}>
                            <strong>Result:</strong>
                            <span style={{ color: exampleOutputs[activeTab].isCorrect ? '#43A146' : 'red' }}>
                                {exampleOutputs[activeTab].isCorrect ? 'Correct' : 'Incorrect'}
                            </span>
                        </div>

                        {/* Display evaluation explanation */}
                        <div style={{ textAlign: 'center', marginTop: '20px' }}>
                            <strong>Explanation:</strong>
                            <pre>{exampleOutputs[activeTab].evaluation}</pre>
                        </div>
                    </div>
                ) : (
                    <div style={{ fontSize: "1.25em", color: colors.header, textAlign: 'center', padding: '10px' }}>
                        No output available. Please submit the code.
                    </div>
                )}
            </div>

            {/* Validator Output Section */}
            <div style={{ width: '48%' }}>
                <h4 style={{ fontSize: "1.25em", color: '#888888', marginBottom: '10px', textAlign: 'center' }}>
                    Validator Output
                </h4>

                <div
                    style={{
                        backgroundColor: colors.buttonBackground,
                        padding: '10px',
                        borderRadius: '10px',
                        minHeight: '150px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontSize: "1.25em",
                        whiteSpace: 'pre-wrap',
                        overflowY: 'auto',
                        color: isCorrect === null ? '#ffffff' : isCorrect ? '#43A146' : 'red',
                    }}
                >
                    {isValidating ? (
                        <p>Validating...</p>  // Replace with your loading animation if desired
                    ) : (
                        <pre>{validatorOutput}</pre>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CodeOutput;