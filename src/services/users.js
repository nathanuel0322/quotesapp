import {
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  documentId,
  getDoc,
  getDocs,
  limit,
  query,
  runTransaction,
  serverTimestamp,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import { deleteUser, updateProfile } from 'firebase/auth';
import { deleteObject, ref } from 'firebase/storage';
import { db, storage } from '../../firebase';
import { uploadImage } from './storage';
import { deleteQuote, fetchQuotesByUser } from './quotes';

// Data model
//   users/{uid}            profile: username, bio, photoURL, followers[], following[] (uids),
//                          likedquotes[], passedquotes[] (quote ids), blocked[] (uids)
//   usernames/{username}   { uid } — reservation doc that keeps usernames unique
//   quotes/{id}            a post (see services/quotes.js)

export const USERNAME_RULES = '3–20 characters: lowercase letters, numbers, _ or .';
const USERNAME_RE = /^[a-z0-9_.]{3,20}$/;

export function normalizeUsername(name) {
  return (name ?? '').trim().toLowerCase();
}

export function validateUsername(name) {
  if (!USERNAME_RE.test(name)) return `Usernames must be ${USERNAME_RULES}.`;
  return null;
}

export async function isUsernameAvailable(name) {
  const snap = await getDoc(doc(db, 'usernames', name));
  return !snap.exists();
}

export async function getUser(uid) {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function getUsers(uids) {
  const out = [];
  for (let i = 0; i < uids.length; i += 30) {
    const chunk = uids.slice(i, i + 30);
    const snap = await getDocs(query(collection(db, 'users'), where(documentId(), 'in', chunk)));
    snap.forEach((d) => out.push({ id: d.id, ...d.data() }));
  }
  // keep the order of the input ids
  const byId = Object.fromEntries(out.map((u) => [u.id, u]));
  return uids.map((id) => byId[id]).filter(Boolean);
}

export async function searchUsers(prefix) {
  const q = normalizeUsername(prefix);
  if (!q) return [];
  const snap = await getDocs(
    query(collection(db, 'usernames'), where(documentId(), '>=', q), where(documentId(), '<=', q + ''), limit(20))
  );
  return getUsers(snap.docs.map((d) => d.data().uid));
}

export async function createUserProfile(user, username, extra = {}) {
  await runTransaction(db, async (tx) => {
    const nameRef = doc(db, 'usernames', username);
    const taken = await tx.get(nameRef);
    if (taken.exists() && taken.data().uid !== user.uid) {
      throw Object.assign(new Error('That username is taken.'), { code: 'username-taken' });
    }
    tx.set(nameRef, { uid: user.uid });
    tx.set(doc(db, 'users', user.uid), {
      uid: user.uid,
      username,
      bio: '',
      photoURL: user.photoURL ?? null,
      followers: [],
      following: [],
      likedquotes: [],
      passedquotes: [],
      blocked: [],
      createdAt: serverTimestamp(),
      ...extra,
    });
  });
}

// Accounts made before the uid-keyed model stored their profile at users/{displayName}.
// Called when a signed-in user has no users/{uid} doc: migrate the old one, or create a fresh one.
export async function ensureUserDoc(user) {
  const existing = await getDoc(doc(db, 'users', user.uid));
  if (existing.exists()) return;

  const legacyName = user.displayName || user.email?.split('@')[0] || 'user';
  let legacy = {};
  try {
    const legacySnap = await getDoc(doc(db, 'users', legacyName));
    if (legacySnap.exists()) legacy = legacySnap.data();
  } catch {
    // unreadable legacy doc; start fresh
  }

  let base = normalizeUsername(legacyName).replace(/[^a-z0-9_.]/g, '_').slice(0, 16);
  if (base.length < 3) base = `${base}user`.slice(0, 16);
  let username = base;
  for (let n = 1; !(await isUsernameAvailable(username)); n++) {
    username = `${base}${n}`;
  }

  await createUserProfile(user, username, {
    bio: legacy.bio ?? '',
    likedquotes: Array.isArray(legacy.likedquotes) ? legacy.likedquotes : [],
  });

  if (user.displayName !== username) {
    await updateProfile(user, { displayName: username });
    await updateQuotesUsername(user.uid, username);
  }
}

async function updateQuotesUsername(uid, username) {
  const snap = await getDocs(query(collection(db, 'quotes'), where('uid', '==', uid)));
  for (let i = 0; i < snap.docs.length; i += 400) {
    const batch = writeBatch(db);
    snap.docs.slice(i, i + 400).forEach((d) => batch.update(d.ref, { username }));
    await batch.commit();
  }
}

export async function renameUser(user, oldName, newName) {
  if (oldName === newName) return;
  await runTransaction(db, async (tx) => {
    const newRef = doc(db, 'usernames', newName);
    const taken = await tx.get(newRef);
    if (taken.exists()) {
      throw Object.assign(new Error('That username is taken.'), { code: 'username-taken' });
    }
    tx.set(newRef, { uid: user.uid });
    tx.delete(doc(db, 'usernames', oldName));
    tx.update(doc(db, 'users', user.uid), { username: newName });
  });
  await updateProfile(user, { displayName: newName });
  await updateQuotesUsername(user.uid, newName);
}

export async function updateBio(uid, bio) {
  await updateDoc(doc(db, 'users', uid), { bio: bio.trim().slice(0, 160) });
}

export async function updateProfilePhoto(user, localUri) {
  const { url } = await uploadImage(localUri, `profilepictures/${user.uid}`, { owner: user.uid, maxWidth: 512 });
  await updateDoc(doc(db, 'users', user.uid), { photoURL: url });
  await updateProfile(user, { photoURL: url });
  return url;
}

export async function follow(myUid, targetUid) {
  const batch = writeBatch(db);
  batch.update(doc(db, 'users', myUid), { following: arrayUnion(targetUid) });
  batch.update(doc(db, 'users', targetUid), { followers: arrayUnion(myUid) });
  await batch.commit();
}

export async function unfollow(myUid, targetUid) {
  const batch = writeBatch(db);
  batch.update(doc(db, 'users', myUid), { following: arrayRemove(targetUid) });
  batch.update(doc(db, 'users', targetUid), { followers: arrayRemove(myUid) });
  await batch.commit();
}

export async function block(myUid, targetUid) {
  const batch = writeBatch(db);
  batch.update(doc(db, 'users', myUid), { blocked: arrayUnion(targetUid), following: arrayRemove(targetUid) });
  batch.update(doc(db, 'users', targetUid), { followers: arrayRemove(myUid) });
  await batch.commit();
}

export async function unblock(myUid, targetUid) {
  await updateDoc(doc(db, 'users', myUid), { blocked: arrayRemove(targetUid) });
}

// Removes everything the user owns, then the auth account itself.
// Reauthenticate first: deleteUser throws auth/requires-recent-login on old sessions.
export const accountDeletion = { inProgress: false };

export async function deleteAccount(user, profile) {
  accountDeletion.inProgress = true;
  try {
    await deleteAccountData(user, profile);
    await deleteUser(user);
  } finally {
    accountDeletion.inProgress = false;
  }
}

async function deleteAccountData(user, profile) {
  const quotes = await fetchQuotesByUser(user.uid);
  for (const q of quotes) await deleteQuote(q);

  const batch = writeBatch(db);
  for (const targetUid of profile.following ?? []) {
    batch.update(doc(db, 'users', targetUid), { followers: arrayRemove(user.uid) });
  }
  await batch.commit().catch(() => {});

  await deleteObject(ref(storage, `profilepictures/${user.uid}`)).catch(() => {});
  await deleteDoc(doc(db, 'usernames', profile.username));
  await deleteDoc(doc(db, 'users', user.uid));
}
