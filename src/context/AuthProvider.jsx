import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  deleteUser,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { Toast } from 'toastify-react-native';
import { auth, db } from '../../firebase';
import {
  accountDeletion,
  createUserProfile,
  ensureUserDoc,
  isUsernameAvailable,
  normalizeUsername,
  validateUsername,
} from '../services/users';

const AuthContext = createContext(null);

const AUTH_ERRORS = {
  'auth/invalid-email': 'That email address is invalid.',
  'auth/missing-email': 'Enter your email first.',
  'auth/user-not-found': 'No account uses that email.',
  'auth/wrong-password': 'Incorrect password. Please try again.',
  'auth/invalid-credential': 'Email or password is incorrect.',
  'auth/user-disabled': 'This account has been disabled.',
  'auth/email-already-in-use': 'That email address is already in use.',
  'auth/weak-password': 'Please choose a stronger password (6+ characters).',
  'auth/too-many-requests': 'Too many attempts. Try again in a few minutes.',
  'auth/network-request-failed': 'No connection. Check your internet and try again.',
  'auth/requires-recent-login': 'Please sign in again to do that.',
};

export function authErrorMessage(error) {
  return AUTH_ERRORS[error?.code] ?? error?.message ?? 'Something went wrong.';
}

export function AuthProvider({ children }) {
  // undefined while Firebase restores the session, null when signed out
  const [user, setUser] = useState(undefined);
  const [rawProfile, setProfile] = useState(null);
  // ignore a profile left over from a previous session
  const profile = user && rawProfile?.id === user.uid ? rawProfile : null;
  const registering = useRef(false);

  useEffect(() => onAuthStateChanged(auth, (u) => setUser(u ?? null)), []);

  useEffect(() => {
    if (!user) return undefined;
    let ensuring = false;
    return onSnapshot(
      doc(db, 'users', user.uid),
      async (snap) => {
        if (snap.exists()) {
          setProfile({ id: snap.id, ...snap.data() });
          return;
        }
        // brand-new accounts create their doc in register(); everyone else gets migrated
        if (registering.current || ensuring || accountDeletion.inProgress) return;
        ensuring = true;
        try {
          await ensureUserDoc(user);
        } catch (e) {
          console.error('ensureUserDoc failed', e);
          Toast.error('Could not load your profile.');
        }
      },
      (e) => console.error('profile listener', e)
    );
  }, [user]);

  const value = useMemo(
    () => ({
      user,
      profile,
      login: async (email, password) => {
        try {
          await signInWithEmailAndPassword(auth, (email ?? '').trim(), password ?? '');
          return true;
        } catch (e) {
          Toast.error(authErrorMessage(e));
          return false;
        }
      },
      register: async (email, rawUsername, password) => {
        const username = normalizeUsername(rawUsername);
        const invalid = validateUsername(username);
        if (invalid) {
          Toast.error(invalid);
          return false;
        }
        try {
          if (!(await isUsernameAvailable(username))) {
            Toast.error('That username is taken.');
            return false;
          }
        } catch (e) {
          Toast.error(authErrorMessage(e));
          return false;
        }

        registering.current = true;
        let created = null;
        try {
          created = await createUserWithEmailAndPassword(auth, (email ?? '').trim(), password ?? '');
          await updateProfile(created.user, { displayName: username });
          await createUserProfile(created.user, username);
          Toast.success(`Welcome, ${username}!`);
          return true;
        } catch (e) {
          // don't leave behind an auth account with no profile; the user can simply retry
          if (created) await deleteUser(created.user).catch(() => {});
          Toast.error(authErrorMessage(e));
          return false;
        } finally {
          registering.current = false;
        }
      },
      logout: async () => {
        try {
          await signOut(auth);
        } catch {
          Toast.error('Could not sign out.');
        }
      },
      resetPassword: async (email) => {
        try {
          await sendPasswordResetEmail(auth, (email ?? '').trim());
          Toast.success('Password reset email sent.');
        } catch (e) {
          Toast.error(authErrorMessage(e));
        }
      },
    }),
    [user, profile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
