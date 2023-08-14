import { React, useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Dimensions, Image, Animated, PanResponder } from 'react-native';
import  { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import Slide from '../components/home/Slide';
import { Audio } from 'expo-av';
import { useIsFocused, useNavigation } from '@react-navigation/native';

export default function Search() {
  const [posts, setPosts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0)
  const [sound, setSound] = useState()
  const [muted, setMuted] = useState(false)
  const isFocused = useIsFocused();
  const navigation = useNavigation();

  // triggers when user leaves the search component
  useEffect(() => {
    async function innerstop() {
      await stopSound()
    }
    if (!isFocused) {
      console.log('Search screen is no longer focused (user left)');
      innerstop()
    } else {
      // if focused again, play current song
      playSound(posts[currentIndex]?.link)
    }
  }, [isFocused]);

  async function playSound(link) {
    console.log('Loading Sound');
    const { sound } = await Audio.Sound.createAsync({ uri: link });
    await sound.setIsLoopingAsync(true);
    await sound.setIsMutedAsync(muted)
    setSound(sound);

    console.log('Playing Sound');
    await sound.playAsync();
  }

  async function stopSound() {
    await sound.stopAsync()
  }

  useEffect(() => {
    return sound
      ? () => {
          console.log('Unloading Sound');
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  useEffect(() => {
    async function mutefunc() {
      await sound.setIsMutedAsync(muted)
    }
    mutefunc(muted)
  }, [muted])

  const pan = useRef(new Animated.ValueXY()).current;

  const SCREEN_HEIGHT = Dimensions.get('window').height
  const SCREEN_WIDTH = Dimensions.get('window').width

  const postsCollectionRef = collection(db, 'quotes');
  
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true, // Always return true to allow gesture
    onPanResponderGrant: () => {
      // Card entering the screen, you can add your logic here
      console.log("Card entered the screen");
    },
    onPanResponderMove: async(evt, gestureState) => {
      console.log("Pan X:", gestureState.dx);
      console.log("Pan Y:", gestureState.dy);
      if (Math.abs(gestureState.dx) >= 315) {
        setCurrentIndex(currentIndex + 1);
        // pause current song
        await stopSound();
      }

      Animated.event([null, { dx: pan.x, dy: pan.y, },], { 
        useNativeDriver: false 
      })(evt, gestureState);
    },
    onPanResponderRelease: (evt, gestureState) => {
      if (gestureState.dx > 120) {
        Animated.spring(pan, {
          toValue: { x: SCREEN_WIDTH + 100, y: gestureState.dy },
          useNativeDriver: true,
          // duration: 300
        }).start(async() => {
          // Card was liked
          console.log("Card liked");
          setCurrentIndex(currentIndex + 1);
          pan.setValue({ x: 0, y: 0 });
          await stopSound()
        })
      } else if (gestureState.dx < -120) {
        Animated.spring(pan, {
          toValue: { x: -SCREEN_WIDTH - 100, y: gestureState.dy },
          useNativeDriver: true,
          // duration: 300
        }).start(async () => {
          // Card was disliked
          console.log("Card disliked");
          setCurrentIndex(currentIndex + 1);
          pan.setValue({ x: 0, y: 0 });
          await stopSound()
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
    // console.log("posts are:", posts)
    if (posts.length > 0) {
      if (sound) {
        stopSound()
      }
      playSound(posts[currentIndex].link)
    }
  }, [posts, currentIndex])

  const rotate = pan.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: ['-10deg', '0deg', '10deg'],
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
      <View style={{ flex: 1, marginTop: '5%' }}>
        {posts.map((item, i) => {
          if (i < currentIndex) {
            return null
          } else if (i === currentIndex) {
            return (
              <Slide currentcard={true} key={item.id} item1={item} item2={i !== posts.length - 1 && posts[i+1]} panResponder={panResponder} rotateAndTranslate={rotateAndTranslate} likeOpacity={likeOpacity}
                dislikeOpacity={dislikeOpacity} SCREEN_HEIGHT={SCREEN_HEIGHT} SCREEN_WIDTH={SCREEN_WIDTH} muted={muted} setMuted={setMuted}
              />
            )
          } else {
            return (
              <Slide currentcard={false} key={item.id} item1={item} item2={i !== posts.length - 1 && posts[i+1]} panResponder={panResponder} rotateAndTranslate={rotateAndTranslate} dislikeOpacity={dislikeOpacity}
                likeOpacity={likeOpacity} nextCardOpacity={nextCardOpacity} nextCardScale={nextCardScale} SCREEN_HEIGHT={SCREEN_HEIGHT} SCREEN_WIDTH={SCREEN_WIDTH}
              />
            )
          }
        })}
      </View>
      <View style={{ height: 60 }}></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});