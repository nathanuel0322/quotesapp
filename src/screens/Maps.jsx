import React, {useState, useEffect} from 'react';
import {StyleSheet, View,} from 'react-native';

import SearchBar from '../components/maps/SearchBar';
import Filter from '../components/maps/Filter';
import ViewMap from '../components/maps/ViewMap';


import Globals from '../GlobalValues';


export default function Maps() {
  const [pressed, setPressed] = useState(null);
  useEffect(() => {})

  return (
    <View style={styles.container}>
      <View
        style={{
          flex: 1,
          width: Globals.globalDimensions.width-41,
          height: 55,
          flexDirection: 'row',
          marginHorizontal: 18,
          paddingHorizontal: -5,
        }}
      >
        <View
          style={{
            flex: 5,
            marginHorizontal: 5,
          }}
        >
          <SearchBar />
        </View>
        <View style={{flex: 1, marginHorizontal: 5,}}>
          <Filter />
        </View>
      </View>
      <View
        style={{
          marginTop: Globals.globalDimensions.height * 0.0480295567,
          bottom: 0,
          zIndex: -1,
        }}
      >
        <ViewMap />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    top: 56,
  },
});