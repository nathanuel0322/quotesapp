import 'react-native-get-random-values';
import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import { View, Text, Button, Image, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert, Pressable, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import  { collection, addDoc } from 'firebase/firestore';
import { db, storage, auth } from '../../firebase';
import { ImageEditor } from 'expo-crop-image';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { v4 as uuidv4 } from "uuid";
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import GlobalValues from '../GlobalValues'
import GlobalStyles from '../GlobalStyles'
import BottomSheet from '@gorhom/bottom-sheet';
import SearchBar from '../components/global/SearchBar';
import DeezerIconWhite from '../assets/icons/Deezer_Logo_RVB_White.svg'
import DeezerIconBlack from '../assets/icons/Deezer_Logo_RVB_Black.svg'
import Song from '../components/create/Song';
import { useTheme } from '../components/global/ThemeContext';

export default function Create({ navigation }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedEmotion, setSelectedEmotion] = useState({});
  const [selectedSong, setSelectedSong] = useState({});
  const [text, setText] = useState('');
  const [showImageEditor, setShowImageEditor] = useState(false)
  const [uploading, setUploading] = useState(false)
  const bottomSheetRef = useRef(BottomSheet);
  const emotionBSRef = useRef(BottomSheet)
  const snapPoints = useMemo(() => [0.1, '80%'], []);
  const [queryreq, setQueryReq] = useState('')
  const [queryresults, setQueryResults] = useState([])
  const [sound, setSound] = useState()
  const [songloading, setSongLoading] = useState(false)
  const { colors, isDarkMode } = useTheme()
  const DeezerIcon = isDarkMode ? DeezerIconWhite : DeezerIconBlack

  useEffect(() => {
    if (queryreq.trim().length === 0) {
      setQueryResults([])
      return
    }
    // ignore responses for queries the user has already typed past
    let stale = false
    setSongLoading(true)
    fetch(`https://api.deezer.com/search/track?q=${encodeURIComponent(queryreq)}`)
      .then((res) => res.json())
      .then((retdata) => {
        if (!stale) setQueryResults((retdata.data ?? []).slice(0, 9))
      })
      .catch((e) => console.log("Song search failed:", e))
      .finally(() => {
        if (!stale) setSongLoading(false)
      })
    return () => { stale = true }
  }, [queryreq])

  async function playSound(link, onPlaybackStatusUpdate) {
    console.log('Loading Sound');
    const { sound, status } = await Audio.Sound.createAsync({ uri: link });
    sound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate)
    setSound(sound);
 
    console.log('Playing Sound');
    await sound.playAsync();
    return status;
  }

  async function stopSound() {
    await sound?.stopAsync().catch(() => {})
  }

  useEffect(() => {
    return sound
      ? () => {
          console.log('Unloading Sound');
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const handleAnimate = useCallback((fromIndex) => {
    if (fromIndex === 1) {
      navigation.setOptions({ tabBarStyle: GlobalStyles.showTabBar(colors) })
    }
  }, [colors]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setShowImageEditor(true)
    }
  };

  const handleEmotionSelection = (emotion) => {
    setSelectedEmotion(emotion);
    emotionBSRef.current.close()
  };

  const handleDeselectPhoto = () => {
    setSelectedImage(null);
  };

  const handleSongSelection = (song) => {
    setSelectedSong(song);
    stopSound()
    bottomSheetRef.current.close()
  }

  async function saveQuote() {
    if (!selectedImage) {
      Alert.alert("Please upload a photo first.")
      return
    }
    if (!text.trim()) {
      Alert.alert("Please enter a message.")
      return
    }
    setUploading(true);
    try {
      const uploadUrl = await uploadImageAsync(selectedImage);
      await addDoc(collection(db, 'quotes'), {
        ...selectedEmotion, text: text.trim(), uid: auth.currentUser.uid, imglink: uploadUrl, ...selectedSong, username: auth.currentUser.displayName
      })
    } catch (e) {
      console.log("Uploading quote failed:", e)
      Alert.alert("Upload failed, please try again.")
      return
    } finally {
      setUploading(false)
    }
    // reset all entries once uploaded
    setSelectedImage(null)
    setSelectedEmotion({})
    setSelectedSong({})
    setText('')
    setQueryReq('')
    Alert.alert("Quote uploaded!")
  }

  async function uploadImageAsync(uri) {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
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
  
    const fileRef = ref(storage, `quotepics/${uuidv4()}`);
    await uploadBytes(fileRef, blob)
      .then(() => {
        console.log("Uploaded image!")
      })
  
    // We're done with the blob, close and release it
    blob.close();
  
    return await getDownloadURL(fileRef);
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={[styles.container]}>
        <View style={styles.imageContainer}>
          {selectedImage ? (
            <View>
              <Image source={{ uri: selectedImage }} style={styles.image} resizeMode="contain" />
              <TouchableOpacity onPress={handleDeselectPhoto} style={[styles.clickable, {backgroundColor: colors.danger, marginTop: '2%'}]}>
                <Text style={[styles.buttontext, styles.deselectPhotoText, { color: colors.onAccent }]}>Deselect Photo</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity onPress={() => pickImage()} style={[styles.clickable, { backgroundColor: colors.accent }]}>
              <Text style={[styles.buttontext, { color: colors.onAccent }]}>Upload a Photo</Text>
            </TouchableOpacity>
          )}
        </View>

        {showImageEditor &&
          <ImageEditor
            fixedAspectRatio={3 / 4}
            imageUri={selectedImage}
            onEditingCancel={() => {
              setShowImageEditor(false)
            }}
            onEditingComplete={(image) => {
              setSelectedImage(image.uri)
              setShowImageEditor(false)
            }}
          />
        }

        {/* Emotion button */}
        <TouchableOpacity style={[styles.musicbutton, 
          { backgroundColor: Object.keys(selectedEmotion).length === 0 ? colors.surface : selectedEmotion.color }]} 
          onPress={() => {
            navigation.setOptions({ tabBarStyle: { display: 'none' }})
            emotionBSRef.current.expand()
          }
        }>
          {Object.keys(selectedEmotion).length === 0 ?
            <View style={{ flexDirection: 'row', alignItems: 'center', columnGap: 8 }}>
              <MaterialIcons name="emoji-emotions" size={24} color={colors.text} />
              <Text style={{ color: colors.text }}>Choose Emotion</Text>
            </View>
          : 
            <View style={{ flexDirection: 'row', alignItems: 'center', columnGap: 8 }}>
              {/* <Text>{selectedEmotion.emoji}</Text> */}
              <Text style={{ color: colors.onPastel }}>{selectedEmotion.phrase}</Text>
            </View>
          }
        </TouchableOpacity>

        {/* Song button */}
        <TouchableOpacity style={[styles.musicbutton, { backgroundColor: colors.surface }]} onPress={() => {
          navigation.setOptions({ tabBarStyle: { display: 'none' }})
          bottomSheetRef.current.expand()
        }}>
          {Object.keys(selectedSong).length === 0 ?
            <View style={{ flexDirection: 'row', columnGap: 8, alignItems: 'center' }}>
              <Ionicons name="ios-musical-notes" size={24} color={colors.text} />
              <Text style={{ color: colors.text }}>Choose Song</Text>
            </View>
          :
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image source={{ uri: selectedSong.pic }} width={50} height={50}  style={{ borderRadius: 6 }} />
              <View style={{ marginLeft: 12, maxWidth: '70%' }}>
                <Text style={{ color: colors.text, fontFamily: GlobalStyles.fontSet.fontsemibold }}>{selectedSong.name}</Text>
                <Text style={{ color: colors.textSecondary, fontFamily: GlobalStyles.fontSet.font }}>{selectedSong.artist}</Text>
              </View>
            </View>
          }
        </TouchableOpacity>

        {/* Add TextInput for entering text */}
        <TextInput
          style={[styles.textInput, { backgroundColor: colors.input, color: colors.inputText }]}
          value={text}
          onChangeText={setText}
          placeholder="Enter your motivational message here"
          placeholderTextColor={colors.placeholder}
          multiline
        />

        <TouchableOpacity style={[styles.clickable, { backgroundColor: colors.accent, opacity: uploading ? 0.6 : 1 }]} onPress={() => saveQuote()} disabled={uploading}>
          <Text style={[styles.buttontext, { color: colors.onAccent }]}>{uploading ? "Uploading..." : "Create"}</Text>
        </TouchableOpacity>

      </ScrollView>
      <BottomSheet
        ref={emotionBSRef}
        snapPoints={snapPoints}
        onAnimate={handleAnimate}
        handleIndicatorStyle={{ backgroundColor: colors.text, width: GlobalValues.globalDimensions.width * .133333333, }}
        backgroundStyle={{ backgroundColor: colors.surface }}
      >
        <ScrollView contentContainerStyle={{ alignItems: 'center', justifyContent: 'flex-start', paddingTop: 8 }}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', columnGap: 8 }}> 
            {GlobalValues.emotions.map((emotion, index) => (
              <TouchableOpacity key={index}
                style={[styles.emotionButton, {backgroundColor: `hsl(${index * (360 / GlobalValues.emotions.length)}, 50%, 60%)`}]}
                onPress={() => handleEmotionSelection({ phrase: emotion, color: `hsl(${index * (360 / GlobalValues.emotions.length)}, 50%, 60%)`})}
              >
                <Text style={{textAlign: 'center', color: colors.onPastel}}>{emotion}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </BottomSheet>

      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        onAnimate={handleAnimate}
        handleIndicatorStyle={{ backgroundColor: colors.text, width: GlobalValues.globalDimensions.width * .133333333, }}
        backgroundStyle={{ backgroundColor: colors.surface }}
      >
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <DeezerIcon width={125} height={50} />
          <SearchBar val={queryreq} setVal={setQueryReq} />
          {songloading ?
            <ActivityIndicator style={{ marginTop: '4%' }} size="large" color={colors.text} />
          :
            queryresults.length > 0 &&
              <ScrollView style={{ width: '100%', marginTop: '3%' }} contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }}>
                {queryresults.map((val, index) => 
                  <Song parentCallback={handleSongSelection} val={val} key={index} playSound={playSound} stopSound={stopSound} />
                )}
              </ScrollView>
          }
        </View>
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent:'center',
    marginTop: '5%',
  },
  imageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    maxHeight: 200,
    marginBottom: 40, // Adjusted marginBottom to move the Image higher
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  emotionContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
   // marginBottom: 30,  Adjusted marginBottom to move the Emotion field higher
    width: '100%',
    maxHeight: 300,
    marginBottom: -10
  },
  emotionLabel: {
    marginRight: 10,
    textAlign: 'center',
  },
  emotionButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    // marginHorizontal: 5,
    width: '40%',
    height: '15%',
    marginVertical: '1%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    textAlign: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    marginBottom: 20,
    width: '90%',
  },
  deselectPhotoText: {
    fontSize: 18,
    textAlign: 'center',
  },
  clickable: {
    borderRadius: 12,
    padding: 8,
  },
  buttontext: {
    fontWeight: '700',
    fontSize: 16
  },
  musicbutton: {
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    marginBottom: '5%',
    columnGap: 8
  }
});
