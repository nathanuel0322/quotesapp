import React from 'react';
import {StyleSheet, View, Pressable, Image} from 'react-native';
import AddPost from '../../assets/icons/addpost.svg';
import Likes from '../../assets/icons/likeicon.svg';
import Messages from '../../assets/icons/dms.svg';

import GlobalStyles from '../../GlobalStyles';
import Globals from '../../GlobalValues';

export default function MainHeader() {
  return (
    <View style={styles.container}>
      <Pressable style={[styles.side_section, {
        left: 14,
      }]}>
        <AddPost
          width={28}
          height={28}
        />
      </Pressable>
      <View 
        style={[styles.logo_section, 
          {
            left: Globals.globalDimensions.width * 0.130841121
          }
        ]}
      >
        <Image
          source={require('../../assets/images/mobulogowbackground.png')}
          style={{resizeMode: 'contain', width: 100, height: 50}}
        />
      </View>
      <View style={[styles.side_section, {
        left: -10,
      }]}>
        <Pressable>
          <Likes
            height={26}
          />
        </Pressable>
        <Pressable
          style={{top: 3,}}
        >
          <Messages
            height={50}
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 50,
    flexDirection: 'row',
    top: 50,
  },
  logo_section: {
    flex: 2,
    justifyContent: 'center',
    alignContent: 'center',
    top: -5,
  },
  side_section: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
});
