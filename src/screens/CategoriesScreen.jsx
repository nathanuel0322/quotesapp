import React, { useEffect, useState, useRef } from 'react';
import {Text, View, StyleSheet, ScrollView, Pressable, Dimensions} from 'react-native';
import GlobalStyles from '../GlobalStyles';
import BottomSheet from '@gorhom/bottom-sheet';
import SettingsStackHeader from '../components/settings/SettingsStackHeader';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

import { useNavigation } from '@react-navigation/native';

const window = Dimensions.get("window");
const screen = Dimensions.get("screen");

export default function CategoriesScreen() {
  const navigation = useNavigation();
  const [activeorpast, setActiveorPast] = useState('active');
  const [dimensions, setDimensions] = useState({ window, screen });

  const bottomSheetRef = useRef(BottomSheet);

  // left is 0.02
  // right is 0.54
  const offset = useSharedValue((0.0018 * dimensions.window.width) - 0.05);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: offset.value * 255 }],
    };
  });

  const emotions = ["Alone", "Angry", "Anniversary", "Attitude", "Awesome", "Awkward Moment", "Beard", "Beautiful", "Best", "Bike", "Birthday", "Break Up", "Brother", "Busy"] 

  return (
    <View style={{flex: 1, flexDirection: 'column', alignItems: 'center'}}>
      <SettingsStackHeader navigation={navigation} currentPage={'Calendar'} hideLeftButton={true} hideRightButton={false} isCalendar={true} bottomsheet={bottomSheetRef} />
      <View style={calendarstyles.buttoncontainer}>
        <Animated.View style={[calendarstyles.buttonhighlighter, animatedStyles]} /> 
        <Pressable onPress={() => {setActiveorPast('past'); offset.value = withSpring(0.03, {stiffness: 60})}} style={{zIndex: 999}}>
          <Text style={calendarstyles.switchtext}> Past </Text>
        </Pressable>
        <Pressable onPress={() => {setActiveorPast('active'); offset.value = withSpring((0.0018 * dimensions.window.width) - 0.05, {stiffness: 60})}} style={{zIndex: 999}}>
          <Text style={[calendarstyles.switchtext, {left: '-3%'}]}> Active </Text>
        </Pressable>
      </View>
      <ScrollView style={calendarstyles.scrollview} contentContainerStyle={{alignItems: 'center', justifyContent: 'center', flexGrow: 1 }}>
        {emotions.map((val, index) => (
          <View key={index} style={calendarstyles.emotionbox}>
            <Text style={{ color: 'white' }}>{val}</Text>
          </View>
        ))}

        {/* {activeapptarr.map((item, key) => (
          <View key={key} style={{backgroundColor: GlobalStyles.colorSet.neutral11, marginHorizontal: '4%', borderRadius: 20, padding: '4%', paddingBottom: '2%', marginTop: key == 0 ? 0 : '5%'}}>
            <View style={{alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row'}}>
              <RezaIcon height={65} width={65} />
              <Text style={{color: 'white', fontFamily: GlobalStyles.fontSet.fontsemibold, fontSize: 15}}>
                {item.provider}
              </Text>
              <Text style={{color: 'white', fontFamily: GlobalStyles.fontSet.fontsemibold, fontSize: 15}}>
                {new Date(item.date).toDateString().split(" ").slice(0,3).join(" ")}
              </Text>
              <Pressable onPress={() => bottomSheetRef.current.expand()}>
                <MoreSquare height={27} width={27}/>
              </Pressable>
            </View>
            <View style={{alignItems: 'center', justifyContent:'space-between', flexDirection: 'row', marginTop: '3%'}}>
              <Text style={{color: 'white', fontFamily: GlobalStyles.fontSet.fontsemibold, fontSize: 16,}}>
                {item.pkgtitle}
              </Text>
              <View style={{paddingHorizontal: 22, borderRadius: 8, paddingVertical: 7, backgroundColor: item.status === 'Ready' ? 'rgba(0, 127, 123, 0.3)' : item.status === 'Waiting' && 'red'}}>
                <Text style={{color: GlobalStyles.colorSet.cyan6, fontFamily: GlobalStyles.fontSet.font, fontSize: 12,}}>
                  {item.status}
                </Text>
              </View>
            </View>
            <View style={{paddingVertical: 12, justifyContent: 'flex-start'}}>
              {Object.values(item.pkgitems).map((pkgitem, pkgkey) => (
                <Text key={pkgkey} style={{color: 'white', fontFamily: GlobalStyles.fontSet.font, fontSize: 15, marginLeft: '2%', marginTop: pkgkey === 0 ? 0 : '1%', marginBottom: pkgkey === Object.values(item.pkgitems).length - 1 ? 0 : '1%'}}>
                  {pkgitem}
                </Text>
              ))}
            </View>
          </View>
        ))} */}
      </ScrollView>
    </View>
  );
}

const calendarstyles = StyleSheet.create({
  buttoncontainer: {
    width: '81.8666667%',
    backgroundColor: '#1D202D',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 20, 
    marginTop: '-7%'
  },
  buttonhighlighter: {
    height: '75.3333333%',
    zIndex: 1,
    backgroundColor: '#F37370',
    position: 'absolute',
    alignSelf: 'center',
    width: '45%',
    borderRadius: 14,
  },
  scrollview: {
    flex: 1,
    flexDirection: 'row',
    height: '70.8%',
    marginBottom: 100,
    width: '100%',
    marginTop:'8%',
  },
  switchtext: {
    paddingVertical: '7%',
    zIndex: 999,
    color: 'white',
    fontFamily: GlobalStyles.fontSet.fontsemibold,
    fontSize: '17%',
    paddingHorizontal: 67
  },
  emotionbox: {
    width: '40%',
    height: '30%',
    padding: 10
  }
})
