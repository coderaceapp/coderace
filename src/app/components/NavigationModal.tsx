import React, { useState, useEffect, useContext } from 'react';
import Settings from './Settings';  // Ensure the path is correct
import { ThemeContext } from '../../context/ThemeContext';  // Import ThemeContext

interface NavigationModalProps {
    isVisible: boolean;
    onClose: () => void;
}

const NavigationModal: React.FC<NavigationModalProps> = ({ isVisible, onClose }) => {
    const [showSettings, setShowSettings] = useState(false);  // State to toggle settings view
    const themeContext = useContext(ThemeContext);

    if (!themeContext) {
        throw new Error('ThemeContext is undefined. Ensure that ThemeProvider is wrapping the component.');
    }

    const { colors } = themeContext;

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();  // Exit navigation modal
            }
        };

        if (isVisible) {
            document.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isVisible, onClose]);

    if (!isVisible) return null;  // Don't render the modal if it's not visible

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
        }}>
            <div style={{
                backgroundColor: colors.background,  // Use background color from theme
                padding: '30px',
                borderRadius: '15px',
                width: '400px',
                color: colors.text,  // Use text color from theme
                fontFamily: 'JetBrains Mono, monospace',
            }}>
                {showSettings ? (
                    <>
                        <Settings />
                        <button
                            onClick={() => setShowSettings(false)}  // Navigate back to the main menu
                            style={{
                                marginTop: '20px',
                                padding: '10px 20px',
                                backgroundColor: colors.buttonBackground,  // Use button background from theme
                                color: colors.text,  // Use text color from theme
                                border: 'none',
                                borderRadius: '10px',
                                cursor: 'pointer',
                            }}
                        >
                            Back to Menu
                        </button>
                    </>
                ) : (
                    <>
                        <h2 style={{ color: colors.text }}>Navigation</h2>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            <li>
                                <button
                                    onClick={() => setShowSettings(true)}  // Show settings
                                    style={{
                                        backgroundColor: colors.buttonBackground,  // Use button background from theme
                                        color: colors.text,  // Use text color from theme
                                        padding: '10px',
                                        borderRadius: '5px',
                                        border: 'none',
                                        width: '100%',
                                        marginBottom: '10px',
                                        cursor: 'pointer',
                                    }}
                                >
                                    Settings
                                </button>
                            </li>
                            {/* Add more navigation options here */}
                        </ul>
                        <button
                            onClick={onClose}
                            style={{
                                marginTop: '20px',
                                padding: '10px 20px',
                                backgroundColor: colors.buttonBackground,  // Use button background from theme
                                color: colors.text,  // Use text color from theme
                                border: 'none',
                                borderRadius: '10px',
                                cursor: 'pointer',
                            }}
                        >
                            Close
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default NavigationModal;
