import React from 'react';
import {StyleSheet, View,} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import Brush from '../../screens/Brush';
import Search from '../../screens/Search';
import CalendarScreen from '../../screens/Calendar';
import GlobalStyles from '../../GlobalStyles';
import Globals from '../../GlobalValues';

const Tab = createBottomTabNavigator();

export default function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          display: 'flex',
          position: 'absolute',
          bottom: 25,
          left: 20,
          right: 20,
          elevation: 24,
          backgroundColor: GlobalStyles.colorSet.primary1,
          borderRadius: 25,
          height: 70,
          width: Globals.globalDimensions.width * 0.914666667,
          shadowOffset: {
            width: 0,
            height: 12,
          },
          shadowOpacity: 0.58,
          shadowRadius: 16.0,
          opacity: 1,
        },
      }}
    >
      <Tab.Screen
        name="Brush"
        component={Brush}
        options={{
          backgroundColor: GlobalStyles.colorSet.primary1,
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <View style={{top: Globals.globalDimensions.height > 900 && Globals.globalDimensions.height * 0.0145788337,}}>
              <MaterialCommunityIcons name="brush-variant" size={24} color={focused ? "red" : "white"} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Menu"
        component={Search}
        options={{
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <View style={{top: Globals.globalDimensions.height > 900 && Globals.globalDimensions.height * 0.0145788337,}}>
              <MaterialCommunityIcons name="window-closed-variant" size={24} color={focused ? "red" : "white"} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Other"
        component={CalendarScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <View style={{top: Globals.globalDimensions.height > 900 && Globals.globalDimensions.height * 0.0145788337,}}>
              <MaterialCommunityIcons name="dots-horizontal" size={24} color={focused ? "red" : "white"} />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: GlobalStyles.colorSet.background,
  },

  tabIcons: {
    width: 22,
    height: 22,
  },
});
