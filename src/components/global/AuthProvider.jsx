import React, {createContext, useState} from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import {auth, db, storage} from '../../../firebase';
import ToastManager, { Toast } from 'toastify-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, doc, getDoc, getDocs, query, runTransaction, setDoc, where } from 'firebase/firestore';
import { ref, getDownloadURL, uploadBytes, deleteObject } from 'firebase/storage';
import { useTheme } from './ThemeContext';

export const AuthContext = createContext();

const USERNAME_TAKEN = 'username-taken';

// The username is the users/ document ID, so a rename moves that document and
// rewrites the username stored on the user's quotes, all in one transaction.
async function moveUserData(uid, fromName, toName) {
  const quotes = await getDocs(query(collection(db, 'quotes'), where('uid', '==', uid)));
  await runTransaction(db, async (tx) => {
    const target = await tx.get(doc(db, 'users', toName));
    if (target.exists()) {
      throw new Error(USERNAME_TAKEN);
    }
    const source = await tx.get(doc(db, 'users', fromName));
    tx.set(target.ref, source.exists() ? source.data() : { following: [], followers: [], likedquotes: [] });
    if (source.exists()) {
      tx.delete(source.ref);
    }
    quotes.forEach((quote) => tx.update(quote.ref, { username: toName }));
  });
}

// Profile pictures are stored under the username too. Storage can't rename,
// so copy the file to the new path and delete the old one.
async function moveProfilePicture(fromName, toName) {
  const oldRef = ref(storage, `profilepictures/${fromName}`);
  let oldUrl;
  try {
    oldUrl = await getDownloadURL(oldRef);
  } catch (e) {
    if (e.code === 'storage/object-not-found') {
      return;
    }
    throw e;
  }
  const blob = await (await fetch(oldUrl)).blob();
  const newRef = ref(storage, `profilepictures/${toName}`);
  await uploadBytes(newRef, blob);
  await updateProfile(auth.currentUser, { photoURL: await getDownloadURL(newRef) });
  await deleteObject(oldRef);
}

const isValidUsername = (name) => name.length > 0 && !name.includes('/');

export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const { isDarkMode } = useTheme();
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
          if (!isValidUsername(username)) {
            Toast.error('Please enter a valid username!');
            return;
          }
          // users/{username} would otherwise overwrite an existing user's document
          const existing = await getDoc(doc(db, 'users', username)).catch(() => null);
          if (existing?.exists()) {
            Toast.error('That username is already taken!');
            return;
          }
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
        changeUsername: async (newName) => {
          const user = auth.currentUser;
          const oldName = user.displayName;
          const name = newName.trim();
          if (!isValidUsername(name)) {
            Toast.error('Please enter a valid username!');
            return false;
          }
          if (name === oldName) {
            return true;
          }
          try {
            await moveUserData(user.uid, oldName, name);
          } catch (e) {
            if (e.message === USERNAME_TAKEN) {
              Toast.error('That username is already taken!');
            } else {
              console.error(e);
              Toast.error('Could not change your username.');
            }
            return false;
          }
          try {
            await updateProfile(user, { displayName: name });
          } catch (e) {
            console.error(e);
            // put the documents back so they still match the unchanged displayName
            await moveUserData(user.uid, name, oldName).catch(console.error);
            Toast.error('Could not change your username.');
            return false;
          }
          try {
            await moveProfilePicture(oldName, name);
          } catch (e) {
            console.error(e);
            Toast.error('Username changed, but your profile picture could not be moved.');
            return true;
          }
          Toast.success('Username changed!');
          return true;
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
      <ToastManager width={300} theme={isDarkMode ? "dark" : "light"} />
      {children}
    </AuthContext.Provider>
  );
};