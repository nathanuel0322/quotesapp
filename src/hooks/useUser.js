import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import { getUser } from '../services/users';

// Lightweight author lookups for cards and lists, fetched once per session.
const summaries = new Map();

export function useUserSummary(uid) {
  const [user, setUser] = useState(() => (uid && summaries.get(uid)?.value) || null);

  useEffect(() => {
    if (!uid) return undefined;
    let active = true;
    let entry = summaries.get(uid);
    if (!entry) {
      entry = { promise: getUser(uid).catch(() => null) };
      summaries.set(uid, entry);
      entry.promise.then((value) => (entry.value = value));
    }
    entry.promise.then((value) => active && setUser(value));
    return () => {
      active = false;
    };
  }, [uid]);

  return user;
}

// Live profile document, used on profile screens so counts update immediately.
export function useUserDoc(uid) {
  // remember which uid the data belongs to, so switching uid reads as loading again
  const [state, setState] = useState({ uid: null, user: null });

  useEffect(() => {
    if (!uid) return undefined;
    return onSnapshot(
      doc(db, 'users', uid),
      (snap) => {
        const user = snap.exists() ? { id: snap.id, ...snap.data() } : null;
        if (user) summaries.set(uid, { promise: Promise.resolve(user), value: user });
        setState({ uid, user });
      },
      () => setState({ uid, user: null })
    );
  }, [uid]);

  return state.uid === uid ? { user: state.user, loading: false } : { user: null, loading: true };
}
