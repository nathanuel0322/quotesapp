import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DarkTheme, DefaultTheme } from '@react-navigation/native';

const APPEARANCE_KEY = 'appearance';

const shared = {
  accent: '#FF765E',
  accentAlt: '#F84263',
  blue: '#177DDC',
  like: '#2ECC71',
  pass: '#E84749',
  danger: '#E84749',
  onAccent: '#FFFFFF',
};

export const palettes = {
  dark: {
    ...shared,
    background: '#0A0B14',
    surface: '#1D202D',
    surfaceAlt: '#0E111C',
    border: '#2A2E3F',
    text: '#FFFFFF',
    textMuted: '#C2C4D4',
    placeholder: '#7C7F93',
    overlay: 'rgba(10, 11, 20, 0.72)',
    tabBar: '#0E111C',
  },
  light: {
    ...shared,
    background: '#F6F6FA',
    surface: '#FFFFFF',
    surfaceAlt: '#ECEDF3',
    border: '#DCDDE6',
    text: '#0A0B14',
    textMuted: '#5A5D70',
    placeholder: '#9A9DB0',
    overlay: 'rgba(10, 11, 20, 0.62)',
    tabBar: '#FFFFFF',
  },
};

export const fonts = {
  regular: 'Gilroy',
  semibold: 'Gilroy-SemiBold',
  bold: 'Gilroy-Bold',
};

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const system = useColorScheme();
  // 'system' | 'dark' | 'light'
  const [preference, setPreferenceState] = useState('dark');

  useEffect(() => {
    AsyncStorage.getItem(APPEARANCE_KEY)
      .then((val) => val && setPreferenceState(val))
      .catch(() => {});
  }, []);

  const setPreference = (val) => {
    setPreferenceState(val);
    AsyncStorage.setItem(APPEARANCE_KEY, val).catch(() => {});
  };

  const scheme = preference === 'system' ? (system ?? 'dark') : preference;

  const value = useMemo(() => {
    const colors = palettes[scheme];
    const base = scheme === 'dark' ? DarkTheme : DefaultTheme;
    const navTheme = {
      ...base,
      dark: scheme === 'dark',
      colors: {
        ...base.colors,
        primary: colors.accent,
        background: colors.background,
        card: colors.surfaceAlt,
        text: colors.text,
        border: colors.border,
        notification: colors.accentAlt,
      },
    };
    return { scheme, isDark: scheme === 'dark', colors, fonts, navTheme, preference, setPreference };
  }, [scheme, preference]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}

// Build a StyleSheet that depends on the current palette, memoized per scheme.
export function useStyles(factory) {
  const theme = useTheme();
  // factories are module-level functions, so the palette is the only real dependency
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => factory(theme.colors, theme), [theme.scheme]);
}
