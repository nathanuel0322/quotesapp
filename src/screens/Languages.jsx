import React from 'react';
import {Text, View, StyleSheet, TouchableOpacity, ScrollView, Pressable} from 'react-native';
import GlobalStyles from '../GlobalStyles';
import Globals from '../GlobalValues';
import SettingsStackHeader from '../components/settings/SettingsStackHeader';

import Sepline from '../assets/icons/sepline.svg';
import AboutIcon from '../assets/icons/info-transparent.svg';

let suggested = ['English (UK)', 'English', 'Arabic'];
let other = ['Chinese', 'Croatian', 'Czech', 'Danish', 'Filipino'];

export default function Languages({navigation}) {
  return (
    <View>
        <SettingsStackHeader navigation={navigation} currentPage={'Languages'} navtoPage={'Settings'} hideRightButton={true} />
        <ScrollView style={{height: Globals.globalDimensions.height-270}}>
            <View style={{left: 0}}>
                <Text style={[languagestyles.settingspressablestext, {marginLeft: 24, marginTop: 16,}]}>Suggested Languages</Text>
                {suggested.map((item, key) => (
                    <View key={key} style={[languagestyles.blockedviews, {marginTop: 8,}]}>
                        <Pressable style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                            <View style={[languagestyles.settingspressables, {marginLeft: 0}]}>
                                <Text style={languagestyles.settingspressablestext}>{item}</Text>
                            </View>
                        </Pressable>
                        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                            <Sepline width={Globals.globalDimensions.width * .872} height={1} preserveAspectRatio="none" />
                        </View>
                    </View>
                ))}
            </View>
            <View style={{left: 0, marginTop: 32,}}>
                <Text style={[languagestyles.settingspressablestext, {marginLeft: 24, marginTop: 16,}]}>Other Languages</Text>
                <Pressable style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    <View style={languagestyles.settingspressables}>
                        <Text style={languagestyles.settingspressablestext}>Chinese</Text>
                    </View>
                </Pressable>
                <View style={{alignItems: 'center', justifyContent: 'center'}}>
                    <Sepline width={Globals.globalDimensions.width * .872} height={1} preserveAspectRatio="none" />
                </View>
                <Pressable style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    <View style={languagestyles.settingspressables}>
                        <Text style={languagestyles.settingspressablestext}>Croatian</Text>
                    </View>
                </Pressable>
                <View style={{alignItems: 'center', justifyContent: 'center'}}>
                    <Sepline width={Globals.globalDimensions.width * .872} height={1} preserveAspectRatio="none" />
                </View>
                <Pressable style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    <View style={languagestyles.settingspressables}>
                        <Text style={languagestyles.settingspressablestext}>Czech</Text>
                    </View>
                </Pressable>
                <View style={{alignItems: 'center', justifyContent: 'center'}}>
                    <Sepline width={Globals.globalDimensions.width * .872} height={1} preserveAspectRatio="none" />
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    <View style={languagestyles.settingspressables}>
                        <Text style={languagestyles.settingspressablestext}>Danish</Text>
                    </View>
                </View>
                <View style={{alignItems: 'center', justifyContent: 'center'}}>
                    <Sepline width={Globals.globalDimensions.width * .872} height={1} preserveAspectRatio="none" />
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    <View style={languagestyles.settingspressables}>
                        <Text style={languagestyles.settingspressablestext}>Filipino</Text>
                    </View>
                </View>
                <View style={{alignItems: 'center', justifyContent: 'center'}}>
                    <Sepline width={Globals.globalDimensions.width * .872} height={1} preserveAspectRatio="none" />
                </View>
            </View>
        </ScrollView>
        <View style={{position: 'absolute', top: Globals.globalDimensions.height - 100,}}>
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
                <Sepline width={Globals.globalDimensions.width} height={1} preserveAspectRatio="none" />
            </View>
            <TouchableOpacity style={[languagestyles.settingspressables, {paddingVertical: 35,}]}>
                <AboutIcon width={24} height={24}/>
                <Text style={languagestyles.settingspressablestext}>About</Text>
            </TouchableOpacity>
        </View>
    </View>
  );
}

const languagestyles = StyleSheet.create({
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

  blockedviews: {
    paddingLeft: 10,
    paddingRight: 24,
    alignItems: 'flex-start',
    width: '92%',
    marginVertical: 8,
    marginHorizontal: 15,
  },
})
