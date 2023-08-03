import React, { useState, useEffect } from 'react';
import { View, Text, Button, Image, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import SearchBar from '../components/create/SearchBar';
import  { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebase';

const emotions = ["Alone", "Angry", "Anniversary", "Attitude", "Awesome", "Awkward Moment", "Beard", "Beautiful", "Best", "Bike", "Birthday", "Break Up", "Brother", "Busy"] 

export default function Create() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [text, setText] = useState('');

  const handleStoreSelection = async () => {

    await addDoc(collection(db, 'posts'), {text, selectedEmotion});
  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.cancelled) {
      setSelectedImage(result.uri);
    }
  };

  const handleEmotionSelection = (emotion) => {
    setSelectedEmotion(emotion);
    console.log('Selected Emotion:', selectedEmotion)
  };

  const handleDeselectPhoto = () => {
    setSelectedImage(null);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.imageContainer}>
        {selectedImage ? (
          <View>
            <Image source={{ uri: selectedImage }} style={styles.image} resizeMode="contain" />
            <TouchableOpacity onPress={handleDeselectPhoto}>
              <Text style={styles.deselectPhotoText}>Deselect Photo</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity onPress={pickImage}>
            <Text style={styles.textstyles}>Select a Photo</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.emotionContainer}>
        <Text style={[styles.emotionLabel, styles.textstyles]}>
          Select Emotion:
        </Text>
        <View style={styles.emotionview}>
          {emotions.map((emotion) => (
            <TouchableOpacity key={emotion}
              style={[styles.emotionButton,
                // selectedEmotion === emotion && styles.selectedEmotion,
                {backgroundColor: `hsl(${Math.random() * 360}, 50%, 60%)`}
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
        style={styles.textInput}
        value={text}
        onChangeText={setText}
        placeholder="Enter your motivational message here"
        placeholderTextColor="#FFFFFF80"
      />

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
    marginTop: '5%'
  },
  imageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
    justifyContent: 'flex-end',
    marginBottom: 30, // Adjusted marginBottom to move the Emotion field higher
    width: '100%',
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
  },
  textInput: {
    backgroundColor: '#FFFFFF40',
    color: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    marginBottom: '25%',
    width: '90%',
  },
  deselectPhotoText: {
    color: 'red',
    fontSize: 18,
    marginTop: 10,
  },
});
