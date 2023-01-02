import 'react-native-gesture-handler';
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import ProfileMain from '../../screens/ProfileMain';
import SettingsStack from './SettingsStack';

const Stack = createStackNavigator();

const ProfileStack = () => {
  return (
    <Stack.Navigator initialRouteName="ProfileMain">
      <Stack.Screen
        name="ProfileMain"
        component={ProfileMain}
        options={{header: () => null}}
      />
      <Stack.Screen
        name="SettingsStack"
        component={SettingsStack}
        options={{header: () => null}}
      />
    </Stack.Navigator>
  );
};

export default ProfileStack;