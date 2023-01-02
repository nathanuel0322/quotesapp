import React, {useEffect, useState, useRef, useMemo} from 'react';
import {Text, View, StyleSheet, TouchableOpacity, ScrollView, Pressable} from 'react-native';
import GlobalStyles from '../GlobalStyles';
import Globals from '../GlobalValues';
import BottomSheet from '@gorhom/bottom-sheet';
import SettingsStackHeader from '../components/settings/SettingsStackHeader';

import VisaIcon from '../assets/icons/VisaIcon.svg'; 
import Sepline from '../assets/icons/sepline.svg';
import AboutIcon from '../assets/icons/info-transparent.svg';
import EditCardIcon from '../assets/icons/EditCardIcon.svg';
import DeleteIcon from '../assets/icons/DeleteIcon.svg';

let cardarr = [
    [<VisaIcon />, 4430746834923351], 
    [<VisaIcon />, 4390044513961431], 
    [<VisaIcon />, 4319503178255726], 
];

export default function Wallet({navigation}) {
    const [whichPressed, setWhichPressed] = useState(null);
    const [deleting, setDeleting] = useState(null);
    let curkey = null;
    
    useEffect(() => {console.log(whichPressed + " is pressed"); curkey = whichPressed}, [whichPressed, deleting])
    const bottomSheetRef = useRef(BottomSheet);
    const snapPoints = useMemo(() => [0.05, '18.3497537%'], []);

  return (
    <View>
        <SettingsStackHeader navigation={navigation} currentPage={'Wallet'} navtoPage={'Settings'} hideRightButton={false} />
        <ScrollView style={{height: Globals.globalDimensions.height * .708, marginBottom: 100,}}>
            {cardarr.map((item, key) => (
                <View key={key} style={[blockedstyles.blockedviews, {borderRadius: 16, paddingVertical: 10, 
                    marginTop: (key === 0) ? 21 : 8, 
                    backgroundColor: GlobalStyles.colorSet.neutral12}]}
                >
                    <View style={{alignItems: 'center', justifyContent: 'center', backgroundColor: GlobalStyles.colorSet.blue6, borderRadius: 8, 
                        width: '15.2%', height: Globals.globalDimensions.height * .0480295567}}
                    >
                        {item[0]}   
                    </View>
                    <View style={{marginLeft: 8, alignItems: 'center', justifyContent:'center', flexDirection: 'row'}}>
                        <Text style={{color: 'white', top: -5, fontFamily: GlobalStyles.fontSet.fontbold, fontSize: 20,}}>
                            ....
                        </Text>
                        <Text style={[blockedstyles.blockedviewstext, {fontFamily: GlobalStyles.fontSet.fontbold, fontSize: 16,}]}>
                            {String(item[1]).slice(-4)}
                        </Text>
                    </View>
                    <TouchableOpacity onPress={() => [console.log("Editing " + key), bottomSheetRef.current.expand(), setWhichPressed(key)]} style={{marginLeft: 'auto'}}>
                        <EditCardIcon />
                    </TouchableOpacity>
                </View>
            ))}
        </ScrollView>
        <View style={{position: 'absolute', top: Globals.globalDimensions.height -100,}}>
            <View>
                <Sepline width={Globals.globalDimensions.width} height={1} preserveAspectRatio="none" />
            </View>
            <TouchableOpacity style={[blockedstyles.aboutbutton, {paddingVertical: 35,}]}>
                <AboutIcon width={24} height={24}/>
                <Text style={blockedstyles.abouttext}>About</Text>
            </TouchableOpacity>
        </View>
        <BottomSheet
            ref={bottomSheetRef}
            index={-1}
            snapPoints={snapPoints}
            onAnimate={(fromIndex) => {if (fromIndex === 1) {setWhichPressed(null)}}}
            handleIndicatorStyle={{backgroundColor: 'white', width: Globals.globalDimensions.width * .133333333,}}
            backgroundStyle={{backgroundColor: GlobalStyles.colorSet.neutral11}}
        >
            <View style={{flex: 1,alignItems: 'flex-start', marginLeft: 27,}}>
                <Pressable style={[blockedstyles.bottomsheetpressables, {paddingBottom: 5,}]} onPress={() => [console.log('Edit pressed')]}
                >
                    <EditCardIcon />
                    <Text style={blockedstyles.bottomsheetpressablestext}>Edit</Text>
                </Pressable>
                <View style={{left: 0, marginLeft: -27,}}>
                    <Sepline width={Globals.globalDimensions.width} height={1} preserveAspectRatio="none" />
                </View>
                <Pressable style={[blockedstyles.bottomsheetpressables, {paddingTop: 5,}]} onPress={() => {console.log('Delete pressed'); delete cardarr[curkey]; 
                    bottomSheetRef.current.close()}}
                >
                    <DeleteIcon />
                    <Text style={[blockedstyles.bottomsheetpressablestext, {color: GlobalStyles.colorSet.red7}]}>Delete</Text>
                </Pressable>
            </View>
        </BottomSheet>
    </View>
  );
}

const blockedstyles = StyleSheet.create({
  blockedviews: {
    flexDirection: 'row', 
    paddingLeft: 10,
    paddingRight: 24,
    alignItems: 'center',
    width: '92%',
    marginVertical: 8,
    marginHorizontal: 15,
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
