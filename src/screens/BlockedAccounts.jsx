import React from 'react';
import {Text, View, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import { BlurView } from 'expo-blur';
import GlobalStyles from '../GlobalStyles';
import Globals from '../GlobalValues';
import SettingsStackHeader from '../components/settings/SettingsStackHeader';

import EstherIcon from '../assets/images/EstherIcon.svg'; 
import RezaIcon from '../assets/images/RezaImage.svg'; 
import MaryIcon from '../assets/images/MaryIcon.svg'; 
import ZaraIcon from '../assets/images/ZaraIcon.svg'; 
import EliIcon from '../assets/images/EliIcon.svg'; 
import MasoudIcon from '../assets/images/MasoudIcon.svg'; 
import Sepline from '../assets/icons/sepline.svg';
import AboutIcon from '../assets/icons/info-transparent.svg';

let blockedarr = [
                    [<EstherIcon />, 'Esther Howard', 'Head Product Designer'], 
                    [<RezaIcon />, 'Reza Mohammadi', 'NFT Artist'], 
                    [<MaryIcon />, 'Mary', 'Design!'], 
                    [<ZaraIcon />, 'Zara', 'Nothing'], 
                    [<EliIcon />, 'Eli', 'Music and Life!'], 
                    [<MasoudIcon />, 'Masoud DYDX', 'Artist'],
                ];

export default function BlockedAccounts({navigation}) {
  return (
    <View>
        <SettingsStackHeader navigation={navigation} currentPage={'Blocked Accounts'} navtoPage={'Privacy'} hideRightButton={false} />
        <ScrollView style={{height: Globals.globalDimensions.height * .708}}>
            {blockedarr.map((item, key) => (
                <View key={key} style={[blockedstyles.blockedviews, {paddingTop: 17, paddingBottom: 24,}]} onPress={() => [console.log('Wallet pressed')]}>
                    {item[0]}
                    <View style={{marginLeft: 14,}}>
                        <Text style={[blockedstyles.blockedviewstext, {fontFamily: GlobalStyles.fontSet.fontsemibold, fontSize: 16, paddingBottom: 8,}]}>{item[1]}</Text>
                        <Text style={[blockedstyles.blockedviewstext, {fontFamily: GlobalStyles.fontSet.font, fontSize: 14,}]}>{item[2]}</Text>
                    </View>
                    <TouchableOpacity onPress={() => console.log("Unblocked!")} style={{overflow: 'hidden', 
                        width: Globals.globalDimensions.width * .242666667, height: Globals.globalDimensions.height * .0492610837, borderRadius: 15,
                        marginLeft: 'auto'}}
                    >
                        <BlurView intensity={5} 
                            style={{backgroundColor: GlobalStyles.colorSet.neutral11, borderRadius: 15, 
                                width: Globals.globalDimensions.width * .242666667, height: Globals.globalDimensions.height * .0492610837, 
                                alignItems: 'center',justifyContent: 'center',
                            }}
                        >
                            <Text style={{color: 'white', fontFamily: GlobalStyles.fontSet.fontbold, fontSize: 14,}}>Unblock</Text>
                        </BlurView>
                    </TouchableOpacity>
                </View>
            ))}
        </ScrollView>
        <View style={{position: 'absolute', top: Globals.globalDimensions.height - 100,}}>
            <View>
                <Sepline width={Globals.globalDimensions.width} height={1} preserveAspectRatio="none" />
            </View>
            <TouchableOpacity style={[blockedstyles.aboutbutton, {paddingVertical: 35,}]}>
                <AboutIcon width={24} height={24}/>
                <Text style={blockedstyles.abouttext}>About</Text>
            </TouchableOpacity>
        </View>
    </View>
  );
}

const blockedstyles = StyleSheet.create({
  blockedviews: {
    flexDirection: 'row', 
    paddingLeft: 24,
    paddingRight: 24,
    alignItems: 'center',
    paddingTop: 17,
    width: '100%',
  },
  
  blockedviewstext: {
    color: 'white', 
  },

  aboutbutton: {
    flexDirection: 'row', 
    marginLeft: 24,
    alignItems: 'center',
    paddingVertical: 32,
  },

  abouttext: {
    color: 'white', 
    fontFamily: GlobalStyles.fontSet.fontsemibold, 
    fontSize: 18, 
    marginLeft: 9,
  },
})
