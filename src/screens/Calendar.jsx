import React, {useEffect, useState, useRef, useMemo} from 'react';
import {Text, View, StyleSheet, TouchableOpacity, ScrollView, Pressable, Image, Dimensions} from 'react-native';
import GlobalStyles from '../GlobalStyles';
import Globals from '../GlobalValues';
import BottomSheet from '@gorhom/bottom-sheet';
import SettingsStackHeader from '../components/settings/SettingsStackHeader';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

import RezaIcon from '../assets/images/profilepic.svg';
import MoreSquare from '../assets/icons/more-square.svg';
import Sepline from '../assets/icons/sepline.svg';
import AboutIcon from '../assets/icons/info-transparent.svg';
import EditCardIcon from '../assets/icons/EditCardIcon.svg';
import DeleteIcon from '../assets/icons/DeleteIcon.svg';
import { Calendar } from 'react-native-calendars';
import { useNavigation } from '@react-navigation/native';
import GlobalFunctions from '../GlobalFunctions';

// import from Firebase later
// store pkg items as array later
// provider id will reference where provider's image is stored in Cloud Storage
let activeapptarr = [
  {
    provider: "Reza Nezhadmusavi", 
    pkgtitle: "Basic Facial", 
    pkgitems: {0: "2/3 D Flowers", 1: "2 Charms", 2: "4 Hand painted nails"}, 
    date: "2022-11-21", 
    providerid: <RezaIcon />,
    status: "Ready"
  },
  {
    provider: "Girl Next Door", 
    pkgtitle: "Hair", 
    pkgitems: {0: "Bussdown 40-in"}, 
    date: "2022-11-21", 
    providerid: <RezaIcon />,
    status: "Waiting"
  }
];
let pastapptarr = [];

const window = Dimensions.get("window");
const screen = Dimensions.get("screen");

export default function CalendarScreen() {
  const navigation = useNavigation();
  const [activeorpast, setActiveorPast] = useState('active');
  const [dimensions, setDimensions] = useState({ window, screen });
  const initialdate = new Date()
  const [dayHolder, setDayHolder] = useState(initialdate.getFullYear()+'-'+String(initialdate.getMonth()+1).padStart(2, '0')+'-'+String(initialdate.getDate()).padStart(2, '0'))
  // on first render, set 
  
  useEffect(() => {
    console.log("on page: " + activeorpast)
  }, [activeorpast])

  const bottomSheetRef = useRef(BottomSheet);
  const snapPoints = useMemo(() => [0.05, '45%'], []);

  // left is 0.02
  // right is 0.54
  const offset = useSharedValue((0.0018 * dimensions.window.width) - 0.05);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: offset.value * 255 }],
    };
  });

  const vacation = {key: 'vacation', color: 'red', selectedDotColor: 'blue'};
  const massage = {key: 'massage', color: 'blue', selectedDotColor: 'blue'};
  const workout = {key: 'workout', color: 'green'};

  useEffect(() => {
    console.log("dayholder: " + dayHolder)
  }, [dayHolder])

  return (
    <View style={{flexDirection: 'column', alignItems: 'center'}}>
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
      <ScrollView style={calendarstyles.scrollview}>
        {activeapptarr.map((item, key) => (
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
        ))}
      </ScrollView>
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        onAnimate={(fromIndex) => {if (fromIndex === 1) {console.log("finna close"); GlobalFunctions.showNavBar(navigation)}}}
        handleIndicatorStyle={{backgroundColor: 'transparent', width: Globals.globalDimensions.width * .133333333,}}
        backgroundStyle={{backgroundColor: GlobalStyles.colorSet.neutral11}}
        style={{}}
      >
        <Calendar
          theme={{
            calendarBackground: GlobalStyles.colorSet.neutral11,
            selectedDayTextColor: '#ffffff',
            todayTextColor: '#00adf5',
            dayTextColor: '#ffffff',
            textDisabledColor: '#2d4150',
            dotColor: 'black',
            selectedDotColor: 'black',
            arrowColor: 'orange',
            monthTextColor: 'white',
            indicatorColor: 'blue',
            textDayFontWeight: '300',
            textMonthFontWeight: 'bold',
            textDayHeaderFontWeight: '300',
            textDayFontSize: 13,
            textMonthFontSize: 20,
            textDayHeaderFontSize: 14,
            textDayHeaderColor: 'white',
            textMonthFontFamily: GlobalStyles.fontSet.font,
            arrowColor: 'white', 
            // bckgrnd color around current day
            selectedDayBackgroundColor: 'rgba(0, 127, 123, 0.3)',
            // backgroundColor: '#ffffff',
            // textSectionTitleColor: '#b6c1cd',
            // textSectionTitleDisabledColor: '#d9e1e8',
            // disabledArrowColor: '#d9e1e8',
            // textDayFontFamily: 'monospace',
            // textDayHeaderFontFamily: 'monospace',
          }}
          style={{
            width: '95%',
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
            backgroundColor: GlobalStyles.colorSet.neutral11,
            marginHorizontal: '3%',
            marginVertical: 0
          }}
          firstDay={1}
          hideExtraDays={true}
          enableSwipeMonths={true}
          onDayPress={(date) => {
            setDayHolder(date.dateString)
          }}
          markingType={'multi-dot'}
          markedDates={{
            [dayHolder]: {
              customStyles: {
                container: {
                  backgroundColor: GlobalStyles.colorSet.cyan6,
                  alignItems: 'center',
                  justifyContent: 'center',
                },
                text: {
                  color: 'white',
                  // fontWeight: 'bold'
                  // marginTop: '20%'
                  // marginTop: 0
                }
              },
              dots: [],
              selected: true,
              selectedColor: GlobalStyles.colorSet.cyan6,
            },
            ...activeapptarr.reduce((acc, apt) => {
              let dotsarr = [];
              for (let i = 0; i < activeapptarr.length; i++) {
                if (activeapptarr[i].date === apt.date) {
                  dotsarr.push({color: GlobalStyles.colorSet.red8})
                  if (dotsarr.length >= 3) {
                    break;
                  }
                }
              }
              acc[apt.date] = {
                selected: dayHolder === apt.date,
                dots: dotsarr,
                selectedColor: GlobalStyles.colorSet.cyan6,
                customStyles: {
                  container: {
                    backgroundColor: GlobalStyles.colorSet.cyan6,
                    alignItems: 'center',
                    justifyContent: 'center',
                  },
                  text: {color: 'white',
                  }
                },
              }
              return acc
            }, {})
          }}
        />
      </BottomSheet>
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
  eventviews: {
    width: '92%',
    marginVertical: 24,
    backgroundColor: GlobalStyles.colorSet.neutral11,
    borderRadius: 20,
  },
  
  calendarviewstext: {
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

  bottomsheetpressables: {
    flexDirection: 'row', 
    justifyContent: 'flex-start', 
    alignItems: 'center',
    marginVertical: 15,
    width: '100%',
  },

  bottomsheetpressablestext: {
    color: 'white', 
    fontFamily: GlobalStyles.fontSet.fontsemibold, 
    fontSize: 16, 
    marginLeft: 13,
  },
})
