import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Settings from '../../screens/Settings';
import SocialMedia from '../../screens/SocialMedia';
import Privacy from '../../screens/Privacy';
import AccountDetails from '../../screens/AccountDetails';
import BlockedAccounts from '../../screens/BlockedAccounts';
import MutedAccounts from '../../screens/MutedAccounts';

const Stack = createStackNavigator();

export default function SettingsStack({navigation}) {
    return(
        <Stack.Navigator initialRouteName='Settings'>
            <Stack.Screen 
                name='Settings'
                component={Settings}
                options={{headerShown: false}} 
            />
            <Stack.Screen 
                name='Social Media'
                component={SocialMedia}
                options={{headerShown: false}} 
            />
            <Stack.Screen 
                name='Privacy'
                component={Privacy}
                options={{headerShown: false}} 
            />
            <Stack.Screen 
                name='AccountDetails'
                component={AccountDetails}
                options={{headerShown: false}} 
            />
            <Stack.Screen 
                name='Blocked Accounts'
                component={BlockedAccounts}
                options={{headerShown: false}} 
            />
            <Stack.Screen 
                name='Muted Accounts'
                component={MutedAccounts}
                options={{headerShown: false}} 
            />
        </Stack.Navigator>
    );
}