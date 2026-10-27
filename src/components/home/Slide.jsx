import React, { useState } from "react";
import { BlurView } from "expo-blur";
import { Animated, Text, Image, View, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';

import GlobalStyles from "../../GlobalStyles";
import { useTheme } from "../global/ThemeContext";

export default function Slide({ item1, muted, setMuted, currentcard, panResponder, rotateAndTranslate, likeOpacity, dislikeOpacity, nextCardOpacity, nextCardScale,
    SCREEN_HEIGHT, SCREEN_WIDTH, navigation
}) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const { colors } = useTheme();
  const textStyle = [styles.textstyles, { color: colors.text }];
  const panelStyle = [styles.innertext, { backgroundColor: colors.overlay }];

  return (
    currentcard ? (
      <Animated.View {...panResponder.panHandlers} style={[rotateAndTranslate, { zIndex: 3 }]}>
        <Animated.View key={item1.id} style={{ height: SCREEN_HEIGHT * .7, width: SCREEN_WIDTH, padding: 10, position: 'absolute' }}>
            <Animated.View style={[styles.animateop, { transform: [{ rotate: '30deg' }], opacity: likeOpacity, left: 40 }]}>
                <Text style={[styles.opinion, { borderColor: colors.success, color: colors.success }]}>LIKE</Text>
            </Animated.View>
            <Animated.View style={[styles.animateop, { transform: [{ rotate: '30deg' }], opacity: dislikeOpacity, right: 40 }]}>
                <Text style={[styles.opinion, { borderColor: colors.danger, color: colors.danger }]}>NOPE</Text>
            </Animated.View>
            <Image style={styles.imgstyles}
                source={{ uri: item1.imglink }} onLoad={() => setImageLoaded(true)}
            />
            {/* top song details */}
            {imageLoaded && item1.name && item1.artist && (
              <BlurView tint={colors.blurTint} style={styles.musicview}>
                <Text style={[styles.textstyles, { color: colors.text, fontFamily: GlobalStyles.fontSet.fontbold, marginVertical: 0 }]}>
                  🎵 {item1.name} • {item1.artist}
                </Text>
              </BlurView>
            )}
            {/* middle text */}
            {imageLoaded && (
              <Animated.View style={[styles.innerview, { zIndex: 2 }]}>
                <TouchableOpacity style={panelStyle} onPress={() => {
                  navigation.navigate("OtherProfile", { username: item1.username })
                }}>
                  <Text style={textStyle}>Emotion: {item1.phrase}</Text>
                  <Text style={textStyle}>{item1.text}</Text>
                  <Text style={textStyle}>Posted by {item1.username}</Text>
                </TouchableOpacity>
              </Animated.View>
            )}
            <TouchableOpacity onPress={() => setMuted(!muted)} style={styles.soundview}
              accessibilityRole="button" accessibilityLabel={muted ? "Unmute" : "Mute"}
            >
              <BlurView tint={colors.blurTint} style={{ padding: 6 }}>
                <MaterialIcons name={muted ? "volume-off" : "volume-up"} size={26} color={colors.text} />
              </BlurView>
            </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    ) : (
        <Animated.View key={item1.id} style={{ opacity: nextCardOpacity, transform: [{ scale: nextCardScale }], height: SCREEN_HEIGHT * .7, 
          width: SCREEN_WIDTH, padding: 10, position: 'absolute'
        }}>
          <Image style={styles.imgstyles} source={{ uri: item1.imglink }} onLoad={() => setImageLoaded(true)} />
          {imageLoaded && (
            <View style={styles.innerview}>
              <View style={panelStyle}>
                <Text style={textStyle}>Emotion: {item1.phrase}</Text>
                <Text style={textStyle}>{item1.text}</Text>
                <Text style={textStyle}>Posted by {item1.username}</Text>
              </View>
            </View>
          )}
        </Animated.View>
    )
  );
}

const styles = StyleSheet.create({
    innertext: {
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      maxHeight: '30%',
      padding: 8,
      borderRadius: 16
    },
    textstyles: {
      textAlign: 'center',
      marginVertical: '2%',
      fontSize: 20,
      fontWeight: 'bold',
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
    },
    musicview: {
      zIndex: 999,
      top: 15,
      position: 'absolute',
      textAlign: 'center',
      alignSelf: 'center',
      padding: 4,
      borderRadius: 8,
      overflow: 'hidden'
    },
    soundview: {
      zIndex: 999,
      top: 11,
      position: 'absolute',
      textAlign: 'center',
      right: '4%',
      padding: 4,
      borderRadius: 8,
      overflow: 'visible'
    }
  });