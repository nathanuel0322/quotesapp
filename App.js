import React from 'react';
import { View } from 'react-native';
import { useFonts } from 'expo-font';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ToastManager from 'toastify-react-native';
import { ThemeProvider, useTheme } from './src/theme/ThemeProvider';
import { AuthProvider } from './src/context/AuthProvider';
import RootNavigator from './src/navigation/RootNavigator';
import { ActionSheetHost } from './src/components/ActionSheet';

function Toasts() {
  const { scheme } = useTheme();
  // useModal={false} so toasts never block taps on the screen behind them
  return <ToastManager theme={scheme} useModal={false} position="top" topOffset={60} />;
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Gilroy: require('./src/assets/fonts/Gilroy-Regular.otf'),
    'Gilroy-SemiBold': require('./src/assets/fonts/Gilroy-SemiBold.otf'),
    'Gilroy-Bold': require('./src/assets/fonts/Gilroy-Bold.otf'),
  });

  if (!fontsLoaded) return <View style={{ flex: 1, backgroundColor: '#0A0B14' }} />;

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <RootNavigator />
          <ActionSheetHost />
          <Toasts />
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
