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
import DeezerIcon from '../assets/icons/Deezer_Logo_RVB_White.svg'
import Song from '../components/create/Song';

const emotions = ["Alone", "Angry", "Anniversary", "Attitude", "Awesome", "Awkward Moment", "Beard", "Beautiful", "Best", "Bike", "Birthday", "Break Up", "Brother", "Busy"] 

export default function Create({ navigation }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [selectedSong, setSelectedSong] = useState('');
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

  const blurhash = '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

  useEffect(() => {
    if (queryreq.length > 0) {
      setSongLoading(true)
      fetch(`https://api.deezer.com/search/track?q="${queryreq}"`)
        .then((res) => res.json())
        .then((retdata) => {
          // console.log("retdata:", retdata.data)
          setQueryResults(retdata.data.slice(9))
          setSongLoading(false)
        })
    }
  }, [queryreq])

  async function playSound(link) {
    console.log('Loading Sound');
    const { sound } = await Audio.Sound.createAsync({ uri: link });
    setSound(sound);

    console.log('Playing Sound');
    await sound.playAsync();
  }

  async function stopSound() {
    await sound.stopAsync()
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
    console.log("fromIndex:", fromIndex)
    if (fromIndex === 1) {
      navigation.setOptions({ tabBarStyle: GlobalStyles.showTabBar })
    }
  }, []); // Empty dependency array to ensure stability

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    console.log("result of picked image:", result)

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setShowImageEditor(true)
    }
  };

  const handleEmotionSelection = (emotion) => {
    setSelectedEmotion(emotion);
    console.log('Selected Emotion:', selectedEmotion)
    emotionBSRef.current.close()
  };

  const handleDeselectPhoto = () => {
    setSelectedImage(null);
  };

  const handleSongSelection = (song) => {
    setSelectedSong(song);
    console.log('Selected Song:', selectedSong)
    bottomSheetRef.current.close()
  }

  async function saveQuote() {
    setUploading(true);
    const uploadUrl = await uploadImageAsync(selectedImage);
    await addDoc(collection(db, 'quotes'), {
      selectedEmotion, text, uid: auth.currentUser.uid, imglink: uploadUrl, selectedSong 
    })
    console.log("download url is:", uploadUrl)
    setUploading(false)
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
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={[styles.container]}>
        <View style={styles.imageContainer}>
          {selectedImage ? (
            <View>
              <Image source={{ uri: selectedImage }} style={styles.image} resizeMode="contain" />
              <TouchableOpacity onPress={handleDeselectPhoto} style={[styles.clickable, {backgroundColor: 'red', marginTop: '2%'}]}>
                <Text style={[styles.buttontext, styles.deselectPhotoText]}>Deselect Photo</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity onPress={() => pickImage()} style={styles.clickable}>
              <Text style={[styles.textstyles, styles.buttontext]}>Upload a Photo</Text>
            </TouchableOpacity>
          )}
        </View>

        {showImageEditor &&
          <ImageEditor
            fixedAspectRatio={3 / 4}
            imageUri={selectedImage}
            onEditingCancel={() => {
              console.log("onEditingCancel");
              setShowImageEditor(false)
            }}
            onEditingComplete={(image) => {
              console.log(image);
              setSelectedImage(image.uri)
              setShowImageEditor(false)
            }}
          />
        }

        {/* <View style={styles.emotionContainer}>
          <Text style={[styles.emotionLabel, styles.textstyles]}>
            Select Emotion:
          </Text>
          <View style={styles.emotionview}>
            {emotions.map((emotion, index) => (
              <TouchableOpacity key={emotion}
                style={[styles.emotionButton,
                  // selectedEmotion === emotion && styles.selectedEmotion,
                  {backgroundColor: `hsl(${index * (360 / emotions.length)}, 50%, 60%)`}
                ]}
                onPress={() => handleEmotionSelection(emotion)}
              >
                <Text style={{textAlign: 'center'}}>{emotion}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View> */}

        {/* Emotion button */}
        <TouchableOpacity style={styles.musicbutton} onPress={() => {
          navigation.setOptions({ tabBarStyle: { display: 'none' }})
          emotionBSRef.current.expand()
        }}>
          <MaterialIcons name="emoji-emotions" size={24} color="black" />
          <Text>Choose Emotion</Text>
        </TouchableOpacity>

        {/* Song button */}
        <TouchableOpacity style={styles.musicbutton} onPress={() => {
          navigation.setOptions({ tabBarStyle: { display: 'none' }})
          bottomSheetRef.current.expand()
        }}>
          <Ionicons name="ios-musical-notes" size={24} color="black" />
          <Text>Choose Song</Text>
        </TouchableOpacity>

        {/* Add TextInput for entering text */}
        <TextInput
          style={[styles.textInput, 
            // {marginBottom: '50%'}
          ]}
          value={text}
          onChangeText={setText}
          placeholder="Enter your motivational message here"
          placeholderTextColor="#FFFFFF80"
        />

        <TouchableOpacity style={styles.clickable} onPress={() => saveQuote()} disabled={uploading}>
          <Text style={styles.buttontext}>{uploading ? "Uploading..." : "Create"}</Text>
        </TouchableOpacity>

      </ScrollView>
      <BottomSheet
        ref={emotionBSRef}
        snapPoints={snapPoints}
        onAnimate={handleAnimate}
        handleIndicatorStyle={{ backgroundColor: 'white', width: GlobalValues.globalDimensions.width * .133333333, }}
        backgroundStyle={{ backgroundColor: GlobalStyles.colorSet.neutral11 }}
      >
        <ScrollView contentContainerStyle={{ alignItems: 'center', justifyContent: 'flex-start', paddingTop: 8 }}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', columnGap: 8 }}> 
            {emotions.map((emotion, index) => (
              <TouchableOpacity key={index}
                style={[styles.emotionButton,
                  // selectedEmotion === emotion && styles.selectedEmotion,
                  {backgroundColor: `hsl(${index * (360 / emotions.length)}, 50%, 60%)`}
                ]}
                onPress={() => handleEmotionSelection(emotion)}
              >
                <Text style={{textAlign: 'center'}}>{emotion}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </BottomSheet>

      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        onAnimate={handleAnimate}
        handleIndicatorStyle={{ backgroundColor: 'white', width: GlobalValues.globalDimensions.width * .133333333, }}
        backgroundStyle={{ backgroundColor: GlobalStyles.colorSet.neutral11 }}
      >
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <DeezerIcon width={125} height={50} />
          <SearchBar val={queryreq} setVal={setQueryReq} />
          {songloading ?
            <ActivityIndicator style={{ marginTop: '4%' }} size="large" color="white" />
          :
            queryresults.length > 0 &&
              <ScrollView style={{ width: '100%', marginTop: '3%' }} contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }}>
                {queryresults.map((val, index) => 
                  <Song parentCallback={handleSongSelection} val={val} index={index} playSound={playSound} stopSound={stopSound} />
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
    marginBottom: 20, // Adjusted marginBottom to move the Image higher
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
  selectedEmotion: {
    backgroundColor: '#007BFF',
  },
  textstyles: {
    color: 'white',
  },
  textInput: {
    backgroundColor: '#FFFFFF40',
    color: '#FFFFFF',
    textAlign: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    marginBottom: 10,
    width: '90%',
  },
  deselectPhotoText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center'
  },
  clickable: {
    borderRadius: 12,
    backgroundColor: 'lightblue',
    padding: 8,
  },
  buttontext: {
    color: 'black',
    fontWeight: '700',
    fontSize: 16
  },
  musicbutton: {
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: '5%',
    columnGap: 8
  }
});
