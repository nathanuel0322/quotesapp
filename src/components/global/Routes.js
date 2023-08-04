import React, {useContext, useState, useEffect} from 'react';
import { SafeAreaView, StatusBar, StyleSheet, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../../firebase';
import { AuthContext } from './AuthProvider';

import Theme from './theme';
import Globals  from '../../GlobalValues';
import Tabs from './bottomNavigation';
import AuthStack from './AuthStack';


export const Routes = () => {
  const {user, setUser} = useContext(AuthContext);
  
  if (auth.currentUser != null){
    Globals.currentUserId = auth.currentUser.uid;
  }

  onAuthStateChanged(auth, (user) => {
    setUser(user);
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser); 
    return () => unsubscribe(); 
  }, [])

    return (
      <SafeAreaView style={styles.safearea}>
        <NavigationContainer theme={Theme}>
          <View style={styles.safearea}>
            <StatusBar barStyle="light-content" />
            {user ? 
              <Tabs />
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
    backgroundColor: '#0A0B14',
  }, 
});
