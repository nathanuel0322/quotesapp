import React, { useState } from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import GlobalStyles from '../GlobalStyles';
import SettingsStackHeader from '../components/settings/SettingsStackHeader';
import { Switch } from 'react-native-switch';

import LanguageIcon from '../assets/icons/languageicon.svg';
import CountryIcon from '../assets/icons/countryicon.svg';
import SocialMediaIcon from '../assets/icons/socialmediaicon.svg';
import PrivacyIcon from '../assets/icons/privacyicon.svg';
import AccountIcon from '../assets/icons/accountdetailicon.svg';
import ArrowLeftIcon from '../assets/icons/arrowlefticon.svg';
import { MaterialIcons, Feather } from '@expo/vector-icons';

export default function Settings({navigation}) {
  const [isEnabled, setIsEnabled] = useState(true);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  return (
    <View>
        <TouchableOpacity style={settingsstyles.backbutton} onPress={() => navigation.goBack()}>
          <ArrowLeftIcon width={30} height={30} />
        </TouchableOpacity>
        <SettingsStackHeader navigation={navigation} currentPage={'Settings'} navtoPage={'ProfileMain'} hideRightButton={true} />
        <View style={{left: 0}}>
          <View style={settingsstyles.settingspressables}>
            <MaterialIcons name="wb-twighlight" size={24} color="white" />
            <Text style={[settingsstyles.settingspressablestext, {marginRight: '40%'}]}>Appearance</Text>
            <Switch
              value={isEnabled}
              onValueChange={toggleSwitch}
              disabled={false}
              activeText={'On'}
              inActiveText={'Off'}
              circleSize={40}
              barHeight={40}
              circleBorderWidth={2}
              backgroundActive={'gray'}
              backgroundInactive={'white'}
              circleActiveColor={'#000000'}
              circleInActiveColor={'white'}
              renderInsideCircle={() => isEnabled ? <Feather name="moon" size={27} color="white" /> : <Feather name="sun" size={27} color="orange" />} // custom component to render inside the Switch circle (Text, Image, etc.)
              changeValueImmediately={true} // if rendering inside circle, change state immediately or wait for animation to complete
              renderActiveText={false}
              renderInActiveText={false}
              switchWidthMultiplier={2} // multiplied by the `circleSize` prop to calculate total width of the Switch
            />
          </View>
            <TouchableOpacity style={settingsstyles.settingspressables} onPress={() => navigation.navigate("Languages")}>
                <LanguageIcon />
                <Text style={settingsstyles.settingspressablestext}>Language</Text>
            </TouchableOpacity>
            <TouchableOpacity style={settingsstyles.settingspressables}>
                <CountryIcon />
                <Text style={settingsstyles.settingspressablestext}>Country</Text>
            </TouchableOpacity>
            <TouchableOpacity style={settingsstyles.settingspressables}>
                <SocialMediaIcon />
                <Text style={settingsstyles.settingspressablestext}>Social Media</Text>
            </TouchableOpacity>
            <TouchableOpacity style={settingsstyles.settingspressables} onPress={() => navigation.navigate("Privacy")}>
                <PrivacyIcon />
                <Text style={settingsstyles.settingspressablestext}>Privacy</Text>
            </TouchableOpacity>
            <TouchableOpacity style={settingsstyles.settingspressables} onPress={() => navigation.navigate("AccountDetails")}>
                <AccountIcon />
                <Text style={settingsstyles.settingspressablestext}>Account Details</Text>
            </TouchableOpacity>
        </View>
        {/* <View style={{position: 'absolute', top: Globals.globalDimensions.height - 100,}}>
            <View>
                <Sepline width={Globals.globalDimensions.width} height={1} preserveAspectRatio="none" />
            </View>
            <TouchableOpacity style={[settingsstyles.settingspressables, {paddingVertical: 35,}]}>
                <AboutIcon width={24} height={24}/>
                <Text style={settingsstyles.settingspressablestext}>About</Text>
            </TouchableOpacity>
        </View> */}
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
    fontSize: 18, 
    marginLeft: 9,
  },
  backbutton: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: GlobalStyles.colorSet.blue6,
    padding: 10,
    borderRadius: 16,
    zIndex: 999
  },
})
