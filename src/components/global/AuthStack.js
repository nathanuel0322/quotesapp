import 'react-native-gesture-handler';
import React from 'react';
import {View} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import SignupScreen from '../../screens/SignUpScreen';
import LoginScreen from '../../screens/LoginScreen';

import { FontAwesome } from '@expo/vector-icons';
import GlobalStyles from '../../GlobalStyles';

const Stack = createStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{header: () => null}}
      />
      <Stack.Screen
        name="Signup"
        component={SignupScreen}
        options={({navigation}) => ({
          title: '',
          headerStyle: {
            backgroundColor: GlobalStyles.colorSet.primary1,
            shadowColor: GlobalStyles.colorSet.primary1,
          },
          headerLeft: () => (
            <View style={{marginLeft: 31, marginTop: 70, width: 'auto', height: 100}}>
              <FontAwesome.Button 
                name="long-arrow-left"
                size={50}
                backgroundColor={GlobalStyles.colorSet.primary1}
                color = {GlobalStyles.colorSet.accent1}
                onPress={() => navigation.navigate('Login')}
              />
            </View>
          ),
        })}
      />
    </Stack.Navigator>
  );
};

export default AuthStack;