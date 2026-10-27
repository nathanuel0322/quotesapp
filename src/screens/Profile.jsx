import React, {useContext, useState, useMemo, useRef, useCallback, useEffect} from 'react';
import {Text, Image, View, TouchableOpacity, StyleSheet, Pressable, ActivityIndicator} from 'react-native';
import GlobalStyles from '../GlobalStyles';
import Globals from '../GlobalValues';
import { BlurView } from 'expo-blur';
import * as ImagePicker from 'expo-image-picker';
import {ref, uploadBytes, getDownloadURL, getMetadata} from "firebase/storage";
import { auth, db, storage } from '../../firebase';
import ProfileButtons from '../components/profile/ProfileButtons';

import Sepline from '../assets/icons/sepline.svg';
import { useTheme } from '../components/global/ThemeContext';
import { doc, getDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { Toast } from 'toastify-react-native';
import { useFocusEffect } from '@react-navigation/native';

export default function Profile({ navigation }) {
  const [uploading, setUploading] = useState(null);
  const [image, setImage] = useState(null); 
  const [follow, setFollow] = useState({})
  const [picexists, setPicExists] = useState(null)
  const pfpRef = ref(storage, `profilepictures/${auth.currentUser.displayName}`)
  const { colors } = useTheme();
  
  // reload on focus so a username or picture changed in Settings shows up here
  useFocusEffect(useCallback(() => {
    async function followcheck() {
      await getDoc(doc(db, 'users', auth.currentUser.displayName))
        .then((val) => {
          if (!val.exists()) return
          setFollow({ followers: val.data().followers, following: val.data().following, likedquotes: val.data().likedquotes, bio: val.data().bio })
        })
        .catch((e) => console.log("Loading profile failed:", e))
    }
    followcheck()
    picchecker()
  }, []))

  async function picchecker() {
    // read the name at call time; the focus callback above outlives renames
    await getDownloadURL(ref(storage, `profilepictures/${auth.currentUser.displayName}`))
      .then((link) => {
        setPicExists(true)
        setImage(link);
      })
      .catch(() => setPicExists(false))
  }

  async function pickImage() {
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
    });
    if (pickerResult.canceled) {
      return
    }
    try {
      setUploading(true);
      const uploadUrl = await uploadImageAsync(pickerResult.assets[0].uri);
      setImage(uploadUrl);
      setPicExists(true)
      Toast.success('Successfully uploaded!')
    } catch (e) {
      console.log(e);
      Toast.error("Upload failed, try again")
    } finally {
      setUploading(false);
    }
  }

  const uploadImageAsync = async (uri) => {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = () => {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });
  
    await uploadBytes(pfpRef, blob)
    
    blob.close();
    const profilepicurl = await getDownloadURL(pfpRef)

    // assign photo to profile for easy access later on
    await updateProfile(auth.currentUser, { photoURL: profilepicurl })

    return profilepicurl;
  }

  return (
    <View style={{width: Globals.globalDimensions.width,flexDirection: 'column',flex: 1, backgroundColor: colors.background}}>
      <View style={{top: 22, flexDirection: 'row', position: 'absolute', }}>
        <View style={{ overflow: 'hidden', height: 45, borderRadius: 15, zIndex: 999,left: 15,}}>
          <BlurView intensity={13} tint={colors.blurTint}> 
            <View style={{ backgroundColor: colors.glass, borderRadius: 15, padding: 11, height: 45, zIndex: 999, }}>
              <Text style={{ color: colors.text, fontFamily: GlobalStyles.fontSet.fontsemibold, top: 3,}}>
                {auth.currentUser.displayName}
              </Text> 
            </View>
          </BlurView>
        </View>
      </View>
      <View style={[profilestyles.firstsection,{marginTop: Globals.globalDimensions.height * .075,}]}>
        <View style={[profilestyles.fpfp, {top: Globals.globalDimensions.height < 900 && Globals.globalDimensions.height * .0407608696,}]}>
          <View style={[profilestyles.fpfpP, { top: -10, width: Globals.globalDimensions.width * .136, }]}>
            <Text style={[profilestyles.followtext, { color: colors.text }]}>
              {follow.followers?.length}
            </Text>
            <Text style={{ color: colors.textSecondary, fontSize: 13, fontFamily: GlobalStyles.fontSet.font, }}>
              Followers
            </Text>
          </View>
          <Pressable style={[profilestyles.fpfpP, { paddingHorizontal: 75, width: Globals.globalDimensions.width * .136, borderRadius: 36, 
            overflow: 'hidden'
          }]}
            onPress={() => pickImage()}
          >
            {uploading ?
              <View style={{ width: Globals.globalDimensions.width * .266666667, height: Globals.globalDimensions.width * .266666667,
                alignItems: 'center', justifyContent: 'center' }}
              >
                <ActivityIndicator color={colors.text} animating size="large" />
              </View>
            : picexists ?
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
            <Text style={[profilestyles.followtext, { color: colors.text }]}>
              {follow.following?.length}
            </Text>
            <Text style={[profilestyles.grays, {color: colors.textSecondary, fontFamily: GlobalStyles.fontSet.font,fontSize: 13,}]}>
              Following
            </Text>
          </View>
        </View>
        <View 
          style={{marginTop: Globals.globalDimensions.height < 900 ? Globals.globalDimensions.height * .06 : 
            Globals.globalDimensions.height * .0172786177,}}
        >
          <Text style={{  color: colors.text,   fontSize: 20,  fontFamily: GlobalStyles.fontSet.fontsemibold,}}>
            {auth.currentUser.displayName}
          </Text>
        </View>
        {!!follow.bio &&
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
            <Text style={{color: colors.text, fontFamily: GlobalStyles.fontSet.font, textAlign: 'center', fontSize: 15,}}>
              {follow.bio}
            </Text>
          </View>
        }
      </View>
      <View style={{ marginTop: '70%', alignItems: 'center', marginBottom: 19, }}>
        <Sepline width={Globals.globalDimensions.width} height={1} preserveAspectRatio="none" color={colors.text} />
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
    fontFamily: "Gilroy",
  },

  followtext: {
    fontFamily: GlobalStyles.fontSet.fontsemibold,
    fontSize: 20,
    paddingBottom: 4
  }
})
