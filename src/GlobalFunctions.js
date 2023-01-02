import React, {useState, useEffect} from "react";
import * as Location from 'expo-location';
import Globals from './GlobalValues';

export default {
    _getLocationAsync: async (isknown) => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            console.log('Permission to access location was denied');
            return;
        }
        let currentlocation;
        if (isknown){
            currentlocation = await Location.getLastKnownPositionAsync({});
            console.log('current location is known');
            Globals.location = currentlocation;
        }
        else {
            currentlocation = await Location.getCurrentPositionAsync({});
            Globals.location = currentlocation;
        }
    },
    hideNavBar: (navigation) => {
        navigation.setOptions({
            tabBarStyle: {
              display: "none",
            }
        });
    },
    showNavBar: (navigation) => {
        navigation.setOptions({
            tabBarStyle: {
                display: 'flex',
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
    }
}