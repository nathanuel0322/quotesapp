import React from "react";
import { View, TouchableOpacity, Image, Animated, StyleSheet, Platform } from "react-native";
import MapView, { Marker } from 'react-native-maps';
import GlobalStyles from "../../GlobalStyles";
import Globals from '../../GlobalValues';
import { LinearGradient } from 'expo-linear-gradient';
import GlobalFunctions from "../../GlobalFunctions";

import CurrentLocationIcon from "../../assets/icons/currentlocation.svg";

export default function ViewMap() {
  const CARD_HEIGHT = 220;
  const CARD_WIDTH = Globals.globalDimensions.width * 0.8;
  const SPACING_FOR_CARD_INSET = Globals.globalDimensions.width * 0.1 - 10;

  const mapStyle = [
      {
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#242f3e"
          }
        ]
      },
      {
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#746855"
          }
        ]
      },
      {
        "elementType": "labels.text.stroke",
        "stylers": [
          {
            "color": "#242f3e"
          }
        ]
      },
      {
        "featureType": "administrative.land_parcel",
        "elementType": "labels",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "administrative.locality",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#d59563"
          }
        ]
      },
      {
        "featureType": "poi",
        "elementType": "labels.text",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "poi",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#d59563"
          }
        ]
      },
      {
        "featureType": "poi.business",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#263c3f"
          }
        ]
      },
      {
        "featureType": "poi.park",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#6b9a76"
          }
        ]
      },
      {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#38414e"
          }
        ]
      },
      {
        "featureType": "road",
        "elementType": "geometry.stroke",
        "stylers": [
          {
            "color": "#212a37"
          }
        ]
      },
      {
        "featureType": "road",
        "elementType": "labels.icon",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "road",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#9ca5b3"
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#746855"
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [
          {
            "color": "#1f2835"
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#f3d19c"
          }
        ]
      },
      {
        "featureType": "road.local",
        "elementType": "labels",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "transit",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "transit",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#2f3948"
          }
        ]
      },
      {
        "featureType": "transit.station",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#d59563"
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#17263c"
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#515c6d"
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "labels.text.stroke",
        "stylers": [
          {
            "color": "#17263c"
          }
        ]
      }
  ]

  const mapView = React.createRef();
  const animateMap = () => {
    GlobalFunctions._getLocationAsync(true);

    mapView.current.animateToRegion({
      latitude: Globals.location.coords.latitude, 
      longitude: Globals.location.coords.longitude,
      latitudeDelta: 0.004757,
      longitudeDelta: 0.006866,
    }, 2000);
  }

  const onMapLoad = () => {
    mapView.current.animateToRegion({ 
      latitude: Globals.location.coords.latitude, 
      longitude: Globals.location.coords.longitude,
      latitudeDelta: 0.004757,
      longitudeDelta: 0.006866,
    }, 2000);
  }

  const onMarkerPress = (mapEventData) => {
    const markerID = mapEventData._targetInst.return.key;

    let x = (markerID * CARD_WIDTH) + (markerID * 20); 
    if (Platform.OS === 'ios') {
      x = x - SPACING_FOR_CARD_INSET;
    }

    _scrollView.current.scrollTo({x: x, y: 0, animated: true});
  }

  return (
  <View>
    <View>
    <TouchableOpacity
      style={{
        position: 'absolute',
        flex: 1,
        top: Globals.globalDimensions.height * 0.026,
        left: Globals.globalDimensions.width * 0.802666667,
        height: Globals.globalDimensions.width * 0.133333333,
        width: Globals.globalDimensions.width * 0.133333333,
        borderRadius: 999, 
        backgroundColor: GlobalStyles.colorSet.neutral12,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999,
      }}
      onPress={() => [console.log('Recenter Pressed'), animateMap()] }
    >
      <CurrentLocationIcon height={Globals.globalDimensions.width * 0.064} />
    </TouchableOpacity>
    <MapView
      ref={mapView}
      style={{ 
        flex: 1,
        height: Globals.globalDimensions.height * 0.832,
        width: Globals.globalDimensions.width,
        justifyContent: 'flex-end',
        alignItems: 'center',
      }}
      initialRegion={{
        latitude: Globals.location.coords.latitude, 
        longitude: Globals.location.coords.longitude,
        latitudeDelta: 0.004757,
        longitudeDelta: 0.006866,
      }}
      customMapStyle={mapStyle}
      onMapReady={() => onMapLoad()}
      userInterfaceStyle= 'dark'
      loadingEnabled={true}
      loadingIndicatorColor='#606060'
      loadingBackgroundColor={GlobalStyles.colorSet.primary1}
    >
      <Marker
        coordinate={{
          latitude: Globals.location.coords.latitude, 
          longitude: Globals.location.coords.longitude,
        }}
        anchor={{x: 0.5, y: 0.5}}
      >
        <Image
          source={require('../../assets/icons/location.png')}
          style={{
            height: Globals.globalDimensions.width * 0.17,
            width: Globals.globalDimensions.width * 0.17,
          }}
        />
      </Marker>
      {Globals.businesses.map((marker, index) => {
        return(
            <Marker key={index} coordinate={marker.coordinate} 
              anchor={{x: 0.5, y: 0.5}} 
              onPress={(e) => onMarkerPress(e)}
            >
              <LinearGradient
                colors={['#FBAB11','#FB1111']}
                style={{
                  width: 47,
                  height: 47,
                  borderRadius: 25,
                }}
              >
                <Animated.View style={[styles.markerWrap]}>
                  <Animated.Image
                    source={{uri: marker.image}}
                    style={[styles.marker,]}
                    resizeMode="cover"
                  />
                </Animated.View>
              </LinearGradient>
            </Marker>
          
        )
      })}
    </MapView>
    </View>
  </View>
  )
}

const styles = StyleSheet.create({
  markerWrap: {
    alignItems: "center",
    justifyContent: "center",
    left: -1.8,
    top: -1.8,
    width:50,
    height:50,
    shadowColor: GlobalStyles.colorSet.neutral11,
    shadowOpacity: 0.8,
    shadowRadius: 2,
    shadowOffset: {
      height: 1,
      width: 1
    }
  },
  marker: {
    width: 40,
    height: 40,
    borderRadius: 70,
  },
})

