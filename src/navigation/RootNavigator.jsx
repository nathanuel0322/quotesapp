import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '../context/AuthProvider';
import { useTheme } from '../theme/ThemeProvider';
import { Loading } from '../components/ui';
import Tabs from './Tabs';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import ProfileScreen from '../screens/ProfileScreen';
import QuoteDetailScreen from '../screens/QuoteDetailScreen';
import FollowListScreen from '../screens/FollowListScreen';
import UserSearchScreen from '../screens/UserSearchScreen';
import SettingsScreen from '../screens/SettingsScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import BlockedAccountsScreen from '../screens/BlockedAccountsScreen';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { user, profile } = useAuth();
  const { navTheme, colors, fonts, isDark } = useTheme();

  // wait for the restored session, and for the profile doc of a signed-in user
  if (user === undefined || (user && !profile)) {
    return (
      <>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <Loading />
      </>
    );
  }

  const screenOptions = {
    headerStyle: { backgroundColor: colors.background },
    headerTintColor: colors.text,
    headerTitleStyle: { fontFamily: fonts.bold, fontSize: 17 },
    headerShadowVisible: false,
    headerBackButtonDisplayMode: 'minimal',
    contentStyle: { backgroundColor: colors.background },
  };

  return (
    <NavigationContainer theme={navTheme}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack.Navigator screenOptions={screenOptions}>
        {user ? (
          <>
            <Stack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }} />
            <Stack.Screen name="UserProfile" component={ProfileScreen} options={{ title: '' }} />
            <Stack.Screen name="QuoteDetail" component={QuoteDetailScreen} options={{ title: '' }} />
            <Stack.Screen name="FollowList" component={FollowListScreen} />
            <Stack.Screen name="UserSearch" component={UserSearchScreen} options={{ title: 'Find people' }} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ title: 'Edit profile' }} />
            <Stack.Screen name="BlockedAccounts" component={BlockedAccountsScreen} options={{ title: 'Blocked accounts' }} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Signup" component={SignupScreen} options={{ title: '', headerTransparent: true }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
