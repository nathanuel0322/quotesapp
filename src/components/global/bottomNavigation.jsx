import React, { useContext, useRef, useMemo, useCallback, useState } from 'react';
import { StyleSheet, TouchableOpacity, View, Pressable, Text, ScrollView } from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons, Feather, Ionicons } from '@expo/vector-icons';
import BottomSheet from '@gorhom/bottom-sheet';
import { AuthContext } from './AuthProvider';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import Search from '../../screens/Search';
import Create from '../../screens/Create';
import GlobalStyles from '../../GlobalStyles';
import Globals from '../../GlobalValues';

import Sepline from '../../assets/icons/sepline.svg';
import SwitchIcon from '../../assets/icons/switchicon.svg';
import LogoutIcon from '../../assets/icons/logouticon.svg';
import SettingsStack from '../settings/SettingsStack';
import Profile from '../../screens/Profile';

const Tab = createBottomTabNavigator();

export default function Tabs({ navcontainerRef }) {
  const { logout } = useContext(AuthContext);
  const bottomSheetRef = useRef(BottomSheet);
  const snapPoints = useMemo(() => [0.1, '25%'], []);
  const [tabstyle, setTabStyle] = useState(GlobalStyles.showTabBar);

  const expandBottomSheet = () => {
    console.log('expanding')
    bottomSheetRef.current.expand();
    setTabStyle(GlobalStyles.hideTabBar);
  };

  const handleAnimate = useCallback((fromIndex) => {
    console.log("fromIndex:", fromIndex)
    if (fromIndex === 1) {
      setTabStyle(GlobalStyles.showTabBar);
    }
  }, []); // Empty dependency array to ensure stability

  return (
    <GestureHandlerRootView style={styles.container}>
      <Tab.Navigator
        screenOptions={{ tabBarShowLabel: false, tabBarStyle: tabstyle, }}
      >
        <Tab.Screen
          name="Menu"
          component={Search}
          options={{
            headerShown: false,
            tabBarIcon: ({focused}) => (
              <View>
                <MaterialCommunityIcons name="window-closed-variant" size={24} color={focused ? GlobalStyles.colorSet.blue6 : "white"} />
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
                <MaterialCommunityIcons name="plus" size={24} color={focused ? GlobalStyles.colorSet.blue6 : "white"} />
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
                <Ionicons name="person" size={24} color={focused ? GlobalStyles.colorSet.blue6 : "white"} />
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
      <TouchableOpacity style={styles.settingsbutton} onPress={() => expandBottomSheet()}>
        <Feather name="settings" size={30} color="white" />
      </TouchableOpacity>
      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        onAnimate={handleAnimate}
        handleIndicatorStyle={{ backgroundColor: 'white', width: Globals.globalDimensions.width * .133333333, }}
        backgroundStyle={{ backgroundColor: GlobalStyles.colorSet.neutral11 }}
      >
        <View style={{ flex: 1, alignItems: 'flex-start', marginLeft: 27,}}>
          <Pressable style={styles.bottomsheetpressables} onPress={() => {
            bottomSheetRef.current.close()
            navcontainerRef.current?.navigate('SettingsStack')
          }}>
            <MaterialCommunityIcons name="dots-horizontal" size={24} color="white" />
            <Text style={styles.bottomsheetpressablestext}>Settings</Text>
          </Pressable>
          <View style={{left: 0, marginLeft: -27,}}>
            <Sepline width={Globals.globalDimensions.width} height={1} preserveAspectRatio="none" />
          </View>
          <Pressable style={styles.bottomsheetpressables}>
            <SwitchIcon />
            <Text style={styles.bottomsheetpressablestext}>Switch Account</Text>
          </Pressable>
          <Pressable style={styles.bottomsheetpressables} onPress={() => logout()}>
            <LogoutIcon />
            <Text style={[styles.bottomsheetpressablestext, {color: GlobalStyles.colorSet.red7,}]}>Logout</Text>
          </Pressable>
        </View>
      </BottomSheet>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: GlobalStyles.colorSet.background,
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
    backgroundColor: GlobalStyles.colorSet.blue6,
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
    color: 'white', 
    fontFamily: GlobalStyles.fontSet.fontsemibold, 
    fontSize: 16, 
    marginLeft: 13,
  },
});
