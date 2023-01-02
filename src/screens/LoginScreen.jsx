import React, {useContext, useState} from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet, Alert} from 'react-native';
import FormInput from '../components/global/FormInput';
import FormButton from '../components/global/FormButton';
import { AuthContext } from '../components/global/AuthProvider';
import GlobalStyles from '../GlobalStyles';
import { sendPasswordResetEmail  } from 'firebase/auth';
import { auth } from '../../firebase';


const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const alertshown = false;

  const {login} = useContext(AuthContext);

  return (
    
    <View style={styles.container}>
      <Text style={styles.titletext}>Motivation App</Text>

      <View style={styles.inputView}>
        <FormInput
          labelValue={email}
          onChangeText={(userEmail) => setEmail(userEmail)}
          placeholderText="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>
      <View style={styles.inputView}>
        <FormInput
          labelValue={password}
          onChangeText={(userPassword) => setPassword(userPassword)}
          placeholderText="Password"
          secureTextEntry={true}
        />
      </View>
      <FormButton
        buttonTitle="Sign In"
        onPress={() => login(email, password)}
      />

      <TouchableOpacity style={styles.forgotButton} onPress={
        async() => await sendPasswordResetEmail(auth, email)
        .then(() => {
          if (email.includes('@') && email.includes('.com')) {
            Alert.alert("Your password reset has been sent to your email", '', [
              { text: 'OK', onPress: () => console.log('Your password reset has been sent to your email')},
            ])
          }
          else{
            Alert.alert("Please enter a valid email.", '', [
              { text: 'OK', onPress: () => console.log('Invalid email')},
            ])
          }
        })
        .catch(e => {
          if (e.code === 'auth/invalid-email'){
            Alert.alert("Please enter a valid email.", '', [
              { text: 'OK', onPress: () => console.log('Invalid email')},
            ])
          }
        })
      }>
        <Text style={styles.navButtonText}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.forgotButton}
        onPress={() => navigation.navigate('Signup')}>
        <Text style={[styles.navButtonText, {color: GlobalStyles.colorSet.accent1}]}>
          Don't have an account? Create here
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0B14",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    marginBottom: 40,
  },
  titletext: {
    fontSize: 50,
    fontFamily: 'Gilroy',
    color: 'white',
    marginBottom: '10%',
  },

  inputView: {
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
    width: "70%",
    height: 45,
    marginBottom: 20,
    alignItems: "center",
  },

  text: {
    fontFamily: 'Gilroy',
    fontSize: 28,
    marginBottom: 10,
    color: '#051d5f',
  },
  navButton: {
    marginTop: 15,
  },
  forgotButton: {
    marginTop: 30,
  },
  navButtonText: {
    fontSize: 18,
    fontWeight: '500',
    color: 'white',
    fontFamily: 'Gilroy',
  },
});