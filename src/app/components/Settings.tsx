import React, { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';  // Import the ThemeContext

const Settings: React.FC = () => {

    // Access the theme context
    const themeContext = useContext(ThemeContext);

    // Safety check to ensure ThemeContext is not undefined
    if (!themeContext) {
        throw new Error('ThemeContext is undefined. Make sure you are using ThemeProvider to wrap the component.');
    }

    const { theme, toggleTheme, colors } = themeContext;

    return (
        <div
            style={{
                padding: '20px',
                backgroundColor: colors.background,  // Use background color from current theme
                color: colors.text,  // Use text color from current theme
            }}
        >
            <h2 style={{ color: colors.text }}>Settings</h2>

            {/* Theme Toggle Section */}
            <div style={{ marginBottom: '20px' }}>
                <label style={{ color: colors.text }}>Theme: </label>
                <button
                    onClick={toggleTheme}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: colors.buttonBackground,  // Use button background from theme
                        color: colors.text,  // Use the text color that matches the current theme
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                    }}
                >
                    Switch to {theme === 'dark' ? 'Light' : 'Dark'} Mode
                </button>
            </div>
        </div>
    );
};

export default Settings;