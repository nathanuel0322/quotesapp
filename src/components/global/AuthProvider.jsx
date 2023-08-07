import React, {createContext, useState} from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import {auth} from '../../../firebase';
import ToastManager, { Toast } from 'toastify-react-native';

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
              Toast.success('That email address is invalid!');
            }
            if (error.code === 'auth/user-not-found') {
              Toast.success('There is no user account linked to this email!');
            }
            if (error.code === 'auth/wrong-password') {
              Toast.success('Incorrect password! Please try again.');
            }
            if (error.code === 'auth/user-disabled') {
              Toast.success('This user is currently disabled.');
            }
            console.error(error);
          });
        },
        register: async (email, username, password) => {
          await createUserWithEmailAndPassword(auth, email, password)
            .then(async(userCredential) => {
              console.log('Account created & signed in!')
              await updateProfile(userCredential.user, { displayName: username })
                .then(() => {
                  Toast.success('Signed in!');
                })
            })
            .catch(error => {
              if (error.code === 'auth/email-already-in-use') {
                Toast.success('That email address is already in use!');
              }
              if (error.code === 'auth/invalid-email') {
                console.log('This email is invalid');
              }
              if (error.code === 'auth/operation-not-allowed') {
                console.error(error);
              }
              if (error.code === 'auth/weak-password') {
                console.log('Please create a stronger password.');
              }
              console.error(error);
            });
        },
        logout: async () => {
          await signOut(auth)
            .then(() => Toast.success('Signed out!'))
            .catch(error => {
              console.error(error);
            });
        },
      }}
    >
      <ToastManager />
      {children}
    </AuthContext.Provider>
  );
};