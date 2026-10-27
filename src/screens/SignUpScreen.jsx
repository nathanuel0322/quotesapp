import React, {useContext, useState} from 'react';
import { View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import FormInput from '../components/global/FormInput';
import FormButton from '../components/global/FormButton';
import { AuthContext } from '../components/global/AuthProvider';
import { useTheme } from '../components/global/ThemeContext';
import Toast from 'toastify-react-native';

const SignupScreen = ({navigation}) => {
  const { colors } = useTheme();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const {register} = useContext(AuthContext);

  return(
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.text, { color: colors.text }]}>Create an Account</Text>
      <FormInput
        labelValue={email}
        onChangeText={(userEmail) => setEmail(userEmail)}
        placeholderText="Email"
        iconType="user"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />
      <FormInput
        labelValue={username}
        onChangeText={setUsername}
        placeholderText="Username"
        iconType="user"
        keyboardType="default"
        autoCapitalize="none"
        autoCorrect={false}
      />
      <FormInput
        labelValue={password}
        onChangeText={setPassword}
        placeholderText="Password"
        iconType="lock"
        secureTextEntry={true}
      />
      <FormInput
        labelValue={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholderText="Confirm Password"
        iconType="lock"
        secureTextEntry={true}
      />
      <FormButton
        buttonTitle="Sign Up"
        onPress={() => {
          if (!username.trim()) {
            Toast.error("Please choose a username!")
          } else if (password !== confirmPassword) {
            Toast.error("Passwords must match!")
          } else {
            register(email.trim(), username.trim(), password)
          }
        }}
      />
      <TouchableOpacity
        style={styles.navButton}
        onPress={() => navigation.navigate('Login')}>
        <Text style={[styles.navButtonText, { color: colors.accentAlt }]}>
          Have an account? Sign In
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  container: {
    marginTop: -75,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontFamily: 'Gilroy',
    fontSize: 28,
    marginBottom: 50,
  },
  navButton: {
    marginTop: 15,
  },
  navButtonText: {
    fontSize: 18,
    fontWeight: '500',
    fontFamily: 'Gilroy',
  },
});