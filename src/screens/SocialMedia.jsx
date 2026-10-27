import React, {useEffect} from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import { BlurView } from 'expo-blur';
import GlobalStyles from '../GlobalStyles';
import Globals from '../GlobalValues';
import { useTheme } from '../components/global/ThemeContext';

import ArrowLeftIcon from '../assets/icons/arrowlefticon.svg'; 
import WalletIcon from '../assets/icons/walleticon.svg'; 
import LanguageIcon from '../assets/icons/languageicon.svg';
import CountryIcon from '../assets/icons/countryicon.svg';
import SocialMediaIcon from '../assets/icons/socialmediaicon.svg';
import PrivacyIcon from '../assets/icons/privacyicon.svg';
import AccountIcon from '../assets/icons/accountdetailicon.svg';

export default function SocialMedia({navigation}) {
  const { colors } = useTheme();
  const textStyle = [settingsstyles.settingspressablestext, { color: colors.text }];

  useEffect(() => {
    navigation.getParent()?.setOptions({ tabBarStyle: GlobalStyles.hideTabBar });
    return () => navigation.getParent()?.setOptions({ tabBarStyle: GlobalStyles.showTabBar(colors) });
  }, [navigation, colors]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
        <View style={{backgroundColor: colors.header, flexDirection: 'row',
            width: '100%', height: Globals.globalDimensions.height * .184729064, alignItems: 'center'}}
        >
            <TouchableOpacity style={{marginLeft: 27, overflow: 'hidden', width: Globals.globalDimensions.width * .133333333, 
                    height: Globals.globalDimensions.width * .133333333, borderRadius: 46, top: 10,}}
                onPress={() => navigation.goBack()}
            >
                <BlurView intensity={5} tint={colors.blurTint}
                    style={{backgroundColor: colors.surface, borderRadius: 46, 
                        width: Globals.globalDimensions.width * .133333333, height: Globals.globalDimensions.width * .133333333, 
                        alignItems: 'center',justifyContent: 'center',
                    }}
                >
                    <ArrowLeftIcon color={colors.text} />
                </BlurView>
            </TouchableOpacity>
            <Text style={{color: colors.text, fontFamily: GlobalStyles.fontSet.fontsemibold, fontSize: 20, 
                paddingLeft: Globals.globalDimensions.width * .215, top: 10,}}
            >
                Settings
            </Text>
        </View>
        <View style={{left: 0}}>
            <TouchableOpacity style={[settingsstyles.settingspressables, {paddingTop: 24 ,paddingBottom: 32,}]}>
                <WalletIcon color={colors.text} />
                <Text style={textStyle}>Wallet</Text>
            </TouchableOpacity>
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
            <TouchableOpacity style={settingsstyles.settingspressables}>
                <PrivacyIcon color={colors.text} />
                <Text style={textStyle}>Privacy</Text>
            </TouchableOpacity>
            <TouchableOpacity style={settingsstyles.settingspressables}>
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
  
  settingspressablestext: {
    fontFamily: GlobalStyles.fontSet.fontsemibold, 
    fontSize: 18, 
    marginLeft: 9,
  },
})
