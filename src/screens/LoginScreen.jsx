import React, {useContext, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Alert} from 'react-native';
import FormInput from '../components/global/FormInput';
import FormButton from '../components/global/FormButton';
import { AuthContext } from '../components/global/AuthProvider';
import { sendPasswordResetEmail  } from 'firebase/auth';
import { auth } from '../../firebase';
import { useTheme } from '../components/global/ThemeContext';

const LoginScreen = ({navigation}) => {
  const { colors } = useTheme()

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const {login} = useContext(AuthContext);

  async function resetPassword() {
    if (!email.trim()) {
      Alert.alert("Enter your email above, then tap Forgot Password again.")
      return
    }
    try {
      await sendPasswordResetEmail(auth, email.trim())
      Alert.alert("Your password reset has been sent to your email")
    } catch (e) {
      if (e.code === 'auth/invalid-email' || e.code === 'auth/missing-email') {
        Alert.alert("Please enter a valid email.")
      } else if (e.code === 'auth/user-not-found') {
        Alert.alert("There is no account linked to this email.")
      } else {
        console.log(e)
        Alert.alert("Couldn't send the reset email. Please try again.")
      }
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.titletext, { color: colors.text }]}>Motivation App</Text>

      <FormInput
        labelValue={email}
        onChangeText={(userEmail) => setEmail(userEmail)}
        placeholderText="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />
      <FormInput
        labelValue={password}
        onChangeText={(userPassword) => setPassword(userPassword)}
        placeholderText="Password"
        secureTextEntry={true}
      />
      <FormButton
        buttonTitle="Sign In"
        onPress={() => login(email.trim(), password)}
      />

      <TouchableOpacity style={styles.forgotButton} onPress={resetPassword}>
        <Text style={[styles.navButtonText, { color: colors.text }]}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.forgotButton}
        onPress={() => navigation.navigate('Signup')}>
        <Text style={[styles.navButtonText, {color: colors.accentAlt}]}>
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
    alignItems: "center",
    justifyContent: "center",
  },
  titletext: {
    fontSize: 50,
    fontFamily: 'Gilroy',
    marginBottom: '10%',
  },
  forgotButton: {
    marginTop: 30,
  },
  navButtonText: {
    fontSize: 18,
    fontWeight: '500',
    fontFamily: 'Gilroy',
  },
});
