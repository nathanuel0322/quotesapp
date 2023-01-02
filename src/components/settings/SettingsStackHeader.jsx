import React from 'react';
import {Text, View, TouchableOpacity, Pressable, StyleSheet} from 'react-native';
import { BlurView } from 'expo-blur';
import GlobalStyles from '../../GlobalStyles';

import ArrowLeftIcon from '../../assets/icons/arrowlefticon.svg';
import AddIcon from '../../assets/icons/addicon.svg';
import CalendarIcon from '../../assets/icons/calendar.svg';

export default function SettingsStackHeader({navigation, currentPage, hideLeftButton, hideRightButton, isCalendar, bottomsheet}) {
  return (
    <View style={sshstyles.mainview}>
        <Pressable style={[sshstyles.pressable, {opacity: 0 && hideLeftButton}]} onPress={() => {!hideLeftButton && navigation.goBack()}}>
            <BlurView intensity={5} style={sshstyles.leftblurview}>
                <ArrowLeftIcon />
            </BlurView>
        </Pressable>
        <Text style={{color: 'white', fontFamily: GlobalStyles.fontSet.fontsemibold, fontSize: 20, top: 10,}}>
            {currentPage}
        </Text>
        <TouchableOpacity style={[sshstyles.pressable, {opacity: hideRightButton && 0, backgroundColor: GlobalStyles.colorSet.neutral12}]}
            onPress={() => {
                navigation.setOptions({tabBarStyle: {display: "none",}});
                isCalendar && bottomsheet.current.expand(); 
            }}
        >
            <BlurView intensity={5} 
                style={{backgroundColor: isCalendar ? 'transparent' : GlobalStyles.colorSet.cyan6, borderRadius: 46, 
                    width: '13.3333333%', height: '13.3333333%', 
                    alignItems: 'center',justifyContent: 'center',
                }}
            >
                {isCalendar ? <CalendarIcon height={30} width={30} /> :  <AddIcon />}
            </BlurView> 
        </TouchableOpacity>
    </View>
  )
}

const sshstyles = StyleSheet.create({
    mainview: {
        backgroundColor: GlobalStyles.colorSet.neutral12,
        flexDirection: 'row',
        width: '100%',
        height: '18.4729064%',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    pressable: {
        overflow: 'hidden',
        width: '30%', 
        height: '30%',
        borderRadius: 46,
        top: 10,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    leftblurview: {
        backgroundColor: GlobalStyles.colorSet.neutral11,
        borderRadius: 46, 
        width: '13.3333333%',
        height: '13.3333333%', 
        alignItems: 'center',
        justifyContent: 'center',
    },
});