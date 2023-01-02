import React from 'react';
import {StyleSheet, View,} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import Home from '../../screens/Home';
import Search from '../../screens/Search';
import CalendarScreen from '../../screens/Calendar';
import Maps from '../../screens/Maps';
import ProfileStack from '../../components/profile/ProfileStack';

import GlobalStyles from '../../GlobalStyles';
import Globals from '../../GlobalValues';

import HomeIcon from "../../assets/icons/home.svg";
import HomeIconChosen from "../../assets/icons/home-chosen.svg";
import SearchIcon from "../../assets/icons/searchicon.svg";
import SearchIconChosen from "../../assets/icons/searchicon-chosen.svg";
import CalendarIcon from "../../assets/icons/calendar.svg";
import CalendarIconChosen from "../../assets/icons/calendar-chosen.svg";
import MapsIcon from '../../assets/icons/maps.svg';
import MapsIconChosen from '../../assets/icons/maps-chosen.svg';
import ProfileIcon from '../../assets/icons/profile.svg';

const Tab = createBottomTabNavigator();

export default function Tabs() {
  const iconSizes = Globals.globalDimensions.width * 0.0586666667; 

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
          name="Home"
          component={Home}
          options={{
            backgroundColor: GlobalStyles.colorSet.primary1,
            headerShown: false,
            tabBarIcon: ({focused}) => (
              <View style={{top: Globals.globalDimensions.height > 900 && Globals.globalDimensions.height * 0.0145788337,}}>
                {focused
                  ? <HomeIconChosen />
                  : <HomeIcon 
                      width={iconSizes} 
                      height={iconSizes}
                    />
                }
              </View>
            ),
          }}
        />

        <Tab.Screen
          name="Search"
          component={Search}
          options={{
            headerShown: false,
            tabBarIcon: ({focused}) => (
              <View style={{top: Globals.globalDimensions.height > 900 && Globals.globalDimensions.height * 0.0145788337,}}>
                {focused
                  ? <SearchIconChosen />
                  : <SearchIcon 
                      width={iconSizes} 
                      height={iconSizes}
                    />
                }
              </View>
            ),
          }}
        />

        <Tab.Screen
          name="Calendar"
          component={CalendarScreen}
          options={{
            headerShown: false,
            tabBarIcon: ({focused}) => (
              <View style={{top: Globals.globalDimensions.height > 900 && Globals.globalDimensions.height * 0.0145788337,}}>
                {focused
                  ? <CalendarIconChosen />
                  : <CalendarIcon 
                      width={iconSizes} 
                      height={iconSizes}
                    />
                }
              </View>
            ),
          }}
        />

        <Tab.Screen
          name="Maps"
          component={Maps}
          options={{
            headerShown: false,
            tabBarIcon: ({focused}) => (
              <View style={{top: Globals.globalDimensions.height > 900 && Globals.globalDimensions.height * 0.0145788337,}}>
                {focused
                  ? <MapsIconChosen />
                  : <MapsIcon 
                      width={iconSizes} 
                      height={iconSizes}
                    />
                }
              </View>
            ),
          }}
        />

        <Tab.Screen
          name="Profile"
          component={ProfileStack}
          options={{
            headerShown: false,
            tabBarIcon: ({focused}) => (
              <View style={{top: Globals.globalDimensions.height > 900 && Globals.globalDimensions.height * 0.0145788337,}}>
                <ProfileIcon 
                  width={Globals.globalDimensions.width * 0.106666667}
                  height={Globals.globalDimensions.width * 0.106666667}
                />
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
