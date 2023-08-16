import React, {useState} from 'react';
import {View, TouchableOpacity, StyleSheet, Text} from 'react-native';
import Posts from './Posts';
import Liked from './Liked';

import { Ionicons } from '@expo/vector-icons';
import ContentFilled from '../../assets/icons/content-filled.svg';
import ContentTransparent from '../../assets/images/content-transparent.svg'; 
import GlobalStyles from '../../GlobalStyles';

export default function ProfileButtons() {
  const [page, setPage] = useState();

  const handlePage = (event, newPage) => {
    setPage(newPage);
  };

  return(
    <View>
      <View style={styles.container}>
        <TouchableOpacity style={styles.button} onPress={() => setPage('Posts')}>
          {page === 'Posts' ? 
            <View style={styles.buttonview}>
              <ContentFilled width={30} height={30} />
              <Text style={styles.buttontext}>
                Posts
              </Text>
            </View>
          :
            <ContentTransparent width={30}height={30} />   
          }
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => {setPage('Liked')}}>
          {page === 'Liked' ? 
            <View style={styles.buttonview}>
              <Ionicons name="ios-heart-sharp" size={30} color="white" />
              <Text style={styles.buttontext}>
                Liked
              </Text>
            </View>
          :
            <Ionicons name="ios-heart-outline" size={30} color="white" />
          }
        </TouchableOpacity>
      </View>
      <View style={{marginTop: 75}}>
        <Text>
          {page === 'Posts' && <Posts />}
          {page === 'Liked' && <Liked />}
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    marginTop: -55,
    alignItems: 'center',
    justifyContent: 'center',
    // marginHorizontal: 20,
    width: '50%'
  },

  buttonview: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttontext: {
    color: 'white',
    fontFamily: GlobalStyles.fontSet.fontsemibold,
    marginLeft: 5,
    fontSize: 16,
  }
})