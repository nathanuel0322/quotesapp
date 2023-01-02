import React from 'react';
import {StyleSheet, View, Image, Text, Pressable, TouchableOpacity} from 'react-native';
import { SimpleLineIcons } from '@expo/vector-icons';
import GlobalStyles from '../../GlobalStyles';

const img1 = '../../assets/temp/temp3.png';
import ProfilePicIcon from '../../assets/images/profilepic.svg';
import LikeChosen from '../../assets/icons/like-chosen.svg';
import Comments from '../../assets/icons/comments.svg';
import SendPost from '../../assets/icons/dm-action.svg';
import PostProfile from '../../assets/icons/user-octagon.svg';
import SavePost from '../../assets/icons/saveposticon.svg';

export default function Post({marginTop = 0, bottomSheetRef, navigation}) {
  return (
    <View style={[styles.container, {marginTop: marginTop}]}>
      <Image source={require(img1)} style={styles.img} />
      <View style={styles.overlay}>
        <View style={styles.top_section}>
          <View style={styles.user}>
            <ProfilePicIcon 
              width={45}
              height={45}
            />
            <View style={styles.user_details}>
              <Text style={[styles.user_details_text, {fontFamily: 'Gilroy-Bold'}]}>Reza Nezhadmusavi</Text>
              <Text style={styles.user_details_text}>Seattle, WA, USA</Text>
              <View style={styles.bubbles}>
                <View style={styles.bubble1} />
                <View style={styles.bubble2} />
                <View style={styles.bubble2} />
                <View style={styles.bubble2} />
              </View>
            </View>
          </View>
          <Pressable>
            <SimpleLineIcons
              name="options-vertical" 
              size={20}
              color={GlobalStyles.colorSet.text}
            />
          </Pressable>
        </View>
        <View style={styles.bottom_section}>
          <View style={styles.post_interactions}>
            <Pressable style={styles.like_button}>
              <LikeChosen 
                height={24}
              />
              <Text style={styles.post_interactions_text}>115k</Text>
            </Pressable>
            <Pressable style={styles.comment_button}>
              <Comments
                height={24}
                width={24}
              />
              <Text style={styles.post_interactions_text}>1.5k</Text>
            </Pressable>
            <TouchableOpacity style={styles.share_button} onPress={() => {
              bottomSheetRef.current.expand(), 
              navigation.setOptions({
                tabBarStyle: {
                  display: "none",
                }
              });
            }}>
              <SendPost height={25} />
            </TouchableOpacity>
          </View>
          <View style={styles.other_interactions}>
            <Pressable style={styles.user_button}>
              <PostProfile/>
            </Pressable>
            <Pressable style={styles.save_button}>
              <SavePost
              />
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  img: {
    width: '100%',
    height: undefined,
    aspectRatio: 1,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  overlay: {
    position: 'absolute',
    zIndex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'space-between',
    padding: 20,
    paddingBottom: 40,
  },
  top_section: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  user: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  user_pic: {
    width: 40,
    height: 40,
    borderWidth: 2,
    borderRadius: 15,
    borderColor: '#ffa41b',
  },
  user_details: {
    marginLeft: 10,
    alignItems: 'flex-start',
  },
  user_details_text: {
    fontSize: 14,
    color: GlobalStyles.colorSet.text,
    fontFamily: 'Gilroy',
  },
  bubbles: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 3,
  },
  bubble1: {
    width: 15,
    height: 4,
    backgroundColor: '#fff',
    borderRadius: 2,
  },
  bubble2: {
    width: 4,
    height: 4,
    backgroundColor: '#777',
    borderRadius: 2,
    marginLeft: 3,
  },
  bottom_section: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  post_interactions: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  like_button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: GlobalStyles.colorSet.red7,
    borderRadius: 13,
    marginRight: 20,
    height: 37,
  },
  post_interactions_text: {
    color: GlobalStyles.colorSet.text,
    marginLeft: 5,
    fontFamily: 'Gilroy',
  },
  comment_button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginRight: 20,
  },
  share_button: {
    justifyContent: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  other_interactions: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  user_button: {
    paddingRight: 10,
  },
  save_button: {
    paddingLeft: 10,
  },
});
