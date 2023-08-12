import React, { useState, useEffect } from "react";
import { BlurView } from "expo-blur";
import { Animated, Text, Image, View, StyleSheet, TouchableOpacity } from "react-native";
import { Audio } from "expo-av";

import GlobalStyles from "../../GlobalStyles";

export default function Slide({ item, currentcard, panResponder, rotateAndTranslate, likeOpacity, dislikeOpacity, nextCardOpacity, nextCardScale,
    SCREEN_HEIGHT, SCREEN_WIDTH
}) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [sound, setSound] = useState()

  async function playSound(link) {
    console.log('Loading Sound');
    const { sound } = await Audio.Sound.createAsync({ uri: link });
    await sound.setIsLoopingAsync(true);
    setSound(sound);

    console.log('Playing Sound');
    await sound.playAsync();
  }

  async function stopSound() {
    await sound.stopAsync()
  }

  useEffect(() => {

  }, [])

  useEffect(() => {
    return sound
      ? () => {
          console.log('Unloading Sound');
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  console.log("item:", item)
  
  return (
    currentcard ? (
      <Animated.View {...panResponder.panHandlers} style={[rotateAndTranslate, { zIndex: 3 }]}>
        <Animated.View key={item.id}
          // {...panResponder.panHandlers}
          style={{ height: SCREEN_HEIGHT * .7, width: SCREEN_WIDTH, padding: 10, position: 'absolute' }}
        >
            <Animated.View style={[styles.animateop, { transform: [{ rotate: '30deg' }], opacity: likeOpacity, left: 40 }]}>
                <Text style={[styles.opinion, { borderColor: 'green', color: 'green' }]}>LIKE</Text>
            </Animated.View>
            <Animated.View style={[styles.animateop, { transform: [{ rotate: '30deg' }], opacity: dislikeOpacity, right: 40 }]}>
                <Text style={[styles.opinion, { borderColor: 'red', color: 'red' }]}>NOPE</Text>
            </Animated.View>
            <Image style={styles.imgstyles}
                source={{ uri: item.imglink }} onLoad={() => setImageLoaded(true)}
            />
            {/* top song details */}
            {imageLoaded && item.name && item.artist && (
              // <View style={{ zIndex: 1000, position: 'absolute', left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', }}>
                  <BlurView style={[
                    // styles.innertext, 
                    { zIndex: 999, top: 15, position: 'absolute', textAlign: 'center', alignSelf: 'center', padding: 4, borderRadius: 8, overflow: 'hidden' }
                  ]}>
                    <Text style={[styles.textstyles, { color: 'black', fontFamily: GlobalStyles.fontSet.fontbold, marginVertical: 0 }]}>
                    🎵 {item.name} • {item.artist}
                    </Text>
                  </BlurView>
              // </View>
            )}
            {/* middle text */}
            {imageLoaded && (
              <Animated.View style={[styles.innerview, { zIndex: 2 }]}>
                <View style={styles.innertext}>
                  <Text style={styles.textstyles}>Emotion: {item.phrase}</Text>
                  <Text style={styles.textstyles}>{item.text}</Text>
                  <Text style={styles.textstyles}>Posted by {item.username}</Text>
                </View>
              </Animated.View>
            )}
        </Animated.View>
      </Animated.View>
    ) : (
        <Animated.View key={item.id} style={{ opacity: nextCardOpacity, transform: [{ scale: nextCardScale }], height: SCREEN_HEIGHT * .7, 
          width: SCREEN_WIDTH, padding: 10, position: 'absolute'
        }}>
          {/* <Animated.View style={[styles.animateop, { transform: [{ rotate: '30deg' }], left: 40 }]}>
            <Text style={[styles.opinion, { borderColor: 'green', color: 'green' }]}>LIKE</Text>
          </Animated.View>
          <Animated.View style={[styles.animateop, { transform: [{ rotate: '30deg' }], right: 40 }]}>
            <Text style={[styles.opinion, { borderColor: 'red', color: 'red' }]}>NOPE</Text>
          </Animated.View> */}
          <Image style={styles.imgstyles} source={{ uri: item.imglink }} onLoad={() => setImageLoaded(true)} />
          {imageLoaded && (
            <View style={[
              // rotateAndTranslate, 
              styles.innerview]}>
              <View style={styles.innertext}>
                <Text style={styles.textstyles}>Emotion: {item.selectedEmotion}</Text>
                <Text style={styles.textstyles}>{item.text}</Text>
                <Text style={styles.textstyles}>Posted by {item.username}</Text>
              </View>
            </View>
          )}
        </Animated.View>
    )
  );
}

const styles = StyleSheet.create({
    innertext: {
      // flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      backgroundColor: '#0A0B14',
      maxHeight: '30%',
      padding: 8,
      borderRadius: 16
    },
    textstyles: {
      textAlign: 'center',
      marginVertical: '2%',
      color: 'white',
      fontSize: 20,
      fontWeight: 'bold'
    },
    opinion: {
      borderWidth: 1,
      fontSize: 32,
      fontWeight: '800',
      padding: 10 
    },
    animateop: {
      position: 'absolute',
      top: 50,
      zIndex: 1000,
      // opacity: 0
    },
    imgstyles: {
      flex: 1,
      height: null,
      width: null,
      resizeMode: 'cover',
      borderRadius: 20 
    },
    innerview: {
      zIndex: 1000,
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0, 
      justifyContent: 'center',
      alignItems: 'center'
    }
  });