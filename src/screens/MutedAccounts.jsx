import React from 'react';
import {Text, View, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import { BlurView } from 'expo-blur';
import GlobalStyles from '../GlobalStyles';
import Globals from '../GlobalValues';
import SettingsStackHeader from '../components/settings/SettingsStackHeader';

import EstherIcon from '../assets/images/EstherIcon.svg'; 
import RezaIcon from '../assets/images/RezaIcon.svg'; 
import MaryIcon from '../assets/images/MaryIcon.svg';

let mutedarr = [
  [<EstherIcon />, 'Esther Howard', 'Posts and Story Muted'], 
  [<RezaIcon />, 'Reza Mohammadi', 'Posts muted'], 
  [<MaryIcon />, 'Mary', 'Story muted'], 
];

export default function MutedAccounts({navigation}) {
  return (
    <View>
        <SettingsStackHeader navigation={navigation} currentPage={'Muted Accounts'} navtoPage={'Privacy'} hideRightButton={true} />
        <ScrollView style={{height: Globals.globalDimensions.height * .708}}>
            {mutedarr.map((item, key) => (
                <View key={key} style={[blockedstyles.blockedviews, {paddingTop: 17, paddingBottom: 24,}]} onPress={() => [console.log('Wallet pressed')]}>
                    {item[0]}
                    <View style={{marginLeft: 14,}}>
                        <Text style={[blockedstyles.blockedviewstext, {fontFamily: GlobalStyles.fontSet.fontsemibold, fontSize: 16, paddingBottom: 8,}]}>{item[1]}</Text>
                        <Text style={[blockedstyles.blockedviewstext, {fontFamily: GlobalStyles.fontSet.font, fontSize: 14,}]}>{item[2]}</Text>
                    </View>
                    <TouchableOpacity onPress={() => console.log("Unmuted!")} style={{overflow: 'hidden', 
                        width: Globals.globalDimensions.width * .242666667, height: Globals.globalDimensions.height * .0492610837, borderRadius: 15,
                        marginLeft: 'auto'}}
                    >
                        <BlurView intensity={5} 
                            style={{backgroundColor: GlobalStyles.colorSet.neutral11, borderRadius: 15, 
                                width: Globals.globalDimensions.width * .242666667, height: Globals.globalDimensions.height * .0492610837, 
                                alignItems: 'center',justifyContent: 'center',
                            }}
                        >
                            <Text style={{color: 'white', fontFamily: GlobalStyles.fontSet.fontbold, fontSize: 14,}}>Unmute</Text>
                        </BlurView>
                    </TouchableOpacity>
                </View>
            ))}
        </ScrollView>
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
