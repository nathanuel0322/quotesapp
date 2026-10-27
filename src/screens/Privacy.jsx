import React, {useEffect, useState} from 'react';
import {Text, View, StyleSheet, TouchableOpacity, Switch} from 'react-native';
import GlobalStyles from '../GlobalStyles';
import Globals from '../GlobalValues';
import SettingsStackHeader from '../components/settings/SettingsStackHeader'; 
import { useTheme } from '../components/global/ThemeContext';

import PrivateIcon from '../assets/icons/privateicon.svg'; 
import Sepline from '../assets/icons/sepline.svg';
import MutedIcon from '../assets/icons/mutedicon.svg';
import BlockedIcon from '../assets/icons/blockedicon.svg';

import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Privacy({navigation}) {
    const [isEnabled, setIsEnabled] = useState(false);
    const { colors } = useTheme();
    const textStyle = [settingsstyles.settingspressablestext, { color: colors.text }];
  
  useEffect(() => {
    getBoolean()
      .then((returnval) => setIsEnabled(returnval === true))
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
    <View style={{ flex: 1, backgroundColor: colors.background }}>
        <SettingsStackHeader navigation={navigation} currentPage={'Privacy'} hideRightButton={true} />
        <View style={{left: 0}}>
            <Text style={[textStyle, {marginLeft: 24, marginTop: 16,}]}>Account Privacy</Text>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                <View style={settingsstyles.settingspressables}>
                    <PrivateIcon color={colors.text} />
                    <Text style={textStyle}>Private Account</Text>
                </View>
                <Switch
                    trackColor={{ false: colors.switchTrackOff, true: colors.dangerSoft }}
                    thumbColor={colors.onAccent}
                    ios_backgroundColor={colors.switchTrackOff}
                    onValueChange={value => [storeBoolean(value), setIsEnabled(value)]}
                    value={isEnabled}
                    style={{marginRight: 32, transform: [{scaleX: 1.1}, {scaleY: 1.1}]}}
                />
            </View>
            <View>
                <Sepline width={Globals.globalDimensions.width} height={1} preserveAspectRatio="none" color={colors.text} />
            </View>
            <Text style={[textStyle, {marginLeft: 24, marginTop: 24,}]}>Connections</Text>
            <TouchableOpacity style={settingsstyles.settingspressables} onPress={() => navigation.navigate("Muted Accounts")}>
                <MutedIcon color={colors.text} />
                <Text style={textStyle}>Muted Accounts</Text>
            </TouchableOpacity>
            <TouchableOpacity style={settingsstyles.settingspressables} onPress={() => navigation.navigate("Blocked Accounts")}>
                <BlockedIcon color={colors.text} />
                <Text style={textStyle}>Blocked Accounts</Text>
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
    fontFamily: GlobalStyles.fontSet.fontsemibold, 
    fontSize: 16, 
    marginLeft: 8,
  },
})
