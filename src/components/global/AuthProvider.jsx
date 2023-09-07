import React, {createContext, useState} from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import {auth, db} from '../../../firebase';
import ToastManager, { Toast } from 'toastify-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { addDoc, doc, setDoc } from 'firebase/firestore';
import GlobalStyles from '../../GlobalStyles';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);
  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login: async (email, password) => {
          await signInWithEmailAndPassword(auth, email, password)
          .then(() => {
            Toast.success('Signed in!');
          })
          .catch(error => {
            if (error.code === 'auth/invalid-email') {
              Toast.error('That email address is invalid!');
            }
            if (error.code === 'auth/user-not-found') {
              Toast.error('There is no user account linked to this email!');
            }
            if (error.code === 'auth/wrong-password') {
              Toast.error('Incorrect password! Please try again.');
            }
            if (error.code === 'auth/user-disabled') {
              Toast.error('This user is currently disabled.');
            }
            console.error(error);
          });
        },
        register: async (email, username, password) => {
          await createUserWithEmailAndPassword(auth, email, password)
            .then(async(userCredential) => {
              console.log('Account created & signed in!')
              await updateProfile(userCredential.user, { displayName: username })
                .then(async() => {
                  await AsyncStorage.setItem('displayname', username)
                  await setDoc(doc(db, 'users', username), {
                    following: [],
                    followers: [],
                    likedquotes: []
                  })
                    .then(() => {
                      Toast.success('Signed in!');
                    })
                })
            })
            .catch(error => {
              if (error.code === 'auth/email-already-in-use') {
                Toast.error('That email address is already in use!');
              }
              if (error.code === 'auth/invalid-email') {
                Toast.error('That email address is invalid!');
              }
              if (error.code === 'auth/operation-not-allowed') {
                console.error(error);
                Toast.error('This operation is not allowed!');
              }
              if (error.code === 'auth/weak-password') {
                Toast.error('Please create a stronger password!');
              }
              console.error(error);
            });
        },
        logout: async () => {
          await signOut(auth)
            .then(() => Toast.success('Signed out!'))
            .catch(error => {
              console.error(error);
              Toast.error('An error occurred while signing out.');
            });
        },
      }}
    >
      <ToastManager width={300} theme="dark" />
      {children}
    </AuthContext.Provider>
  );
};