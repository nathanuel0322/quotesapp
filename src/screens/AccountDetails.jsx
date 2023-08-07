import React, { useEffect, useState } from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import { BlurView } from 'expo-blur';
import GlobalStyles from '../GlobalStyles';
import Globals from '../GlobalValues';
import FormInput from '../components/global/FormInput';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '../../firebase';
import ArrowLeftIcon from '../assets/icons/arrowlefticon.svg';

export default function AccountDetails({navigation}) {
    let storedname = AsyncStorage.getItem('displayname')
    const [currentName, setCurrentName] = useState(storedname ? storedname : auth.currentUser.displayName);

  useEffect(() => {
    navigation.getParent()?.setOptions({
      tabBarStyle: {
        display: "none",
      }
    });
    return () => navigation.getParent()?.setOptions({
        tabBarStyle: {display: 'flex',
            position: 'absolute',
            bottom: 25,
            left: 20,
            right: 20,
            elevation: 24,
            backgroundColor: GlobalStyles.colorSet.primary1,
            borderRadius: 25,
            height: 70,
            width: Globals.globalDimensions.width * 0.914666667,
            shadowOffset: {
              width: 0,
              height: 12,
            },
            shadowOpacity: 0.58,
            shadowRadius: 16.0,
            opacity: 1,
          },
    });
  }, [navigation]);

  return (
    <View>
        <View style={{backgroundColor: GlobalStyles.colorSet.neutral12, flexDirection: 'row',
            width: '100%', height: Globals.globalDimensions.height * .184729064, alignItems: 'center'}}
        >
            <TouchableOpacity style={{marginLeft: 27, overflow: 'hidden', width: Globals.globalDimensions.width * .133333333, 
                    height: Globals.globalDimensions.width * .133333333, borderRadius: 46, top: 10,}}
                onPress={() => navigation.navigate("ProfileMain")}
            >
                <BlurView intensity={5} 
                    style={{backgroundColor: GlobalStyles.colorSet.neutral11, borderRadius: 46, 
                        width: Globals.globalDimensions.width * .133333333, height: Globals.globalDimensions.width * .133333333, 
                        alignItems: 'center',justifyContent: 'center',
                    }}
                >
                    <ArrowLeftIcon />
                </BlurView>
            </TouchableOpacity>
            <Text style={{color: 'white', fontFamily: GlobalStyles.fontSet.fontsemibold, fontSize: 20, 
                paddingLeft: Globals.globalDimensions.width * .215, top: 10,}}
            >
                Account Details
            </Text>
        </View>
        <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <FormInput labelValue={currentName} onChangeText={setCurrentName} placeholderText="Username" autoCapitalize="none" autoCorrect={false} />
            <TouchableOpacity style={settingsstyles.changes}>
                <Text style={[settingsstyles.settingspressablestext, { color: 'black' }]}>Confirm Changes</Text>
            </TouchableOpacity>
        </View>
    </View>
  )
}

const settingsstyles = StyleSheet.create({
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

  changes: {
    backgroundColor: '#FF8C00'
  }
})
