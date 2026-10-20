import React from 'react';
import { Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeProvider';
import HomeScreen from '../screens/HomeScreen';
import CreateScreen from '../screens/CreateScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { TAB_BAR_HEIGHT, tabBarBottom } from '../hooks/useTabBarSpace';

const Tab = createBottomTabNavigator();

const ICONS = {
  Home: ['home', 'home-outline'],
  Create: ['add-circle', 'add-circle-outline'],
  Profile: ['person', 'person-outline'],
};

export default function Tabs() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      safeAreaInsets={{ bottom: 0 }}
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          position: 'absolute',
          bottom: tabBarBottom(insets),
          marginHorizontal: 20,
          height: TAB_BAR_HEIGHT,
          paddingBottom: 0,
          borderRadius: 24,
          borderTopWidth: 0,
          backgroundColor: colors.tabBar,
          ...Platform.select({
            ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 16 },
            android: { elevation: 16 },
          }),
        },
        tabBarItemStyle: { height: TAB_BAR_HEIGHT, justifyContent: 'center' },
        tabBarIcon: ({ focused, color }) => (
          <Ionicons name={ICONS[route.name][focused ? 0 : 1]} size={route.name === 'Create' ? 30 : 26} color={color} />
        ),
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Create" component={CreateScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
