import { React, useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Dimensions, Image, Animated, PanResponder } from 'react-native';
import  { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import Slide from '../components/home/Slide';

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
      <View style={{ flex: 1, marginTop: '5%' }}>
        {posts.map((item, i) => {
          if (i < currentIndex) {
            return null
          } else if (i === currentIndex) {
            return (
              <Slide currentcard={true} key={item.id} item={item} panResponder={panResponder} rotateAndTranslate={rotateAndTranslate} likeOpacity={likeOpacity}
                dislikeOpacity={dislikeOpacity} SCREEN_HEIGHT={SCREEN_HEIGHT} SCREEN_WIDTH={SCREEN_WIDTH}
              />
            )
          } else {
            return (
              <Slide currentcard={false} key={item.id} item={item} panResponder={panResponder} rotateAndTranslate={rotateAndTranslate}
                likeOpacity={likeOpacity} nextCardOpacity={nextCardOpacity} nextCardScale={nextCardScale} SCREEN_HEIGHT={SCREEN_HEIGHT} SCREEN_WIDTH={SCREEN_WIDTH}
              />
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
});