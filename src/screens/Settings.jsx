import React from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import GlobalStyles from '../GlobalStyles';
import Globals from '../GlobalValues';
import SettingsStackHeader from '../components/settings/SettingsStackHeader';

import WalletIcon from '../assets/icons/walleticon.svg'; 
import LanguageIcon from '../assets/icons/languageicon.svg';
import CountryIcon from '../assets/icons/countryicon.svg';
import SocialMediaIcon from '../assets/icons/socialmediaicon.svg';
import PrivacyIcon from '../assets/icons/privacyicon.svg';
import AccountIcon from '../assets/icons/accountdetailicon.svg';
import Sepline from '../assets/icons/sepline.svg';
import AboutIcon from '../assets/icons/info-transparent.svg';
import ArrowLeftIcon from '../assets/icons/arrowlefticon.svg';

export default function Settings({navigation}) {
  return (
    <View>
        <TouchableOpacity style={settingsstyles.backbutton} onPress={() => navigation.goBack()}>
          <ArrowLeftIcon width={30} height={30} />
        </TouchableOpacity>
        <SettingsStackHeader navigation={navigation} currentPage={'Settings'} navtoPage={'ProfileMain'} hideRightButton={true} />
        <View style={{left: 0}}>
            <TouchableOpacity style={[settingsstyles.settingspressables, {paddingTop: 24 ,paddingBottom: 32,}]} 
                onPress={() => [navigation.navigate('Wallet'), console.log('Wallet pressed')]}
            >
                <WalletIcon />
                <Text style={settingsstyles.settingspressablestext}>Wallet</Text>
            </TouchableOpacity>
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
