import React, {useContext, useState, useMemo, useRef, useCallback, useEffect} from 'react';
import {Text, Image, View, TouchableOpacity, StyleSheet, Pressable, ActivityIndicator} from 'react-native';
import GlobalStyles from '../GlobalStyles';
import Globals from '../GlobalValues';
import { BlurView } from 'expo-blur';
import {ref, uploadBytes, getDownloadURL, getMetadata} from "firebase/storage";
import { auth, db, storage } from '../../firebase';
import ProfileButtons from '../components/profile/ProfileButtons';

import Sepline from '../assets/icons/sepline.svg';
import { doc, getDoc } from 'firebase/firestore';

export default function OtherProfile({ navigation, route }) {
  const [image, setImage] = useState(null); 
  const [follow, setFollow] = useState({})
  const [picexists, setPicExists] = useState(null)
  const [username, setUsername] = useState(route.params.username)
  const [following, setFollowing] = useState()
  console.log("username is:", route.params.username)
  const pfpRef = ref(storage, `profilepictures/${username}`)
  
  useEffect(() => {
    async function followcheck() {
      await getDoc(doc(db, 'users', username))
        .then((val) => {
          console.log("data:", val.data())
          setFollow({ followers: val.data().followers, following: val.data().following, likedquotes: val.data().likedquotes, bio: val.data().bio })
        })
        .catch((e) => {
            console.log("e:", e)
        })
    }
    followcheck()
    picchecker()
  }, [])

  useEffect(() => {
    console.log("follow val now:", follow)
  }, [follow])

  async function picchecker() {
    console.log("Pic checker starts");
    const profilepicurl = await getDownloadURL(pfpRef)
    if (profilepicurl) {
      console.log('Pic Exists');
      setPicExists(true)
      setImage(profilepicurl);
    }
  }

  return (
    <View style={{width: Globals.globalDimensions.width,flexDirection: 'column',flex: 1,}}>
      <View style={{top: 22, flexDirection: 'row', position: 'absolute', }}>
        <View style={{ overflow: 'hidden', height: 45, borderRadius: 15, zIndex: 999,left: 15,}}>
          <BlurView intensity={13}> 
            <View style={{ fontSize: 14, backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: 15, padding: 11, height: 45, zIndex: 999, }}>
              <Text style={{ color: 'white', fontFamily: GlobalStyles.fontSet.fontsemibold, top: 3,}}>
                {username}
              </Text> 
            </View>
          </BlurView>
        </View>
      </View>
      <View style={[profilestyles.firstsection,{marginTop: Globals.globalDimensions.height * .075,}]}>
        <View style={[profilestyles.fpfp, {top: Globals.globalDimensions.height < 900 && Globals.globalDimensions.height * .0407608696,}]}>
          <View style={[profilestyles.fpfpP, { top: -10, width: Globals.globalDimensions.width * .136, }]}>
            <Text style={profilestyles.followtext}>
              {follow.followers?.length}
            </Text>
            <Text style={{ color: GlobalStyles.colorSet.secondary6, fontSize: 13, fontFamily: GlobalStyles.fontSet.font, }}>
              Followers
            </Text>
          </View>
          <Pressable style={[profilestyles.fpfpP, { paddingHorizontal: 75, width: Globals.globalDimensions.width * .136, borderRadius: 36, 
            overflow: 'hidden'
          }]}
            onPress={() => pickImage()}
          >
            {picexists ?
              <Image
                source={{ uri: image }}
                style={{ width: Globals.globalDimensions.width * .266666667, height: Globals.globalDimensions.width * .266666667,
                  borderRadius: 16,
                }}
              />
            :
                <Image
                    source={require('../assets/images/blank-profile-picture-973460_640.png')}
                    style={{ width: Globals.globalDimensions.width * .266666667, height: Globals.globalDimensions.width * .266666667,
                    borderRadius: 16,
                    }}
                />
            }
          </Pressable>
          <View style={[profilestyles.fpfpP, { top: -10, width: Globals.globalDimensions.width * .154666667, }]} >
            <Text style={profilestyles.followtext}>
              {follow.following?.length}
            </Text>
            <Text style={[profilestyles.grays, {fontFamily: GlobalStyles.fontSet.font,fontSize: 13,}]}>
              Following
            </Text>
          </View>
        </View>
        <View 
          style={{marginTop: Globals.globalDimensions.height < 900 ? Globals.globalDimensions.height * .06 : 
            Globals.globalDimensions.height * .0172786177,}}
        >
          <Text style={{  color: 'white',   fontSize: 20,  fontFamily: GlobalStyles.fontSet.fontsemibold,}}>
            {username}
          </Text>
        </View>
        {follow.bio &&
          <View 
            style={[
              profilestyles.profilebio, 
              {
                width: '74%',
                justifyContent: 'center',
                alignContent: 'center',
                marginTop: 12,
              }
            ]}
          >
            <Text style={{color: 'white', fontFamily: GlobalStyles.fontSet.font, textAlign: 'center', fontSize: 15,}}>
              {follow.bio}
            </Text>
          </View>
        }
        <View style={[profilestyles.profilebuttons, {flex: 1, justifyContent: 'center',}]}>
          <Pressable
            onPress={() => [setFollowing(!following), console.log('following is ' + !following)]}
            style={[
              profilestyles.buttons, 
              {
                flexDirection: 'row',
                backgroundColor: following ? 'transparent' : GlobalStyles.colorSet.primary4,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 4,
                width: Globals.globalDimensions.width * .434666667,
                height: Globals.globalDimensions.height > 900 ?  Globals.globalDimensions.height * .0492610837 : Globals.globalDimensions.height * .06,
                borderWidth: 2,
                borderColor: following ? GlobalStyles.colorSet.neutral5 : GlobalStyles.colorSet.primary4, 
              }
            ]}
          >
            <Text
              style={{
                color: 'white',
                textAlign: 'center',
                fontFamily: GlobalStyles.fontSet.fontbold,
                fontSize: 15,
              }}
            >
              {following ? 'Following' : 'Follow'}
            </Text>
          </Pressable>
        </View>
      </View>
      <View style={{ marginTop: '85%', alignItems: 'center', marginBottom: 19, }}>
        <Sepline width={Globals.globalDimensions.width} height={1} preserveAspectRatio="none" />
      </View>
      <View style={{marginTop: 50,}}>
        <ProfileButtons />
      </View>
    </View>
  );
}

const profilestyles = StyleSheet.create({
  fpfpP: {
    width: 55,
    alignItems: 'center',
    marginTop: 'auto',
  },
  grays: {
    color: GlobalStyles.colorSet.secondary6,
    fontSize: 12,
  },
  firstsection: {
    flex: 1, 
    position: 'absolute',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    height: 'auto',
  },
  fpfp: {
    width: '100%',
    flex: 1,
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
    left: 3,
  },
  profilebio: {
    color: GlobalStyles.colorSet.secondary6,
    textAlign: 'center',
    width: '.701333333333333%',
  },
  profilebuttons: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 2.13333333,
    width: 100,
    marginTop: 28,
  },
  buttons: {
    borderRadius: 15,
    color: '#FFFFFF',
    fontFamily: "Gilroy",
  },
  followtext: {
    color: 'white',
    fontFamily: GlobalStyles.fontSet.fontsemibold,
    fontSize: 20,
    paddingBottom: 4
  }
})
