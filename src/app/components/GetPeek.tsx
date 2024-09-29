import React from 'react';

interface GetPeekProps {
    code: string[];
    handleClose: () => void;
}

const GetPeek: React.FC<GetPeekProps> = ({ code, handleClose }) => {
    return (
        <div>
            <h2>Get Peek</h2>
            <p>The opponent's code is blurred, but you can see its structure:</p>
            <pre style={{ backgroundColor: '#333', color: '#fff', padding: '10px', borderRadius: '5px' }}>
                {code.map((line, index) => (
                    <div
                        key={index}
                        style={{
                            filter: 'blur(5px)', // Apply blur effect
                            pointerEvents: 'none', // Prevent interaction
                        }}
                    >
                        {line}
                    </div>
                ))}
            </pre>
            <button onClick={handleClose} style={{
                backgroundColor: '#00bfff',
                color: '#fff',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                marginTop: '10px'
            }}>
                Close
            </button>
        </div>
    );
};

export default GetPeek;
