import React, {useEffect, useState} from 'react';
import {Text, View, StyleSheet, TouchableOpacity, Switch} from 'react-native';
import GlobalStyles from '../GlobalStyles';
import Globals from '../GlobalValues';
import SettingsStackHeader from '../components/settings/SettingsStackHeader'; 

import PrivateIcon from '../assets/icons/privateicon.svg'; 
import Sepline from '../assets/icons/sepline.svg';
import AboutIcon from '../assets/icons/info-transparent.svg';
import MutedIcon from '../assets/icons/mutedicon.svg';
import BlockedIcon from '../assets/icons/blockedicon.svg';

import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Privacy({navigation}) {
    const [isEnabled, setIsEnabled] = useState(false);
  
  useEffect(() => {
    console.log('Page JUST opened');
    getBoolean()
      .then((returnval) => {console.log('returned boolean is:', returnval); setIsEnabled(returnval)})
  }, [])

    const storeBoolean = async (value) => {
        try {
          await AsyncStorage.setItem('isprivateaccount', JSON.stringify(value))
        } catch (e) {
          console.log(e);
        }
    }

    const getBoolean = async () => {
      try {
        let jsonvalue = await AsyncStorage.getItem('isprivateaccount');
        return JSON.parse(jsonvalue);
      }
      catch (e) {
        console.log('getBool error:', e);
      }
    }
    
  return (
    <View>
        <SettingsStackHeader navigation={navigation} currentPage={'Privacy'} navtoPage={'Settings'} hideRightButton={false} />
        <View style={{left: 0}}>
            <Text style={[settingsstyles.settingspressablestext, {marginLeft: 24, marginTop: 16,}]}>Account Privacy</Text>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                <View style={settingsstyles.settingspressables}>
                    <PrivateIcon />
                    <Text style={settingsstyles.settingspressablestext}>Private Account</Text>
                </View>
                <Switch
                    trackColor={{ false: 'rgba(29, 32, 45, 1)', true: 'rgba(243, 115, 112, 1)' }}
                    thumbColor={'white'}
                    ios_backgroundColor="rgba(14, 17, 28, 1)"
                    onValueChange={value => [storeBoolean(value), setIsEnabled(value)]}
                    value={isEnabled}
                    style={{marginRight: 32, transform: [{scaleX: 1.1}, {scaleY: 1.1}]}}
                />
            </View>
            <View>
                <Sepline width={Globals.globalDimensions.width} height={1} preserveAspectRatio="none" />
            </View>
            <Text style={[settingsstyles.settingspressablestext, {marginLeft: 24, marginTop: 24,}]}>Connections</Text>
            <TouchableOpacity style={settingsstyles.settingspressables} onPress={() => navigation.navigate("Muted Accounts")}>
                <MutedIcon />
                <Text style={settingsstyles.settingspressablestext}>Muted Accounts</Text>
            </TouchableOpacity>
            <TouchableOpacity style={settingsstyles.settingspressables} onPress={() => navigation.navigate("Blocked Accounts")}>
                <BlockedIcon />
                <Text style={settingsstyles.settingspressablestext}>Blocked Accounts</Text>
            </TouchableOpacity>
        </View>
        <View style={{position: 'absolute', top: Globals.globalDimensions.height - 100,}}>
            <View>
                <Sepline width={Globals.globalDimensions.width} height={1} preserveAspectRatio="none" />
            </View>
            <TouchableOpacity style={[settingsstyles.settingspressables, {paddingVertical: 35,}]}>
                <AboutIcon width={24} height={24}/>
                <Text style={settingsstyles.settingspressablestext}>About</Text>
            </TouchableOpacity>
        </View>
    </View>
  );
}

const settingsstyles = StyleSheet.create({
  settingspressables: {
    flexDirection: 'row', 
    marginLeft: 24,
    alignItems: 'center',
    paddingVertical: 32,
  },
  
  settingspressablestext: {
    color: 'white', 
    fontFamily: GlobalStyles.fontSet.fontsemibold, 
    fontSize: 16, 
    marginLeft: 8,
  },
})
