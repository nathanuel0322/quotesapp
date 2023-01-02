import React, {useRef, useMemo, useState, useCallback} from 'react';
import {StyleSheet, View, Pressable, ScrollView, Text} from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import MainHeader from '../components/home/MainHeader';
import Post from '../components/home/Post';
import { BlurView } from 'expo-blur';
import Globals from '../GlobalValues';

import EstherIcon from '../assets/images/EstherIcon.svg'; 
import RezaIcon from '../assets/images/RezaImage.svg'; 
import MaryIcon from '../assets/images/MaryIcon.svg'; 
import ZaraIcon from '../assets/images/ZaraIcon.svg'; 
import AliIcon from '../assets/images/AliIcon.svg'; 
import ZariIcon from '../assets/images/ZariIcon.svg'; 
import DMSelectedIcon from '../assets/icons/DMSelected.svg';
import DMNotSelectedIcon from '../assets/icons/DMnotSelected.svg';
import GlobalStyles from '../GlobalStyles';

let followingarr = [
  [<EstherIcon />, 'Esther Howard', 'eshoward', false], 
  [<RezaIcon />, 'Reza Mohammadi', 'rezxart', false], 
  [<MaryIcon />, 'Mary', 'maryiiiana', false], 
  [<ZaraIcon />, 'Zara', 'Nothing', false], 
  [<AliIcon />, 'Alirezajj', 'jj_oficially', false], 
  [<ZariIcon />, 'zari', 'zarishop', false],
];

export default function Home({navigation}) {
  const bottomSheetRef = useRef(BottomSheet);
  const snapPoints = useMemo(() => [0.1, '43.226601%'], []);
  const [isScrollLocked, setIsScrollLocked] = useState(true);
  const [isunselected, setUnselected] = useState(false);

  return (
    <View style={homestyles.container}>
      <MainHeader />
      <View style={{height: 20, marginBottom: 50,}} />
      <ScrollView
        scrollEnabled={isScrollLocked}
      >
        <Post bottomSheetRef={bottomSheetRef} navigation={navigation} />
        <Post marginTop={-20} bottomSheetRef={bottomSheetRef} navigation={navigation} />
      </ScrollView>
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        onAnimate={useCallback((fromIndex) => {
          setIsScrollLocked(!isScrollLocked);
          setUnselected(!isunselected);
          if (fromIndex === 1) {
            navigation.setOptions({tabBarStyle: {display: 'flex',position: 'absolute',bottom: 25,left: 20,right: 20,elevation: 24,backgroundColor: GlobalStyles.colorSet.primary1,borderRadius: 25,height: 70,width: Globals.globalDimensions.width * 0.914666667,shadowOffset: {  width: 0,  height: 12,},shadowOpacity: 0.58,shadowRadius: 16.0,opacity: 1,},})
          }
          console.log("From index: ", fromIndex)
        })}
        handleIndicatorStyle={{backgroundColor: 'white', width: Globals.globalDimensions.width * .133333333,}}
        backgroundStyle={{backgroundColor: GlobalStyles.colorSet.neutral11}}
      >
        <ScrollView>
            {followingarr.map((item, key) => {
              const [isdmselected, setIsdmselected] = useState(false);
              return (
                <View key={key} style={[homestyles.bottomsheetviews, {paddingTop: 17, paddingBottom: 24,}]} onPress={() => [console.log('Wallet pressed')]}>
                  {item[0]}
                    <View style={{marginLeft: 14,}}>
                        <Text style={[homestyles.bottomsheetstext, {fontFamily: GlobalStyles.fontSet.fontsemibold, fontSize: 16, paddingBottom: 8,}]}>{item[1]}</Text>
                        <Text style={[homestyles.bottomsheetstext, {fontFamily: GlobalStyles.fontSet.font, fontSize: 14,}]}>{item[2]}</Text>
                    </View>
                    <Pressable onPress={() => {console.log("DM Chosen!"); setIsdmselected(!isdmselected); console.log(isdmselected, isunselected)}} 
                      style={{marginLeft: 'auto'}}
                    >
                      {(isdmselected && isunselected) ? <DMSelectedIcon width={40} height={40} /> : <DMNotSelectedIcon width={40} height={40} />}
                    </Pressable>
                </View>
              )
            })}
        </ScrollView>
        <Pressable style={{flex: 1, flexDirection:'row', alignItems: 'center', justifyContent: 'center', width: '100%', position: 'absolute', 
          bottom: 25,}}
          onPress={() => {bottomSheetRef.current.close();}}
        >
          <View style={{width: '92%', backgroundColor: 'white', flexDirection: 'row', justifyContent: 'center', 
            height: 60, alignItems: 'center', borderRadius: 20}}
          >
            <Text style={{fontFamily: GlobalStyles.fontSet.fontbold}}>Send</Text>
          </View>
        </Pressable>
      </BottomSheet>
    </View>
  );
}

const homestyles = StyleSheet.create({
  container: {
    flex: 1,
  },

  bottomsheetviews: {
    flexDirection: 'row', 
    paddingLeft: 24,
    paddingRight: 24,
    alignItems: 'center',
    paddingTop: 17,
    width: '100%',
  },
    
  bottomsheetstext: {
    color: 'white', 
  },
});

