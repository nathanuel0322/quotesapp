import React from 'react';
import Providers from './src/components/global/index.js';
import { useWindowDimensions, Platform } from "react-native";
import { useFonts } from 'expo-font';

import Globals from './src/GlobalValues';

export default function App() {
  Globals.globalDimensions = useWindowDimensions();
  Globals.isLoading = true;
  Globals.platform = Platform.OS;
  
  useFonts({
    'Gilroy': require('./src/assets/fonts/Gilroy-Regular.otf'),
    'Gilroy-Bold': require('./src/assets/fonts/Gilroy-Bold.otf'),
    'Gilroy-SemiBold': require('./src/assets/fonts/Gilroy-SemiBold.otf'),
  });

  return (
    <Providers />
  )
}