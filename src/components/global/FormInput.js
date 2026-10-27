import React from 'react';
import {View, TextInput, StyleSheet} from 'react-native';
import { useTheme } from './ThemeContext';
import Globals from '../../GlobalValues';

const FormInput = ({labelValue, placeholderText, iconType, ...rest}) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.inputView, { backgroundColor: colors.input }]}>
      <TextInput
        value={labelValue}
        style={[styles.TextInput, {fontFamily: 'Gilroy', color: colors.inputText}]}
        numberOfLines={1}
        placeholder={placeholderText}
        placeholderTextColor={colors.placeholder}
        {...rest}
      />
    </View>
  );
};

export default FormInput;

const styles = StyleSheet.create({
  inputView: {
    borderRadius: 30,
    width: Globals.isLoading ? Globals.globalDimensions.width * .7 : 300,
    height: 45,
    marginBottom: 20,
    alignItems: "center",
    justifyContent: 'center',
  },

  TextInput: {
    height: 100,
    flex: 1,
    padding: 10,
    textAlign: 'center',
    width: Globals.isLoading ? Globals.globalDimensions.width * .7 : 300,
    fontSize: 18
  },
});