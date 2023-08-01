import React, { useState } from 'react';
import { View, Text, Button, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const emotions = ['Happy', 'Sad', 'Angry', 'Surprised', 'Neutral'];

const ImagePickerScreen = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedEmotion, setSelectedEmotion] = useState(null);

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
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }}>
      {selectedImage ? (
        <Image source={{ uri: selectedImage }} style={styles.image} />
      ) : (
        <TouchableOpacity onPress={pickImage}>
          <Text style={styles.textstyles}>Select a Photo</Text>
        </TouchableOpacity>
      )}

      <View style={styles.emotionContainer}>
        <Text style={[styles.emotionLabel, styles.textstyles]}>
          Select Emotion:
        </Text>
        {emotions.map((emotion) => (
          <TouchableOpacity
            key={emotion}
            style={[
              styles.emotionButton,
              selectedEmotion === emotion && styles.selectedEmotion,
            ]}
            onPress={() => handleEmotionSelection(emotion)}
          >
            <Text>{emotion}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {selectedImage && selectedEmotion && (
        <Button
          title="Store Selection"
          onPress={() => {
            // You can store the selected image URI and emotion in your state management system or save to a database here.
            console.log('Selected Image:', selectedImage);
            console.log('Selected Emotion:', selectedEmotion);
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
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'cover',
    marginBottom: 20,
  },
  emotionContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emotionLabel: {
    marginRight: 10,
  },
  emotionButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    marginHorizontal: 5,
  },
  selectedEmotion: {
    backgroundColor: '#007BFF',
  },
  textstyles: {
    color: 'white'
  }
});

export default ImagePickerScreen;
