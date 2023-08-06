import { React, useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Dimensions, Image, Animated, PanResponder } from 'react-native';
import  { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';

export default function Search() {
  const [posts, setPosts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0)
  const pan = useRef(new Animated.ValueXY()).current;

  const SCREEN_HEIGHT = Dimensions.get('window').height
  const SCREEN_WIDTH = Dimensions.get('window').width

  const postsCollectionRef = collection(db, 'quotes');
  
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: Animated.event([
      null, { dx: pan.x, dy: pan.y, },
    ], { useNativeDriver: false }),
    onPanResponderRelease: (evt, gestureState) => {
      if (gestureState.dx > 120) {
        Animated.spring(pan, {
          toValue: { x: SCREEN_WIDTH + 100, y: gestureState.dy },
          useNativeDriver: true
        }).start(() => {
          setCurrentIndex(currentIndex + 1);
          pan.setValue({ x: 0, y: 0 });
        })
      } else if (gestureState.dx < -120) {
        Animated.spring(pan, {
          toValue: { x: -SCREEN_WIDTH - 100, y: gestureState.dy },
          useNativeDriver: true
        }).start(() => {
          setCurrentIndex(currentIndex + 1);
          pan.setValue({ x: 0, y: 0 });
        })
      } else {
        Animated.spring(pan, { toValue: { x: 0, y: 0 }, friction: 4, useNativeDriver: true }).start()
      }
    }
  })

  useEffect(() => {
    const getPosts = async () => {
      const data = await getDocs(postsCollectionRef);
      setPosts(data.docs.map((doc) => ({ ...doc.data(), id: doc.id})));
    };

    getPosts();
  }, []);

  useEffect(() => {
    console.log("posts are:", posts)
  }, [posts])


  const rotate = pan.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: ['-30deg', '0deg', '10deg'],
    extrapolate: 'clamp',
  });

  const rotateAndTranslate = {
    transform: [{ translateX: pan.x }, { translateY: pan.y }, { rotate }],
  };

  const likeOpacity = pan.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: [0, 0, 1],
    extrapolate: 'clamp',
  });

  const dislikeOpacity = pan.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: [1, 0, 0],
    extrapolate: 'clamp',
  });

  const nextCardOpacity = pan.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: [1, 0, 1],
    extrapolate: 'clamp',
  });

  const nextCardScale = pan.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: [1, 0.8, 1],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      <View style={{ height: 60 }}></View>
      <View style={{ flex: 1 }}>
        {posts.map((item, i) => {
          if (i < currentIndex) {
            return null
          } else if (i === currentIndex) {
            return (
              <Animated.View key={item.id}
                {...panResponder.panHandlers}
                style={[rotateAndTranslate, { height: SCREEN_HEIGHT * .75, width: SCREEN_WIDTH, padding: 10, position: 'absolute' }]}
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
                />
                <View style={{ zIndex: 1000, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', }}>
                  <View style={styles.innertext}>
                    <Text style={[styles.textstyles, { color: 'white', fontSize: 20, fontWeight: 'bold' }]}>
                      Emotion: {item.selectedEmotion} {/* Replace with the desired text */}
                    </Text>
                    <Text style={[styles.textstyles, { color: 'white', fontSize: 20, fontWeight: 'bold' }]}>
                      {item.text} {/* Replace with the desired text */}
                    </Text>
                    <Text style={[styles.textstyles, { color: 'white', fontSize: 20, fontWeight: 'bold' }]}>
                      Posted by {item.uid} {/* Replace with the desired text */}
                    </Text>
                  </View>
                </View>
              </Animated.View>
            )
          } else {
            return (
              <Animated.View key={item.id} style={[{
                opacity: nextCardOpacity,
                transform: [{ scale: nextCardScale }],
                height: SCREEN_HEIGHT * .75, width: SCREEN_WIDTH, padding: 10, position: 'absolute'
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
                />
              </Animated.View>
            )
          }
        }).reverse()}
      </View>
      <View style={{ height: 60 }}></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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