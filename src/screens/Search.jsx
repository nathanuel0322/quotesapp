import { React, useState, useEffect } from 'react';
import {StyleSheet, View} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import  { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';

const emotions = ["Alone", "Angry", "Anniversary", "Attitude", "Awesome", "Awkward Moment", "Beard", "Beautiful", "Best", "Bike", "Birthday", "Break Up", "Brother", "Busy"] 

export default function Search() {
  const [posts, setPosts] = useState([]);
  const postsCollectionRef = collection(db, 'posts');
  selectedEmotion = 'Anniversary'

  useEffect(() => {
    const getPosts = async () => {
    const data = await getDocs(postsCollectionRef);
    setPosts(data.docs.map((doc) => ({ ...doc.data(), id: doc.id})));
  };

    getPosts();
  }, []);

  return (
    <View>
      {posts.map((post) => {
        return <div> 
          <Text> Quote: {post.text} </Text>
          <Text> {post.selectedEmotion} </Text>
        </div>;
      })}
    </View>


    // <View style={styles.container}>
    //   <Carousel layout={'tinder'} layoutCardOffset={9} />
    // </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
