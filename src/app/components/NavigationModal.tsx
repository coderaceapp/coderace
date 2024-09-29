import React, { useContext } from 'react';
import Settings from './Settings';  // Ensure the path is correct
import { ThemeContext } from '../../context/ThemeContext';  // Import ThemeContext

interface NavigationModalProps {
    isVisible: boolean;
    onClose: () => void;
}

const NavigationModal: React.FC<NavigationModalProps> = ({ isVisible, onClose }) => {
    const themeContext = useContext(ThemeContext);

    if (!themeContext) {
        throw new Error('ThemeContext is undefined. Ensure that ThemeProvider is wrapping the component.');
    }

    const { colors } = themeContext;

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
                <h2 style={{ color: colors.text }}>Navigation</h2>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    <li>
                        <button
                            onClick={() => onClose()}  // Close the modal via this button
                            style={{
                                backgroundColor: colors.buttonBackground,
                                color: colors.text,
                                padding: '10px',
                                borderRadius: '5px',
                                border: 'none',
                                width: '100%',
                                marginBottom: '10px',
                                cursor: 'pointer',
                            }}
                        >
                            Close
                        </button>
                    </li>
                    {/* Add more navigation options here */}
                </ul>
            </div>
        </div>
    );
};

export default NavigationModal;
