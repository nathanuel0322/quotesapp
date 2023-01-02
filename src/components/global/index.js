import 'react-native-gesture-handler';
import React from 'react';
import { AuthProvider } from './AuthProvider';
import {Routes} from './Routes';
import { useWindowDimensions } from "react-native";
import Globals from '../../GlobalValues';

const Providers = () => {
  Globals.globalDimensions = useWindowDimensions();
  return (
    <AuthProvider>
      <Routes />
    </AuthProvider>
  );
}

export default Providers;