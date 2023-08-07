import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Settings from '../../screens/Settings';
import Languages from '../../screens/Languages';
import Country from '../../screens/Country';
import SocialMedia from '../../screens/SocialMedia';
import Privacy from '../../screens/Privacy';
import AccountDetails from '../../screens/AccountDetails';
import About from '../../screens/About';
import BlockedAccounts from '../../screens/BlockedAccounts';
import MutedAccounts from '../../screens/MutedAccounts';
import Wallet from '../../screens/Wallet';

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
                name='Languages'
                component={Languages}
                options={{headerShown: false}} 
            />
            <Stack.Screen 
                name='Country'
                component={Country}
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
                name='About'
                component={About}
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
            <Stack.Screen 
                name='Wallet'
                component={Wallet}
                options={{headerShown: false}} 
            />
        </Stack.Navigator>
    );
}