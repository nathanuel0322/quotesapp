import React from 'react';
import {Text, View, TouchableOpacity, Pressable, StyleSheet} from 'react-native';
import { BlurView } from 'expo-blur';
import GlobalStyles from '../../GlobalStyles';
import { useTheme } from '../global/ThemeContext';

import ArrowLeftIcon from '../../assets/icons/arrowlefticon.svg';
import AddIcon from '../../assets/icons/addicon.svg';
import CalendarIcon from '../../assets/icons/calendar.svg';

export default function SettingsStackHeader({navigation, currentPage, hideLeftButton, hideRightButton, isCalendar, bottomsheet}) {
  const { colors } = useTheme();

  return (
    <View style={[sshstyles.mainview, { backgroundColor: colors.header }]}>
        <Pressable style={[sshstyles.pressable, {opacity: hideLeftButton ? 0 : 1}]} disabled={hideLeftButton} onPress={() => navigation.goBack()}
            accessibilityRole="button" accessibilityLabel="Back"
        >
            <BlurView intensity={5} tint={colors.blurTint} style={[sshstyles.leftblurview, { backgroundColor: colors.surface }]}>
                <ArrowLeftIcon color={colors.text} />
            </BlurView>
        </Pressable>
        <Text style={{color: colors.text, fontFamily: GlobalStyles.fontSet.fontsemibold, fontSize: 20, top: 10,}}>
            {currentPage}
        </Text>
        <TouchableOpacity style={[sshstyles.pressable, {opacity: hideRightButton ? 0 : 1, backgroundColor: colors.header}]}
            disabled={hideRightButton}
            onPress={() => {
                navigation.setOptions({tabBarStyle: {display: "none",}});
                isCalendar && bottomsheet.current.expand(); 
            }}
        >
            <BlurView intensity={5} tint={colors.blurTint}
                style={{backgroundColor: isCalendar ? 'transparent' : colors.teal, borderRadius: 46, 
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
        borderRadius: 46, 
        width: '13.3333333%',
        height: '13.3333333%', 
        alignItems: 'center',
        justifyContent: 'center',
    },
});