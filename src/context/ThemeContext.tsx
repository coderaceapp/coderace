import React, { createContext, useState, useEffect, ReactNode } from 'react';

interface ThemeColors {
    background: string;
    text: string;
    buttonBackground: string;
    buttonTextRun: string;
    buttonTextSubmit: string;
    header: string;  // New property for header color
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

const lightTheme: ThemeColors = {
    background: '#f9f9f9',
    text: '#333',
    buttonBackground: '#e0e0e0',
    buttonTextRun: '#FFDD00',
    buttonTextSubmit: '#00FF00',
    header: '#000',
    powerUpModal: {
        background: '#ffffff',
        text: '#333333',
        buttonBackground: '#e0e0e0',
        buttonText: '#333333',
        closeButton: '#ff5555',
        closeButtonHover: '#ff8888',
        titleGradientStart: '#ffdd00',
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

interface ThemeContextProps {
    theme: 'light' | 'dark';
    colors: ThemeColors;
    toggleTheme: () => void;
}

interface ThemeProviderProps {
    children: ReactNode;
}

export const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [colors, setColors] = useState<ThemeColors>(lightTheme);

    // Toggle between light and dark themes
    const toggleTheme = () => {
        if (theme === 'light') {
            setTheme('dark');
            setColors(darkTheme);
        } else {
            setTheme('light');
            setColors(lightTheme);
        }
    };

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
        if (savedTheme) {
            setTheme(savedTheme);
            setColors(savedTheme === 'light' ? lightTheme : darkTheme);
        }
    }, []);

    return (
        <ThemeContext.Provider value={{ theme, colors, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};