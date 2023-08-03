import React, { useState } from 'react';
import { View, Text, Button, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import SearchBar from '../components/create/SearchBar';

const emotions = ["Alone", "Angry", "Anniversary", "Attitude", "Awesome", "Awkward Moment", "Beard", "Beautiful", "Best", "Bike", "Birthday", "Break Up", "Brother", "Busy"] 

export default function Create() {
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

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <SearchBar />
      {selectedImage ? (
        <Image source={{ uri: selectedImage }} style={styles.image} />
      ) : (
        <TouchableOpacity onPress={pickImage}>
          <Text style={styles.textstyles}>Select a Photo</Text>
        </TouchableOpacity>
      )}
      <View contentContainerStyle={styles.emotionContainer}>
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
              // onPress={() => handleEmotionSelection(emotion)}
            >
              <Text style={{textAlign: 'center'}}>{emotion}</Text>
            </TouchableOpacity>
          ))}
        </View>
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
    alignItems: 'center',
    justifyContent:'center',
    marginTop: '5%'
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'cover',
    marginBottom: 20,
  },
  emotionContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    // marginBottom: 20,
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
    color: 'white'
  },
  emotionview: {
    flex: 1, 
    flexDirection: 'row',
    flexWrap: 'wrap',
    // flexBasis: '50%',
    // columnGap: 10,
    // width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  }
});