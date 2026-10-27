import { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Dimensions, Image, Animated, PanResponder } from 'react-native';
import  { collection, getDocs, doc, runTransaction, updateDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import Slide from '../components/home/Slide';
import { Audio } from 'expo-av';
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Toast } from 'toastify-react-native';
import { useTheme } from '../components/global/ThemeContext';
import GlobalStyles from '../GlobalStyles';

export default function Home({ navigation }) {
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0)
  const [sound, setSound] = useState()
  const [muted, setMuted] = useState(false)
  const isFocused = useIsFocused();
  const { colors } = useTheme();

  async function updateFSLiked() {
    // batch write to Firestore
    const newLikedQuotes = JSON.parse(await AsyncStorage.getItem("liked")) ?? []
    const userRef = doc(db, 'users', auth.currentUser.displayName)

    const userDoc = await getDoc(userRef)
    const storedLiked = userDoc.data()?.likedquotes;
    
    const sameLikes = JSON.stringify(newLikedQuotes) === JSON.stringify(storedLiked)

    if (!sameLikes) {
      await updateDoc(userRef, { likedquotes: newLikedQuotes })
    }
  }

  // triggers when user leaves the search component
  useEffect(() => {
    async function innerstop() {
      await stopSound()
    }
    if (!isFocused) {
      innerstop()
      updateFSLiked().catch((e) => console.log("Syncing likes failed:", e))
    } else if (posts[currentIndex]?.link) {
      // if focused again, play current song
      playSound(posts[currentIndex].link)
    }
  }, [isFocused]);

  async function playSound(link) {
    if (!link) {
      return
    }
    try {
      const { sound } = await Audio.Sound.createAsync({ uri: link });
      await sound.setIsLoopingAsync(true);
      await sound.setIsMutedAsync(muted)
      setSound(sound);
      await sound.playAsync();
    } catch (e) {
      console.log("Playing song failed:", e)
    }
  }

  async function stopSound() {
    await sound?.stopAsync().catch(() => {})
  }

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  useEffect(() => {
    sound?.setIsMutedAsync(muted).catch(() => {})
  }, [muted])

  useEffect(() => {
    const getPosts = async () => {
      const likedarr = JSON.parse(await AsyncStorage.getItem('liked'))
      const data = await getDocs(collection(db, 'quotes'));
      setPosts(data.docs.map((doc) => ({ ...doc.data(), id: doc.id})).filter((val) => !likedarr?.includes(val.id)));
    };

    getPosts()
      .catch((e) => {
        console.log("Loading posts failed:", e)
        Toast.error("Couldn't load posts!")
      })
      .finally(() => setLoadingPosts(false));
  }, []);

  useEffect(() => {
    // console.log("posts are:", posts)
    if (posts.length > 0) {
      if (sound) {
        stopSound()
      }
      playSound(posts[currentIndex]?.link)
    }
  }, [posts, currentIndex])

  const pan = useRef(new Animated.ValueXY()).current;

  const SCREEN_HEIGHT = Dimensions.get('window').height
  const SCREEN_WIDTH = Dimensions.get('window').width

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true, // Always return true to allow gesture
    onPanResponderMove: async(evt, gestureState) => {
      if (Math.abs(gestureState.dx) >= 315) {
        // setCurrentIndex(currentIndex + 1);
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
          await likesaver(posts[currentIndex].id)
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
          setCurrentIndex(currentIndex + 1);
          pan.setValue({ x: 0, y: 0 });
          await stopSound()
        })
      } else {
        Animated.spring(pan, { toValue: { x: 0, y: 0 }, friction: 4, useNativeDriver: true }).start()
      }
    }
  })

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

  async function likesaver(cardid) {
    try {
      const jsonValue = JSON.parse(await AsyncStorage.getItem('liked'));
      if (jsonValue != null) {
        let finalarr = [...jsonValue, cardid]
        await AsyncStorage.setItem('liked', JSON.stringify(finalarr))
      } else {
        await AsyncStorage.setItem('liked', JSON.stringify([cardid]))
      }
    } catch (e) {
      console.log("Error saving likes to localStorage")
      Toast.error("Error saving like!")
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Image source={require('../assets/icons/ThatPush.jpg')} style={{ position: 'absolute', top: 10, left: 25, width: 75, height: 75 }} />
      <View style={{ height: 80 }}></View>
      <View style={{ flex: 1, marginTop: '5%' }}>
        {currentIndex >= posts.length && (
          <View style={styles.empty}>
            <Text style={[styles.emptytext, { color: colors.textSecondary }]}>
              {loadingPosts ? '' : "You're all caught up!"}
            </Text>
          </View>
        )}
        {/* the next card renders first so the current card sits on top of it */}
        {posts[currentIndex + 1] && (
          <Slide navigation={navigation} currentcard={false} key={posts[currentIndex + 1].id} item1={posts[currentIndex + 1]} panResponder={panResponder} rotateAndTranslate={rotateAndTranslate} dislikeOpacity={dislikeOpacity}
            likeOpacity={likeOpacity} nextCardOpacity={nextCardOpacity} nextCardScale={nextCardScale} SCREEN_HEIGHT={SCREEN_HEIGHT} SCREEN_WIDTH={SCREEN_WIDTH}
          />
        )}
        {posts[currentIndex] && (
          <Slide navigation={navigation} currentcard={true} key={posts[currentIndex].id} item1={posts[currentIndex]} panResponder={panResponder} rotateAndTranslate={rotateAndTranslate} likeOpacity={likeOpacity}
            dislikeOpacity={dislikeOpacity} SCREEN_HEIGHT={SCREEN_HEIGHT} SCREEN_WIDTH={SCREEN_WIDTH} muted={muted} setMuted={setMuted}
          />
        )}
      </View>
      <View style={{ height: 60 }}></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptytext: {
    fontSize: 18,
    fontFamily: GlobalStyles.fontSet.fontsemibold,
  },
});