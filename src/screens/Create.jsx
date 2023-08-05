import 'react-native-get-random-values';
import React, { useState } from 'react';
import { View, Text, Button, Image, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import  { collection, addDoc, doc } from 'firebase/firestore';
import { db, storage, auth } from '../../firebase';
import { ImageEditor } from 'expo-crop-image';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { v4 as uuidv4 } from "uuid";

const emotions = ["Alone", "Angry", "Anniversary", "Attitude", "Awesome", "Awkward Moment", "Beard", "Beautiful", "Best", "Bike", "Birthday", "Break Up", "Brother", "Busy"] 

export default function Create() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [text, setText] = useState('');
  const [showImageEditor, setShowImageEditor] = useState(false)
  const [uploading, setUploading] = useState(false)

  const handleStoreSelection = async () => {
    await addDoc(collection(db, 'posts'), {text, selectedEmotion});
  }

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
  };

  const handleDeselectPhoto = () => {
    setSelectedImage(null);
  };

  async function saveQuote() {
    setUploading(true);
    const uploadUrl = await uploadImageAsync(selectedImage);
    await addDoc(collection(db, 'quotes'), {
      selectedEmotion, text, uid: auth.currentUser.uid, imglink: uploadUrl
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

      <View style={styles.emotionContainer}>
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
      </View>

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


      {selectedImage && selectedEmotion && (
        <Button
          title="Store Selection"
          onPress={() => {
            // You can store the selected image URI and emotion in your state management system or save to a database here.
            console.log('Selected Image:', selectedImage);
            console.log('Selected Emotion:', selectedEmotion);
            console.log('Text:', text);

            handleStoreSelection();

            // Optionally, you can navigate to another screen or perform other actions after storing the selection.
          }}
        />
      )}
    </ScrollView>
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
    maxHeight: 300
  },
  emotionLabel: {
    marginRight: 10,
    textAlign: 'center',
  },
  emotionButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    marginHorizontal: 5,
    width: '40%',
    height: '10%',
    marginVertical: '1%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedEmotion: {
    backgroundColor: '#007BFF',
  },
  textstyles: {
    color: 'white',
  },
  emotionview: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    maxHeight: 250
  },
  textInput: {
    backgroundColor: '#FFFFFF40',
    color: '#FFFFFF',
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
  }
});
