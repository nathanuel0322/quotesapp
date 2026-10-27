import React from 'react';
import {Text, TouchableOpacity, StyleSheet} from 'react-native';
import { windowHeight, windowWidth } from './Dimensions';
import { useTheme } from './ThemeContext';

const FormButton = ({buttonTitle, ...rest}) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity style={[styles.buttonContainer, { backgroundColor: colors.primary }]} {...rest}>
      <Text style={[styles.buttonText, { color: colors.onAccent }]}>{buttonTitle}</Text>
    </TouchableOpacity>
  );
};

export default FormButton;

const styles = StyleSheet.create({
  buttonContainer: {
    marginTop: 10,
    width: '80%',
    height: windowHeight / 15,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});