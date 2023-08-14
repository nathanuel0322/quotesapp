import React, {useContext, useState, useMemo, useRef, useCallback, useEffect} from 'react';
import {Text, Image, View, TouchableOpacity, StyleSheet, Pressable, ActivityIndicator} from 'react-native';
import { ProfileButtonGroup } from '../components/profile/ProfileButtonGroup';
import GlobalStyles from '../GlobalStyles';
import Globals from '../GlobalValues';
import { BlurView } from 'expo-blur';
import * as ImagePicker from 'expo-image-picker';
import {ref, getStorage, uploadBytes, getDownloadURL, getMetadata} from "firebase/storage";
import {manipulateAsync} from 'expo-image-manipulator';
import Firebase, { auth, db } from '../../firebase';

import ArrowDown from '../assets/icons/arrow-down.svg'; 
import Sepline from '../assets/icons/sepline.svg';
import GlobalFunctions from '../GlobalFunctions';
import { doc, getDoc } from 'firebase/firestore';

export default function ProfileMain({navigation}) {
  const [following, setFollowing] = useState(false);
  const [uploading, setUploading] = useState(null);
  const [image, setImage] = useState(null); 
  const [follow, setFollow] = useState({})
  
  useEffect(() => {
    async function followcheck() {
      await getDoc(doc(db, 'users', auth.currentUser.uid))
        .then((val) => {
          console.log("data:", val.data())
          setFollow({ followers: val.data().followers, following: val.data().following, likedquotes: val.data().likedquotes })
        })
    }
    followcheck()
  }, [])

  useEffect(() => {
    console.log("follow val now:", follow)
  }, [follow])

  const picchecker = async (folder) => {
    console.log("Pic checker starts");
    let errorcode = null;
    await getMetadata(ref(getStorage(Firebase), `userImages/${folder}/${Globals.currentUserId}`)).catch(e => errorcode = e.code);
    if (errorcode) {
      console.log("Pic doesn't exist");
      istrue = false;
      return;
    }
    else {
      if (image === null) {
        console.log('Pic Exists');
        istrue = true;
        setImage(await getDownloadURL(ref(getStorage(Firebase), `userImages/headers/${Globals.currentUserId}`))); 
        return;
      }
    }
  }
  
  // UNSWITCH WHEN DONE WITH TESTING 

  // picchecker('headers');


  const pickImage = async (folder) => {
    let pickerResult = await ImagePicker.launchImageLibraryAsync({quality: 0});
    console.log({ pickerResult });
    handleImagePicked(pickerResult, folder);
  }

  const handleImagePicked = async (pickerResult, folder) => {
    try {
      setUploading(true);

      if (!pickerResult.cancelled) {
        const width = pickerResult.width;
        const height = pickerResult.height;
        const manipResult = await manipulateAsync(
          pickerResult.uri, 
          [{crop: {width: width, height: height / 5, originX: 0, originY: height / 2}}], 
          {compress: 0}
        );
        console.log(manipResult);
        const uploadUrl = await uploadImageAsync(manipResult.uri, folder);
        setImage(uploadUrl);
      }
    } catch (e) {
      console.log(e);
      alert("Upload failed, sorry :(");
    } finally {
      setUploading(false);
    }
  }

  const uploadImageAsync = async (uri, folder) => {
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
  
    const fileRef = ref(getStorage(Firebase), `userImages/${folder}/${Globals.currentUserId}`);
    const result = await uploadBytes(fileRef, blob);
    
    blob.close();
  
    return await getDownloadURL(fileRef);
  }

  useEffect(() => {
    console.log('useffect ran');
    const unsubscribe = navigation.addListener('focus', () => {
      GlobalFunctions.showNavBar(navigation)
    });
  
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={{width: Globals.globalDimensions.width,flexDirection: 'column',flex: 1,}}>
      <View style={{top: 22, flexDirection: 'row', position: 'absolute', }}>
        <View style={{ overflow: 'hidden', height: 45, borderRadius: 15, zIndex: 999,left: 15,}}>
          <BlurView intensity={13}> 
            <View style={{ fontSize: 14, backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: 15, padding: 11, height: 45, zIndex: 999, }}>
              <Text style={{ color: 'white', fontFamily: GlobalStyles.fontSet.fontsemibold, top: 3,}}>
                {auth.currentUser.displayName}
              </Text> 
            </View>
          </BlurView>
        </View>
      </View>
      <View style={[profilestyles.firstsection,{marginTop: Globals.globalDimensions.height * .075,}]}>
        <View style={[profilestyles.fpfp, {top: Globals.globalDimensions.height < 900 && Globals.globalDimensions.height * .0407608696,}]}>
          <View style={[profilestyles.fpfpP, { top: -10, width: Globals.globalDimensions.width * .136, }]}>
            <Text style={profilestyles.followtext}>
              {follow.followers.length}
            </Text>
            <Text style={{ color: GlobalStyles.colorSet.secondary6, fontSize: 13, fontFamily: GlobalStyles.fontSet.font, }}>
              Followers
            </Text>
          </View>
          <View style={[profilestyles.fpfpP, { paddingHorizontal: 75, width: Globals.globalDimensions.width * .136, borderRadius: 36, 
            overflow: 'hidden'
          }]}>
            <Image
              source={require('../assets/images/blank-profile-picture-973460_640.png')}
              style={{ width: Globals.globalDimensions.width * .266666667, height: Globals.globalDimensions.width * .266666667,
                borderRadius: 16,
              }}
            />
          </View>
          <View style={[profilestyles.fpfpP, { top: -10, width: Globals.globalDimensions.width * .154666667, }]} >
            <Text style={profilestyles.followtext}>
              {follow.following.length}
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
            {auth.currentUser.displayName}
          </Text>
        </View>
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
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam donec sem tristique a.
          </Text>
        </View>
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
            {following ?
              <View
                style={{
                  marginLeft: 8,
                  top: 0.5,
                }}
              >
                <ArrowDown />
              </View>
            : 
              <></>
            }
          </Pressable>
        </View>
      </View>
      <View
        style={{
          marginTop: Globals.globalDimensions.height > 900 ? Globals.globalDimensions.height * .48488121 : Globals.globalDimensions.height * .62,
          alignItems: 'center',
          marginBottom: 19,
        }}
      >
        <Sepline width={Globals.globalDimensions.width} height={1} preserveAspectRatio="none" />
      </View>
      <View style={{marginTop: 50,}}>
        <ProfileButtonGroup />
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

  followbutton: {
    backgroundColor: GlobalStyles.colorSet.primary4,
    left: '21px',
    borderColor: GlobalStyles.colorSet.primary4,
  },
  followtext: {
    color: 'white',
    fontFamily: GlobalStyles.fontSet.fontsemibold,
    fontSize: 20,
    paddingBottom: 4
  }
})
