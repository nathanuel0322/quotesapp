import React, {useEffect, useState, useRef, useMemo} from 'react';
import {Text, View, StyleSheet, TouchableOpacity, ScrollView, Pressable} from 'react-native';
import GlobalStyles from '../GlobalStyles';
import Globals from '../GlobalValues';
import BottomSheet from '@gorhom/bottom-sheet';

import CryingIcon from '../assets/icons/crying.svg'; 
import BottleIcon from '../assets/icons/bottle.svg';
import AngryIcon from '../assets/icons/angry.svg';
import StudentIcon from '../assets/icons/student.svg';

export default function Brush({navigation}) {
    const [whichPressed, setWhichPressed] = useState(null);
    const [deleting, setDeleting] = useState(null);
    let curkey = null;
    
    useEffect(() => {
        console.log(whichPressed + " is pressed");
        curkey = whichPressed
    }, [whichPressed, deleting])

    const bottomSheetRef = useRef(BottomSheet);
    const snapPoints = useMemo(() => [0.05, '18.3497537%'], []);

    let quotearr = [
        {
            feeling: "Alone",
            color: "blue",
            emoji: <CryingIcon width={24} height={24} />
        },
        {
            feeling: "Angry",
            color: "red",
            emoji: <AngryIcon width={24} height={24} />
        },
        {
            feeling: "Anniversary",
            color: "yellow",
            emoji: <BottleIcon width={24} height={24} />
        },
        {
            feeling: "Attitude",
            color: "darkred",
            emoji: <StudentIcon width={24} height={24} />
        }
    ]

    return (
        <View>
            <ScrollView style={{height: Globals.globalDimensions.height * .708, marginBottom: 100,}}>
                {quotearr.map((item, key) => (
                    <TouchableOpacity key={key} style={[blockedstyles.blockedviews, {borderRadius: 16, paddingVertical: 10, 
                        marginTop: (key === 0) ? 21 : 8, 
                        backgroundColor: GlobalStyles.colorSet.neutral12}]}
                    >
                        <View style={{alignItems: 'center', justifyContent: 'center', backgroundColor: GlobalStyles.colorSet.blue6, borderRadius: 8, 
                            width: '15.2%', height: Globals.globalDimensions.height * .0480295567}}
                        >
                            {item[0]}   
                        </View>
                        <View onPress={() => [console.log("Editing " + key), bottomSheetRef.current.expand(), setWhichPressed(key)]} style={{marginLeft: 'auto'}}>
                            <EditCardIcon />
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
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
