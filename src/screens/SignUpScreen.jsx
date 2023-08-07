import React, {useContext, useState} from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert} from 'react-native';
import FormInput from '../components/global/FormInput';
import FormButton from '../components/global/FormButton';
import { AuthContext } from '../components/global/AuthProvider';
import GlobalStyles from '../GlobalStyles';
import Toast from 'toastify-react-native';

const SignupScreen = ({navigation}) => {
  const [email, setEmail] = useState();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();

  const {register} = useContext(AuthContext);

  return(
    <View style={styles.container}>
      <Text style={styles.text}>Create an Account</Text>

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
          if (password === confirmPassword) {
            register(email, username, password)
          } else {
            Toast.error("Passwords must match!")
          }
        }}
      />

      <TouchableOpacity
        style={styles.navButton}
        onPress={() => navigation.navigate('Login')}>
        <Text style={styles.navButtonText}>
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
    backgroundColor: GlobalStyles.colorSet.primary1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontFamily: 'Gilroy',
    fontSize: 28,
    marginBottom: 50,
    color: GlobalStyles.colorSet.white,
  },
  navButton: {
    marginTop: 15,
  },
  navButtonText: {
    fontSize: 18,
    fontWeight: '500',
    color: GlobalStyles.colorSet.accent1,
    fontFamily: 'Gilroy',
  },
  textPrivate: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 35,
    justifyContent: 'center',
  },
  color_textPrivate: {
    fontSize: 13,
    fontWeight: '400',
    fontFamily: 'Gilroy',
    color: 'grey',
  },
});