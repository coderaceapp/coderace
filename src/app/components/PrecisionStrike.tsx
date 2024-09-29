import React, { useState } from 'react';

interface PrecisionStrikeProps {
    code: string[]; // Code passed as an array of lines
    onConfirm: (updatedCode: string[]) => void; // Function to handle confirmation of the strike
}

const PrecisionStrike: React.FC<PrecisionStrikeProps> = ({ code, onConfirm }) => {
    const [strikeLine, setStrikeLine] = useState<number | null>(null); // Track which line is struck

    const handleStrike = (lineIndex: number) => {
        setStrikeLine(lineIndex);
    };

    const handleConfirm = () => {
        if (strikeLine !== null) {
            const updatedCode = code.filter((_, index) => index !== strikeLine); // Remove the selected line
            onConfirm(updatedCode); // Pass the updated code back to the parent
        }
    };

    return (
        <div>
            <h2>Precision Strike</h2>
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

export default PrecisionStrike;
