import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DarkTheme, DefaultTheme } from '@react-navigation/native';
import * as SystemUI from 'expo-system-ui';
import GlobalStyles from '../../GlobalStyles';

const THEME_PREFERENCE_KEY = 'THEME_PREFERENCE';
// 'system' follows the device setting; 'light' and 'dark' are overrides picked in Settings.
const PREFERENCES = ['system', 'light', 'dark'];

const ThemeContext = createContext();

export const useTheme = () => {
    return useContext(ThemeContext);
};

export const ThemeProvider = ({ children }) => {
    const systemScheme = useColorScheme();
    const [preference, setPreferenceState] = useState(null); // null until the saved value is read

    useEffect(() => {
        AsyncStorage.getItem(THEME_PREFERENCE_KEY)
            .then((saved) => setPreferenceState(PREFERENCES.includes(saved) ? saved : 'system'))
            .catch(() => setPreferenceState('system'));
    }, []);

    const setPreference = (value) => {
        setPreferenceState(value);
        AsyncStorage.setItem(THEME_PREFERENCE_KEY, value).catch((e) => console.log('Saving theme failed:', e));
    };

    const isDarkMode = (preference === 'system' || preference === null ? systemScheme : preference) === 'dark';
    const colors = isDarkMode ? GlobalStyles.themes.dark : GlobalStyles.themes.light;

    // Root view color shows behind screens during transitions and keyboard animations.
    useEffect(() => {
        SystemUI.setBackgroundColorAsync(colors.background).catch(() => {});
    }, [colors]);

    const value = useMemo(() => {
        const base = isDarkMode ? DarkTheme : DefaultTheme;
        return {
            isDarkMode,
            colors,
            preference,
            setPreference,
            toggleTheme: () => setPreference(isDarkMode ? 'light' : 'dark'),
            navigationTheme: {
                ...base,
                colors: {
                    ...base.colors,
                    primary: colors.accent,
                    background: colors.background,
                    card: colors.header,
                    text: colors.text,
                    border: colors.header,
                },
            },
        };
    }, [isDarkMode, colors, preference]);

    // Wait for the saved preference so the app doesn't flash the wrong theme on launch.
    if (preference === null) {
        return null;
    }

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};
