import React from 'react';
import {Text, View, StyleSheet, TouchableOpacity, Switch as SystemSwitch} from 'react-native';
import GlobalStyles from '../GlobalStyles';
import SettingsStackHeader from '../components/settings/SettingsStackHeader';
import { Switch } from 'react-native-switch';

import LanguageIcon from '../assets/icons/languageicon.svg';
import CountryIcon from '../assets/icons/countryicon.svg';
import SocialMediaIcon from '../assets/icons/socialmediaicon.svg';
import PrivacyIcon from '../assets/icons/privacyicon.svg';
import AccountIcon from '../assets/icons/accountdetailicon.svg';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { useTheme } from '../components/global/ThemeContext';

export default function Settings({navigation}) {
  const { isDarkMode, toggleTheme, preference, setPreference, colors } = useTheme()
  const followsSystem = preference === 'system'
  const textStyle = [settingsstyles.settingspressablestext, { color: colors.text }]

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <SettingsStackHeader navigation={navigation} currentPage={'Settings'} hideRightButton={true} />
      <View style={{left: 0}}>
        <View style={[settingsstyles.settingspressables, settingsstyles.togglerow]}>
          <View style={settingsstyles.rowlabel}>
            <MaterialIcons name="wb-twilight" size={24} color={colors.text} />
            <Text style={textStyle}>Dark Mode</Text>
          </View>
          <Switch
            value={isDarkMode}
            onValueChange={toggleTheme}
            disabled={false}
            activeText={'On'}
            inActiveText={'Off'}
            circleSize={40}
            barHeight={40}
            circleBorderWidth={2}
            backgroundActive={colors.surface}
            backgroundInactive={colors.switchTrackOff}
            circleActiveColor={colors.background}
            circleInActiveColor={colors.background}
            circleBorderActiveColor={colors.border}
            circleBorderInactiveColor={colors.border}
            renderInsideCircle={() => isDarkMode ? <Feather name="moon" size={27} color={colors.text} /> : <Feather name="sun" size={27} color={colors.primary} />} // custom component to render inside the Switch circle (Text, Image, etc.)
            changeValueImmediately={true} // if rendering inside circle, change state immediately or wait for animation to complete
            renderActiveText={false}
            renderInActiveText={false}
            switchWidthMultiplier={2} // multiplied by the `circleSize` prop to calculate total width of the Switch
          />
        </View>
        <View style={[settingsstyles.settingspressables, settingsstyles.togglerow, { paddingTop: 0 }]}>
          <View style={settingsstyles.rowlabel}>
            <MaterialIcons name="brightness-auto" size={24} color={colors.text} />
            <Text style={textStyle}>Match System</Text>
          </View>
          <SystemSwitch
            value={followsSystem}
            onValueChange={(value) => setPreference(value ? 'system' : (isDarkMode ? 'dark' : 'light'))}
            trackColor={{ false: colors.switchTrackOff, true: colors.dangerSoft }}
            thumbColor={colors.onAccent}
            ios_backgroundColor={colors.switchTrackOff}
          />
        </View>
          <TouchableOpacity style={settingsstyles.settingspressables}>
              <LanguageIcon color={colors.text} />
              <Text style={textStyle}>Language</Text>
          </TouchableOpacity>
          <TouchableOpacity style={settingsstyles.settingspressables}>
              <CountryIcon color={colors.text} />
              <Text style={textStyle}>Country</Text>
          </TouchableOpacity>
          <TouchableOpacity style={settingsstyles.settingspressables}>
              <SocialMediaIcon color={colors.text} />
              <Text style={textStyle}>Social Media</Text>
          </TouchableOpacity>
          <TouchableOpacity style={settingsstyles.settingspressables} onPress={() => navigation.navigate("Privacy")}>
              <PrivacyIcon color={colors.text} />
              <Text style={textStyle}>Privacy</Text>
          </TouchableOpacity>
          <TouchableOpacity style={settingsstyles.settingspressables} onPress={() => navigation.navigate("AccountDetails")}>
              <AccountIcon color={colors.text} />
              <Text style={textStyle}>Account Details</Text>
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
  togglerow: {
    justifyContent: 'space-between',
    marginRight: 24,
  },
  rowlabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingspressablestext: {
    fontFamily: GlobalStyles.fontSet.fontsemibold, 
    fontSize: 18, 
    marginLeft: 9,
  },
})
