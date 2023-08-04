import React from 'react';
import {View, TextInput, StyleSheet} from 'react-native';
import GlobalStyles from '../../GlobalStyles';
import Globals from '../../GlobalValues';

const FormInput = ({labelValue, placeholderText, iconType, ...rest}) => {
  return (
    <View style={styles.inputView}>
      <TextInput
        value={labelValue}
        style={[styles.TextInput, {fontFamily: 'Gilroy'}]}
        numberOfLines={1}
        placeholder={placeholderText}
        placeholderTextColor="#666"
        {...rest}
      />
    </View>
  );
};

export default FormInput;

const styles = StyleSheet.create({
  inputView: {
    backgroundColor: GlobalStyles.colorSet.white,
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