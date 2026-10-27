import React from 'react';
import { useWindowDimensions, Platform, ActivityIndicator, View, StyleSheet } from "react-native";
import { useFonts } from 'expo-font';

import Providers from './src/components/global/index.js';
import Globals from './src/GlobalValues';
import { ThemeProvider, useTheme } from './src/components/global/ThemeContext.jsx';

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  )
}

function AppContent() {
  const { colors } = useTheme();
  Globals.globalDimensions = useWindowDimensions();
  Globals.isLoading = true;
  Globals.platform = Platform.OS;
  
  let [fontsLoaded] = useFonts({
    'Gilroy': require('./src/assets/fonts/Gilroy-Regular.otf'),
    'Gilroy-Bold': require('./src/assets/fonts/Gilroy-Bold.otf'),
    'Gilroy-SemiBold': require('./src/assets/fonts/Gilroy-SemiBold.otf'),
  });

  if (!fontsLoaded) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.text} />
      </View>
    )
  }

  return <Providers />
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
