import React, { createContext, useContext, useState } from 'react';
import { Appearance } from 'react-native';

const ThemeContext = createContext();

export const useTheme = () => {
    return useContext(ThemeContext);
};

export const ThemeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(Appearance.getColorScheme() === 'dark');

    console.log("idm is:", isDarkMode)
    const toggleTheme = () => {
        setIsDarkMode((prev) => !prev);
    };

    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
