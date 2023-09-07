import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Home from '../../screens/Home';
import OtherProfile from '../../screens/OtherProfile';

const Stack = createStackNavigator();

export default function HomeStack({navigation}) {
    return(
        <Stack.Navigator initialRouteName='Home'>
            <Stack.Screen 
                name='Home'
                component={Home}
                options={{headerShown: false}} 
            />
            <Stack.Screen 
                name='OtherProfile'
                component={OtherProfile}
                options={{headerShown: false}} 
            />
        </Stack.Navigator>
    );
}