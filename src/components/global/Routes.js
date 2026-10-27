import React, {useContext, useState, useEffect, useRef, createRef} from 'react';
import { SafeAreaView, StatusBar, StyleSheet, View, Linking, Platform, ActivityIndicator } from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../../firebase';
import { AuthContext } from './AuthProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useTheme } from './ThemeContext';
import Globals  from '../../GlobalValues';
import Tabs from './bottomNavigation';
import AuthStack from './AuthStack';

const PERSISTENCE_KEY = 'NAVIGATION_STATE_V1';

export const Routes = () => {
  const [isReady, setIsReady] = useState(false);
  const [initialState, setInitialState] = useState();
  const {user, setUser} = useContext(AuthContext);
  const navcontainerRef = createRef();
  const { colors, navigationTheme } = useTheme();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser); 
    return () => unsubscribe(); 
  }, [])

  useEffect(() => {
    const restoreState = async () => {
      try {
        const initialUrl = await Linking.getInitialURL();

        if (Platform.OS !== 'web' && initialUrl == null) {
          // Only restore state if there's no deep link and we're not on web
          const savedStateString = await AsyncStorage.getItem(PERSISTENCE_KEY);
          const state = savedStateString ? JSON.parse(savedStateString) : undefined;

          if (state !== undefined) {
            setInitialState(state);
          }
        }
      } finally {
        setIsReady(true);
      }
    };

    if (!isReady) {
      restoreState();
    }
  }, [isReady]);

  if (!isReady) {
    return (
      <View style={[styles.safearea, styles.loading, { backgroundColor: colors.background }]}>
        <ActivityIndicator color={colors.text} />
      </View>
    )
  }
  
  if (auth.currentUser != null){
    Globals.currentUserId = auth.currentUser.uid;
  }

  return (
    <SafeAreaView style={[styles.safearea, { backgroundColor: colors.background }]}>
      <NavigationContainer initialState={initialState} theme={navigationTheme} ref={navcontainerRef} onStateChange={(state) => 
        AsyncStorage.setItem(PERSISTENCE_KEY, JSON.stringify(state))
      }>
        <View style={[styles.safearea, { backgroundColor: colors.background }]}>
          <StatusBar barStyle={colors.statusBarStyle} backgroundColor={colors.background} />
          {user ? 
            <Tabs navcontainerRef={navcontainerRef} />
          : 
            <AuthStack />
          }
        </View>
      </NavigationContainer>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safearea: {
    width: '100%',
    height: '100%',
  },
  loading: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
