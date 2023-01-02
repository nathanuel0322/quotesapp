import React from 'react';
import {Text, TouchableOpacity, StyleSheet} from 'react-native';
import { windowHeight, windowWidth } from './Dimensions';
import GlobalStyles from '../../GlobalStyles';
import { useFonts, Questrial_400Regular } from '@expo-google-fonts/questrial';

const FormButton = ({buttonTitle, ...rest}) => {
  let [fontsLoaded] = useFonts({
    Questrial_400Regular,
  });

  return (
    <TouchableOpacity style={styles.buttonContainer} {...rest}>
      <Text style={styles.buttonText}>{buttonTitle}</Text>
    </TouchableOpacity>
  );
};

export default FormButton;

const styles = StyleSheet.create({
  buttonContainer: {
    marginTop: 10,
    width: '80%',
    height: windowHeight / 15,
    backgroundColor: GlobalStyles.colorSet.primary4,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: GlobalStyles.colorSet.white,
  },
});