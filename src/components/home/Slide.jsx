import { BlurView } from "expo-blur";
import React, { useState } from "react";
import { Animated, Text, Image, View, StyleSheet } from "react-native";

export default function Slide({ item, currentcard, panResponder, rotateAndTranslate, likeOpacity, dislikeOpacity, nextCardOpacity, nextCardScale,
    SCREEN_HEIGHT, SCREEN_WIDTH
}) {
  const [imageLoaded, setImageLoaded] = useState(false);
  console.log("item:", item)
  return (
    currentcard ? (
        <Animated.View key={item.id}
            {...panResponder.panHandlers}
            style={[rotateAndTranslate, { height: SCREEN_HEIGHT * .7, width: SCREEN_WIDTH, padding: 10, position: 'absolute' }]}
        >
            <Animated.View style={[styles.animateop, { opacity: likeOpacity, left: 40 }]}>
                <Text style={[styles.opinion, { borderColor: 'green', color: 'green' }]}>LIKE</Text>
            </Animated.View>
            <Animated.View style={[styles.animateop, { opacity: dislikeOpacity, right: 40 }]}>
                <Text style={[styles.opinion, { borderColor: 'red', color: 'red' }]}>NOPE</Text>
            </Animated.View>
            <Image style={styles.imgstyles}
                source={{ uri: item.imglink }} onLoad={() => setImageLoaded(true)}
            />
            {/* top song details */}
            {imageLoaded && (
              // <View style={{ zIndex: 1000, position: 'absolute', left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', }}>
                  <View style={[styles.innertext, 
                    { zIndex: 999, backgroundColor: 'black', top: 50, position: 'absolute', textAlign: 'center', width: '100%' }
                  ]}>
                    <Text style={styles.textstyles}>
                      {item.name} • {item.artist}
                    </Text>
                  </View>
              // </View>
            )}
            {/* middle text */}
            {imageLoaded && (
              <View style={{ zIndex: 1000, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', }}>
                <View style={styles.innertext}>
                  <Text style={styles.textstyles}>Emotion: {item.phrase}</Text>
                  <Text style={styles.textstyles}>{item.text}</Text>
                  <Text style={styles.textstyles}>Posted by {item.username}</Text>
                </View>
              </View>
            )}
        </Animated.View>
    ) : (
        <Animated.View key={item.id} style={[{
          opacity: nextCardOpacity,
          transform: [{ scale: nextCardScale }],
          height: SCREEN_HEIGHT * .7, width: SCREEN_WIDTH, padding: 10, position: 'absolute'
        }]}>
          <Animated.View style={[styles.animateop, { left: 40 }]}>
            <Text style={[styles.opinion, { borderColor: 'green', color: 'green' }]}>LIKE</Text>
          </Animated.View>
          <Animated.View style={[styles.animateop, { right: 40 }]}>
            <Text style={[styles.opinion, { borderColor: 'red', color: 'red' }]}>NOPE</Text>
          </Animated.View>
          <Image style={styles.imgstyles} source={{ uri: item.imglink }} onLoad={() => setImageLoaded(true)} />
          {imageLoaded && (
            <View style={{ zIndex: 1000, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', }}>
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
      flex: 1,
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
      transform: [{ rotate: '30deg' }],
      position: 'absolute',
      top: 50,
      zIndex: 1000,
      opacity: 0
    },
    imgstyles: {
      flex: 1,
      height: null,
      width: null,
      resizeMode: 'cover',
      borderRadius: 20 
    }
  });