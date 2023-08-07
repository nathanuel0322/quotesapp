import React, { useState } from "react";
import { Animated, Text, Image, View, StyleSheet } from "react-native";

export default function Slide({ item, currentcard, panResponder, rotateAndTranslate, likeOpacity, dislikeOpacity, nextCardOpacity, nextCardScale,
    SCREEN_HEIGHT, SCREEN_WIDTH
}) {
    const [imageLoaded, setImageLoaded] = useState(false);

    return (
        currentcard ? (
            <Animated.View key={item.id}
                {...panResponder.panHandlers}
                style={[rotateAndTranslate, { height: SCREEN_HEIGHT * .7, width: SCREEN_WIDTH, padding: 10, position: 'absolute' }]}
            >
                <Animated.View style={{ opacity: likeOpacity, transform: [{ rotate: '-30deg' }], position: 'absolute', top: 50, left: 40, zIndex: 1000 }}>
                    <Text style={{ borderWidth: 1, borderColor: 'green', color: 'green', fontSize: 32, fontWeight: '800', padding: 10 }}>LIKE</Text>
                </Animated.View>
                <Animated.View style={{ opacity: dislikeOpacity, transform: [{ rotate: '30deg' }], position: 'absolute', top: 50, right: 40, zIndex: 1000 }}>
                    <Text style={{ borderWidth: 1, borderColor: 'red', color: 'red', fontSize: 32, fontWeight: '800', padding: 10 }}>NOPE</Text>
                </Animated.View>
                <Image
                    style={{ flex: 1, height: null, width: null, resizeMode: 'cover', borderRadius: 20 }}
                    source={{ uri: item.imglink }}
                    onLoad={() => setImageLoaded(true)}
                />
                {imageLoaded && (
                <View style={{ zIndex: 1000, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', }}>
                    <View style={styles.innertext}>
                    <Text style={[styles.textstyles, { color: 'white', fontSize: 20, fontWeight: 'bold' }]}>
                        Emotion: {item.selectedEmotion}
                    </Text>
                    <Text style={[styles.textstyles, { color: 'white', fontSize: 20, fontWeight: 'bold' }]}>
                        {item.text}
                    </Text>
                    <Text style={[styles.textstyles, { color: 'white', fontSize: 20, fontWeight: 'bold' }]}>
                        Posted by {item.uid}
                    </Text>
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
              <Animated.View style={{ opacity: 0, transform: [{ rotate: '-30deg' }], position: 'absolute', top: 50, left: 40, zIndex: 1000 }}>
                <Text style={{ borderWidth: 1, borderColor: 'green', color: 'green', fontSize: 32, fontWeight: '800', padding: 10 }}>LIKE</Text>
              </Animated.View>
              <Animated.View style={{ opacity: 0, transform: [{ rotate: '30deg' }], position: 'absolute', top: 50, right: 40, zIndex: 1000 }}>
                <Text style={{ borderWidth: 1, borderColor: 'red', color: 'red', fontSize: 32, fontWeight: '800', padding: 10 }}>NOPE</Text>
              </Animated.View>
              <Image
                style={{ flex: 1, height: null, width: null, resizeMode: 'cover', borderRadius: 20 }}
                source={{ uri: item.imglink}}
                onLoad={() => setImageLoaded(true)}
              />
              {imageLoaded && (
                <View style={{ zIndex: 1000, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', }}>
                  <View style={styles.innertext}>
                    <Text style={[styles.textstyles, { color: 'white', fontSize: 20, fontWeight: 'bold' }]}>
                      Emotion: {item.selectedEmotion}
                    </Text>
                    <Text style={[styles.textstyles, { color: 'white', fontSize: 20, fontWeight: 'bold' }]}>
                      {item.text}
                    </Text>
                    <Text style={[styles.textstyles, { color: 'white', fontSize: 20, fontWeight: 'bold' }]}>
                      Posted by {item.uid}
                    </Text>
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
    },
    textstyles: {
      textAlign: 'center',
      marginVertical: '2%'
    }
  });