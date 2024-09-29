import React, { createContext, useState, useEffect, ReactNode } from 'react';

interface ThemeColors {
    background: string;
    text: string;
    buttonBackground: string;
    buttonTextRun: string;
    buttonTextSubmit: string;
    header: string;
    cardBackground: string;
    powerUpModal: {
        background: string;
        text: string;
        buttonBackground: string;
        buttonText: string;
        closeButton: string;
        closeButtonHover: string;
        titleGradientStart: string;
        titleGradientEnd: string;
    };
}

// Define three themes: light, dark, and ludicrous
const lightTheme: ThemeColors = {
    background: '#f9f9f9',
    text: '#333',
    buttonBackground: '#e0e0e0',
    buttonTextRun: '#d4af00', // Darker yellow for better contrast (changed from #FFDD00)
    buttonTextSubmit: '#006400', // Darker green for better contrast (changed from #00FF00)
    header: '#000',
    cardBackground: '#ffffff',
    powerUpModal: {
        background: '#ffffff',
        text: '#333333',
        buttonBackground: '#e0e0e0',
        buttonText: '#333333',
        closeButton: '#ff5555',
        closeButtonHover: '#ff8888',
        titleGradientStart: '#d4af00', // Updated gradient start to match darker yellow
        titleGradientEnd: '#ff007f',
    },
};

const darkTheme: ThemeColors = {
    background: '#161617',
    text: '#ffffff',
    buttonBackground: '#1f1f1f',
    buttonTextRun: '#FFDD00',
    buttonTextSubmit: '#00FF00',
    header: '#ffffff',
    cardBackground: '#1e1e1e',
    powerUpModal: {
        background: '#1e1e1e',
        text: '#ffffff',
        buttonBackground: '#ff007f',
        buttonText: '#ffffff',
        closeButton: '#ff5555',
        closeButtonHover: '#ff8888',
        titleGradientStart: '#ffdd00',
        titleGradientEnd: '#ff007f',
    },
};

const ludicrousTheme: ThemeColors = {
    background: '#ff00ff',
    text: '#00ffff',
    buttonBackground: '#ffff00',
    buttonTextRun: '#ff0000',
    buttonTextSubmit: '#0000ff',
    header: '#ff7f00',
    cardBackground: '#00ff7f',
    powerUpModal: {
        background: '#ff0ff0',
        text: '#7ff000',
        buttonBackground: '#00ff00',
        buttonText: '#ff0000',
        closeButton: '#00ff00',
        closeButtonHover: '#ff00ff',
        titleGradientStart: '#00ffff',
        titleGradientEnd: '#ff0000',
    },
};

interface ThemeContextProps {
    theme: 'light' | 'dark' | 'ludicrous';
    colors: ThemeColors;
    setTheme: (newTheme: 'light' | 'dark' | 'ludicrous') => void;
}

interface ThemeProviderProps {
    children: ReactNode;
}

export const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    const [theme, setTheme] = useState<'light' | 'dark' | 'ludicrous'>(() => {
        const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'ludicrous';
        return savedTheme || 'light';
    });

    const [colors, setColors] = useState<ThemeColors>(lightTheme);

    useEffect(() => {
        localStorage.setItem('theme', theme);
        switch (theme) {
            case 'light':
                setColors(lightTheme);
                break;
            case 'dark':
                setColors(darkTheme);
                break;
            case 'ludicrous':
                setColors(ludicrousTheme);
                break;
            default:
                setColors(lightTheme);
        }
    }, [theme]);

    const handleSetTheme = (newTheme: 'light' | 'dark' | 'ludicrous') => {
        setTheme(newTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, colors, setTheme: handleSetTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
