import React from 'react';
import {StyleSheet, View} from 'react-native';
import Carousel from 'react-native-snap-carousel';

export default function Search() {
  return (
    <View style={styles.container}>
      <Carousel layout={'tinder'} layoutCardOffset={9} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
