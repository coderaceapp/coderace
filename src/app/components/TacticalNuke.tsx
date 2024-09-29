import React, { useState } from 'react';

interface TacticalNukeProps {
    code: string[]; // Code passed as an array of lines
    onConfirm: (updatedCode: string[]) => void; // Function to handle confirmation of the strike
}

const TacticalNuke: React.FC<TacticalNukeProps> = ({ code, onConfirm }) => {
    const [strikeLine, setStrikeLine] = useState<number | null>(null); // Track which line is struck

    const handleStrike = (lineIndex: number) => {
        setStrikeLine(lineIndex);
    };

    const handleConfirm = () => {
        if (strikeLine !== null) {
            const updatedCode = [...code]; // Copy current code

            // Function to remove an entire block (if, for, def, or function)
            const removeBlock = (startIndex: number) => {
                let endIndex = startIndex + 1;
                let braceCount = 0; // To track opening and closing braces for JS/C++
                let inFunction = false; // Track if we're inside a function in Python or JS/C++

                while (endIndex < updatedCode.length) {
                    const trimmedLine = updatedCode[endIndex].trim();

                    // Check for function definitions
                    if (trimmedLine.startsWith('def ')) {
                        inFunction = true; // We've entered a function block in Python
                    } else if (trimmedLine.startsWith('function ') || trimmedLine.match(/^\w+\s*\(.*\)\s*{/)) {
                        inFunction = true; // We've entered a function block in JS/C++
                        braceCount++; // Increase for new function definition
                    } else if (trimmedLine.endsWith('{')) {
                        braceCount++; // Increase for opening braces
                    } else if (trimmedLine.endsWith('}')) {
                        braceCount--; // Decrease for closing braces
                    } else if (trimmedLine.endsWith(':') && inFunction) {
                        // New block in Python
                        braceCount++;
                    }

                    // Stop if we hit another if, for, or function line at the same or higher indentation level
                    if (
                        (trimmedLine.startsWith('if ') || trimmedLine.startsWith('for ') ||
                            trimmedLine.startsWith('def ') || trimmedLine.startsWith('function ') ||
                            trimmedLine.match(/^\w+\s*\(.*\)\s*{/)) &&
                        braceCount === 0
                    ) {
                        break;
                    }

                    endIndex++;
                }

                updatedCode.splice(startIndex, endIndex - startIndex); // Remove the whole block
            };

            const clickedLine = updatedCode[strikeLine].trim();

            // Check if the clicked line starts a block
            if (clickedLine.startsWith('if ') || clickedLine.startsWith('for ') ||
                clickedLine.startsWith('def ') || clickedLine.startsWith('function ') ||
                clickedLine.match(/^\w+\s*\(.*\)\s*{/)) {
                removeBlock(strikeLine);
            }

            onConfirm(updatedCode); // Pass the updated code back to the parent
        }
    };

    return (
        <div>
            <h2>Tactical Nuke</h2>
            <p>Select a line to remove from the code:</p>
            <pre style={{ backgroundColor: '#333', color: '#fff', padding: '10px', borderRadius: '5px' }}>
                {code.map((line, index) => (
                    <div
                        key={index}
                        onClick={() => handleStrike(index)}
                        style={{
                            textDecoration: strikeLine === index ? 'line-through' : 'none',
                            cursor: 'pointer',
                            color: strikeLine === index ? '#ff4c4c' : '#fff',
                        }}
                    >
                        {line}
                    </div>
                ))}
            </pre>
            <button onClick={handleConfirm} style={{
                backgroundColor: '#ff4c4c',
                color: '#fff',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                marginTop: '10px'
            }}>
                Destroy
            </button>
        </div>
    );
};

export default TacticalNuke;