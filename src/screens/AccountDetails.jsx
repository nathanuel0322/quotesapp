import React, {useEffect} from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import { BlurView } from 'expo-blur';
import GlobalStyles from '../GlobalStyles';
import Globals from '../GlobalValues';

import ArrowLeftIcon from '../assets/icons/arrowlefticon.svg'; 
import WalletIcon from '../assets/icons/walleticon.svg'; 
import LanguageIcon from '../assets/icons/languageicon.svg';
import CountryIcon from '../assets/icons/countryicon.svg';
import SocialMediaIcon from '../assets/icons/socialmediaicon.svg';
import PrivacyIcon from '../assets/icons/privacyicon.svg';
import AccountIcon from '../assets/icons/accountdetailicon.svg';
import Sepline from '../assets/icons/sepline.svg';
import AboutIcon from '../assets/icons/info-transparent.svg';

export default function AccountDetails({navigation}) {

  useEffect(() => {
    navigation.getParent()?.setOptions({
      tabBarStyle: {
        display: "none",
      }
    });
    return () => navigation.getParent()?.setOptions({
        tabBarStyle: {display: 'flex',
            position: 'absolute',
            bottom: 25,
            left: 20,
            right: 20,
            elevation: 24,
            backgroundColor: GlobalStyles.colorSet.primary1,
            borderRadius: 25,
            height: 70,
            width: Globals.globalDimensions.width * 0.914666667,
            shadowOffset: {
              width: 0,
              height: 12,
            },
            shadowOpacity: 0.58,
            shadowRadius: 16.0,
            opacity: 1,
          },
    });
  }, [navigation]);

  return (
    <View>
        <View style={{backgroundColor: GlobalStyles.colorSet.neutral12, flexDirection: 'row',
            width: '100%', height: Globals.globalDimensions.height * .184729064, alignItems: 'center'}}
        >
            <TouchableOpacity style={{marginLeft: 27, overflow: 'hidden', width: Globals.globalDimensions.width * .133333333, 
                    height: Globals.globalDimensions.width * .133333333, borderRadius: 46, top: 10,}}
                onPress={() => navigation.navigate("ProfileMain")}
            >
                <BlurView intensity={5} 
                    style={{backgroundColor: GlobalStyles.colorSet.neutral11, borderRadius: 46, 
                        width: Globals.globalDimensions.width * .133333333, height: Globals.globalDimensions.width * .133333333, 
                        alignItems: 'center',justifyContent: 'center',
                    }}
                >
                    <ArrowLeftIcon />
                </BlurView>
            </TouchableOpacity>
            <Text style={{color: 'white', fontFamily: GlobalStyles.fontSet.fontsemibold, fontSize: 20, 
                paddingLeft: Globals.globalDimensions.width * .215, top: 10,}}
            >
                Settings
            </Text>
        </View>
        <View style={{left: 0}}>
            <TouchableOpacity style={[settingsstyles.settingspressables, {paddingTop: 24 ,paddingBottom: 32,}]} onPress={() => [console.log('Wallet pressed')]}>
                <WalletIcon />
                <Text style={settingsstyles.settingspressablestext}>Wallet</Text>
            </TouchableOpacity>
            <TouchableOpacity style={settingsstyles.settingspressables} onPress={() => console.log(navigation.getState().index)}>
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
            <TouchableOpacity style={settingsstyles.settingspressables}>
                <PrivacyIcon />
                <Text style={settingsstyles.settingspressablestext}>Privacy</Text>
            </TouchableOpacity>
            <TouchableOpacity style={settingsstyles.settingspressables}>
                <AccountIcon />
                <Text style={settingsstyles.settingspressablestext}>Account Details</Text>
            </TouchableOpacity>
        </View>
        <View style={{paddingTop: 120}}>
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
    fontSize: 18, 
    marginLeft: 9,
  },
})
