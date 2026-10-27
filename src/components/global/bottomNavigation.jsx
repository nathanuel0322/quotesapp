import React, { useContext, useRef, useMemo, useCallback, useState } from 'react';
import { StyleSheet, TouchableOpacity, View, Pressable, Text, ScrollView } from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons, Feather, Ionicons } from '@expo/vector-icons';
import BottomSheet from '@gorhom/bottom-sheet';
import { AuthContext } from './AuthProvider';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import Home from '../../screens/Home';
import Create from '../../screens/Create';
import GlobalStyles from '../../GlobalStyles';
import Globals from '../../GlobalValues';
import { useTheme } from './ThemeContext';

import Sepline from '../../assets/icons/sepline.svg';
import SwitchIcon from '../../assets/icons/switchicon.svg';
import LogoutIcon from '../../assets/icons/logouticon.svg';
import SettingsStack from '../settings/SettingsStack';
import Profile from '../../screens/Profile';
import HomeStack from '../home/HomeStack';

const Tab = createBottomTabNavigator();

export default function Tabs({ navcontainerRef }) {
  const { logout } = useContext(AuthContext);
  const { colors } = useTheme();
  const bottomSheetRef = useRef(BottomSheet);
  const snapPoints = useMemo(() => [0.1, '25%'], []);
  const [tabBarHidden, setTabBarHidden] = useState(false);

  const expandBottomSheet = () => {
    bottomSheetRef.current.expand();
    setTabBarHidden(true);
  };

  const handleAnimate = useCallback((fromIndex) => {
    if (fromIndex === 1) {
      setTabBarHidden(false);
    }
  }, []); // Empty dependency array to ensure stability

  return (
    <GestureHandlerRootView style={[styles.container, { backgroundColor: colors.background }]}>
      <Tab.Navigator
        screenOptions={{ tabBarShowLabel: false, tabBarStyle: tabBarHidden ? GlobalStyles.hideTabBar : GlobalStyles.showTabBar(colors), }}
      >
        <Tab.Screen
          name="HomeStack"
          component={HomeStack}
          options={{
            headerShown: false,
            tabBarIcon: ({focused}) => (
              <View>
                <MaterialCommunityIcons name="window-closed-variant" size={24} color={focused ? colors.accent : colors.text} />
              </View>
            ),
          }}
        />
        <Tab.Screen
          name="Create"
          component={Create}
          options={{
            headerShown: false,
            tabBarIcon: ({focused}) => (
              <View>
                <MaterialCommunityIcons name="plus" size={24} color={focused ? colors.accent : colors.text} />
              </View>
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={Profile}
          options={{
            headerShown: false,
            tabBarIcon: ({focused}) => (
              <View>
                <Ionicons name="person" size={24} color={focused ? colors.accent : colors.text} />
              </View>
            ),
          }}
        />
        <Tab.Screen
          name="SettingsStack"
          component={SettingsStack}
          options={{ tabBarButton: () => null, headerShown: false }}
        />
      </Tab.Navigator>
      <TouchableOpacity style={[styles.settingsbutton, { backgroundColor: colors.accent }]} onPress={() => expandBottomSheet()}>
        <Feather name="settings" size={30} color={colors.onAccent} />
      </TouchableOpacity>
      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        onAnimate={handleAnimate}
        handleIndicatorStyle={{ backgroundColor: colors.text, width: Globals.globalDimensions.width * .133333333, }}
        backgroundStyle={{ backgroundColor: colors.surface }}
      >
        <View style={{ flex: 1, alignItems: 'flex-start', marginLeft: 27,}}>
          <Pressable style={styles.bottomsheetpressables} onPress={() => {
            bottomSheetRef.current.close()
            navcontainerRef.current?.navigate('SettingsStack', { screen: 'Settings' })
          }}>
            <MaterialCommunityIcons name="dots-horizontal" size={24} color={colors.text} />
            <Text style={[styles.bottomsheetpressablestext, { color: colors.text }]}>Settings</Text>
          </Pressable>
          <View style={{left: 0, marginLeft: -27,}}>
            <Sepline width={Globals.globalDimensions.width} height={1} preserveAspectRatio="none" color={colors.text} />
          </View>
          <Pressable style={styles.bottomsheetpressables}>
            <SwitchIcon color={colors.text} />
            <Text style={[styles.bottomsheetpressablestext, { color: colors.text }]}>Switch Account</Text>
          </Pressable>
          <Pressable style={styles.bottomsheetpressables} onPress={() => {
            bottomSheetRef.current.close()
            logout()
          }}>
            <LogoutIcon />
            <Text style={[styles.bottomsheetpressablestext, {color: colors.danger,}]}>Logout</Text>
          </Pressable>
        </View>
      </BottomSheet>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'column',
    flex: 1,
  },

  tabIcons: {
    width: 22,
    height: 22,
  },

  settingsbutton: {
    position: 'absolute',
    top: 20,
    right: 20,
    padding: 10,
    borderRadius: 16
  },
  
  bottomsheetpressables: {
    flexDirection: 'row', 
    justifyContent: 'flex-start', 
    alignItems: 'center',
    paddingVertical: 18,
    width: '100%',
  },

  bottomsheetpressablestext: {
    fontFamily: GlobalStyles.fontSet.fontsemibold, 
    fontSize: 16, 
    marginLeft: 13,
  },
});
