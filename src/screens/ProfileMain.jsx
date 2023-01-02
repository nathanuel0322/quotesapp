import React, {useContext, useState, useMemo, useRef, useCallback, useEffect} from 'react';
import { Entypo } from '@expo/vector-icons';
import {Text, Image, View, TouchableOpacity, StyleSheet, Pressable, ActivityIndicator} from 'react-native';
import { ProfileButtonGroup } from '../components/profile/ProfileButtonGroup';
import { AuthContext } from '../components/global/AuthProvider';
import GlobalStyles from '../GlobalStyles';
import Globals from '../GlobalValues';
import { BlurView } from 'expo-blur';
import * as ImagePicker from 'expo-image-picker';
import {ref, getStorage, uploadBytes, getDownloadURL, getMetadata} from "firebase/storage";
import {manipulateAsync} from 'expo-image-manipulator';
import BottomSheet from '@gorhom/bottom-sheet';
import Firebase from '../../firebase';

import ProfilePicIcon from '../assets/images/profilepic.svg';
import ArrowDown from '../assets/icons/arrow-down.svg'; 
import Sepline from '../assets/icons/sepline.svg';
import UploadIcon from '../assets/icons/uploadicon.svg';
import SettingsIcon from '../assets/icons/settingsicon.svg';
import SwitchIcon from '../assets/icons/switchicon.svg';
import LogoutIcon from '../assets/icons/logouticon.svg';
import GlobalFunctions from '../GlobalFunctions';

export default function ProfileMain({navigation}) {
  const {logout} = useContext(AuthContext);
  const [following, setFollowing] = useState(false);
  const [uploading, setUploading] = useState(null);
  const [image, setImage] = useState(null); 
  let istrue = null;

  const bottomSheetRef = useRef(BottomSheet);
  const snapPoints = useMemo(() => [0.1, '25%'], []);

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
      <View style={{top: 0,flex: 1,flexDirection: 'row',position: 'absolute',width: '100%',}}>
        <View style={{overflow: 'hidden',height: 45,top: 40,borderRadius: 15,zIndex: 999,left: 15,}}>
          <BlurView intensity={13} style={{}}> 
            <View 
                style={{
                  fontSize: 14,
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: 15,
                  padding: 11,
                  height: 45,
                  zIndex: 999,
                }}
              >
                <Text style={{
                  color: 'white', 
                  fontFamily: GlobalStyles.fontSet.fontsemibold, 
                  top: 3,
                }}>
                  Rezanmdesign
                </Text> 
              </View>
          </BlurView>
        </View>

        <View style={{width: 45,overflow: 'hidden',zIndex: 999,borderRadius: 17, left: Globals.globalDimensions.width * .537383178,top: 40,}}>
          <BlurView intensity={13}>
            <TouchableOpacity style={{backgroundColor: 'rgba(255, 255, 255, 0.1)', padding: 13,}}
              onPress={() => 
                {
                  GlobalFunctions.hideNavBar(navigation);
                  bottomSheetRef.current.expand();
                }
              }
            >        
              <Entypo name="dots-three-vertical" size={20} color={'black'} />
            </TouchableOpacity>
          </BlurView>
        </View>
        <Pressable
          style={{position: 'absolute', top: 0, height: 165, width: '100%', zIndex: 1, backgroundColor: GlobalStyles.colorSet.neutral11, left: 0, }}
          onPress={() => {pickImage('headers'), console.log('Image pressed')}}
        >
          {istrue ?
            <Image
              style={[profilestyles.bckgrndimg,
                {
                  height: 165,
                }
              ]}
              source={{ uri: image }}
            />
          :
            uploading ?
              <ActivityIndicator color="#fff" animating size="large" />
            :
              image ?
                <Image
                  style={[profilestyles.bckgrndimg,
                    {
                      height: 165,
                    }
                  ]}
                  source={{ uri: image }}
                />
              :
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%', 
                        backgroundColor: GlobalStyles.colorSet.neutral11}}
                >
                  <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', top: 15,}}>
                    <UploadIcon />
                    <Text style={{marginLeft: 8, color: 'white', fontFamily: GlobalStyles.fontSet.font, fontSize: 20,}}>
                      Upload your header
                    </Text>
                  </View>
                  
                </View>
          }
        </Pressable>
        
      </View>
      <View 
        style={[profilestyles.firstsection,{marginTop: Globals.globalDimensions.height * .14,
          marginBottom: Globals.globalDimensions.height * .0182857143,}]}
      >
        <View style={[profilestyles.fpfp, {top: Globals.globalDimensions.height < 900 && Globals.globalDimensions.height * .0407608696,}]}>
          <View 
            style={[
              profilestyles.fpfpP, 
              {
                top: -10,
                width: Globals.globalDimensions.width * .136,
              }
              ]}
            >
            <Text style={{
                color: 'white', 
                fontFamily: GlobalStyles.fontSet.fontsemibold,
                fontSize: 20,
                paddingBottom: 4, 
              }}
            >
              89.4k
            </Text>
            <Text 
              style={{
                color: GlobalStyles.colorSet.secondary6,
                fontSize: 13,
                fontFamily: GlobalStyles.fontSet.font,
              }}
            >
              Followers
            </Text>
          </View>
          <View 
            style={[
              profilestyles.fpfpP,
              { 
                paddingHorizontal: 75,
                width: Globals.globalDimensions.width * .136,
              }
            ]} 
            class="column"
          >
            <ProfilePicIcon 
              width={Globals.globalDimensions.width * .266666667}
              height={Globals.globalDimensions.width * .266666667}
            />
          </View>
          <View 
            style={[profilestyles.fpfpP, {
              top: -10,
              width: Globals.globalDimensions.width * .154666667,
            }]} 
          >
            <Text 
              style={{
                color: 'white', 
                fontFamily: GlobalStyles.fontSet.fontsemibold, 
                fontSize: 20, 
                paddingBottom: 4, 
              }}
            >
              100
            </Text>
            <Text 
              style={[
                profilestyles.grays, 
                {
                  fontFamily: GlobalStyles.fontSet.font,
                  fontSize: 13,
                }
              ]}
            >
              Following
            </Text>
          </View>
        </View>

        <View 
          style={{marginTop: Globals.globalDimensions.height < 900 ? Globals.globalDimensions.height * .06 : 
            Globals.globalDimensions.height * .0172786177,}}
        >
          <Text style={{  color: 'white',   fontSize: 20,  fontFamily: GlobalStyles.fontSet.fontsemibold,}}>
            Reza Nezhadmusavi
            <Text style={{color: GlobalStyles.colorSet.secondary6, fontSize: 15,}}
            > | Product Designer</Text>
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
          <Pressable
            style={[
              profilestyles.buttons, 
              {
                backgroundColor: GlobalStyles.colorSet.neutral11,
                justifyContent: 'center',
                marginLeft: 4,
                width: Globals.globalDimensions.width * .434666667,
                height: Globals.globalDimensions.height > 900 ?  Globals.globalDimensions.height * .0492610837 : Globals.globalDimensions.height * .06,
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
              Book
            </Text>
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
      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        onAnimate={useCallback((fromIndex) => {
          if (fromIndex === 1 && navigation.getState().index === 0) {
            navigation.getParent()?.setOptions({tabBarStyle: {display: 'flex',position: 'absolute',bottom: 25,left: 20,right: 20,elevation: 24,backgroundColor: GlobalStyles.colorSet.primary1,borderRadius: 25,height: 70,width: Globals.globalDimensions.width * 0.914666667,shadowOffset: {  width: 0,  height: 12,},shadowOpacity: 0.58,shadowRadius: 16.0,opacity: 1,},})
          }
        })}
        handleIndicatorStyle={{backgroundColor: 'white', width: Globals.globalDimensions.width * .133333333,}}
        backgroundStyle={{backgroundColor: GlobalStyles.colorSet.neutral11}}
      >
        <View style={{flex: 1,alignItems: 'flex-start', marginLeft: 27,}}>
          <Pressable style={profilestyles.bottomsheetpressables} onPress={() => [console.log('Settings pressed'), navigation.navigate('SettingsStack'), 
            bottomSheetRef.current.close(), navigation.getParent()?.setOptions({tabBarStyle: {display: 'none'}})]}
          >
            <SettingsIcon />
            <Text style={profilestyles.bottomsheetpressablestext}>Settings</Text>
          </Pressable>
          <View style={{left: 0, marginLeft: -27,}}>
            <Sepline width={Globals.globalDimensions.width} height={1} preserveAspectRatio="none" />
          </View>
          <Pressable style={profilestyles.bottomsheetpressables}>
            <SwitchIcon />
            <Text style={profilestyles.bottomsheetpressablestext}>Switch Account</Text>
          </Pressable>
          <Pressable style={profilestyles.bottomsheetpressables}>
            <LogoutIcon />
            <Text style={[profilestyles.bottomsheetpressablestext, {color: GlobalStyles.colorSet.red7,}]}>Logout</Text>
          </Pressable>
        </View>
      </BottomSheet>
    </View>
  );
}

const profilestyles = StyleSheet.create({
  body: {
    backgroundColor: GlobalStyles.colorSet.primary1,
    fontStyle: 'normal',
    fontWeight: 600,
    fontSize: 12,
  },
  
  fpfpP: {
    width: 55,
    alignItems: 'center',
    marginTop: 'auto',
  },
  grays: {
    color: GlobalStyles.colorSet.secondary6,
    fontSize: 12,
  },

  bottomsheetpressables: {
    flexDirection: 'row', 
    justifyContent: 'flex-start', 
    alignItems: 'center',
    paddingVertical: 18,
    width: '100%',
  },

  bottomsheetpressablestext: {
    color: 'white', 
    fontFamily: GlobalStyles.fontSet.fontsemibold, 
    fontSize: 16, 
    marginLeft: 13,
  },

  username: {
    fontSize: 14,
    top: '2.463%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 11,
    left: 15,
    height: 45,
    borderWidth: 1,
  },
  
  bckgrndimg: {
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 999,
    height: 375,
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
  
    fpfpP: {
      alignItems: 'center',
      marginTop: 'auto',
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
  
    bookbutton: {
      background: GlobalStyles.colorSet.secondary7,
      borderRadius: 15,
      borderColor: GlobalStyles.colorSet.secondary7,
    },
})
