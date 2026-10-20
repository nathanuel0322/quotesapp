import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  documentId,
  getDoc,
  getDocs,
  increment,
  query,
  serverTimestamp,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import { deleteObject, ref } from 'firebase/storage';
import { randomUUID } from 'expo-crypto';
import { db, storage } from '../../firebase';
import { uploadImage } from './storage';

// quotes/{id}
//   uid, username         author (username is denormalized for display)
//   text, phrase, color   the message and its mood
//   imglink, imagePath    background image
//   trackId, link, pic, artist, name   optional Deezer song (link is a preview url that expires)
//   likes, createdAt

// Every quote we've loaded, so the detail screen can render instantly before refetching.
export const quoteCache = new Map();

const toQuote = (d) => {
  const quote = { id: d.id, ...d.data() };
  quoteCache.set(quote.id, quote);
  return quote;
};

const createdMillis = (q) => q.createdAt?.toMillis?.() ?? 0;
export const newestFirst = (a, b) => createdMillis(b) - createdMillis(a);

// Older posts have no createdAt, and orderBy() would silently drop them, so sort client side.
export async function fetchFeed(profile) {
  const snap = await getDocs(collection(db, 'quotes'));
  const hidden = new Set([...(profile.likedquotes ?? []), ...(profile.passedquotes ?? [])]);
  const blocked = new Set(profile.blocked ?? []);
  return snap.docs
    .map(toQuote)
    .filter((q) => q.uid !== profile.uid && !hidden.has(q.id) && !blocked.has(q.uid) && q.imglink)
    .sort(newestFirst);
}

export async function fetchQuote(id) {
  const snap = await getDoc(doc(db, 'quotes', id));
  return snap.exists() ? toQuote(snap) : null;
}

export async function fetchQuotesByUser(uid) {
  const snap = await getDocs(query(collection(db, 'quotes'), where('uid', '==', uid)));
  return snap.docs.map(toQuote).sort(newestFirst);
}

export async function fetchQuotesByIds(ids) {
  const out = [];
  for (let i = 0; i < ids.length; i += 30) {
    const snap = await getDocs(query(collection(db, 'quotes'), where(documentId(), 'in', ids.slice(i, i + 30))));
    snap.forEach((d) => out.push(toQuote(d)));
  }
  // most recently liked first
  const order = Object.fromEntries(ids.map((id, i) => [id, i]));
  return out.sort((a, b) => order[b.id] - order[a.id]);
}

export async function likeQuote(uid, quoteId) {
  const batch = writeBatch(db);
  batch.update(doc(db, 'users', uid), { likedquotes: arrayUnion(quoteId), passedquotes: arrayRemove(quoteId) });
  batch.update(doc(db, 'quotes', quoteId), { likes: increment(1) });
  await batch.commit();
}

export async function unlikeQuote(uid, quoteId) {
  const batch = writeBatch(db);
  batch.update(doc(db, 'users', uid), { likedquotes: arrayRemove(quoteId) });
  batch.update(doc(db, 'quotes', quoteId), { likes: increment(-1) });
  await batch.commit();
}

export async function passQuote(uid, quoteId) {
  await updateDoc(doc(db, 'users', uid), { passedquotes: arrayUnion(quoteId) });
}

export async function resetPassed(uid) {
  await updateDoc(doc(db, 'users', uid), { passedquotes: [] });
}

export async function createQuote({ user, image, mood, text, song }) {
  const { url, path } = await uploadImage(image.uri, `quotepics/${randomUUID()}`, { owner: user.uid, sourceWidth: image.width });
  const ref = await addDoc(collection(db, 'quotes'), {
    uid: user.uid,
    username: user.displayName,
    text: text.trim(),
    phrase: mood.phrase,
    color: mood.color,
    imglink: url,
    imagePath: path,
    ...(song
      ? { trackId: song.id, link: song.preview, pic: song.album.cover_medium ?? song.album.cover, artist: song.artist.name, name: song.title }
      : {}),
    likes: 0,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function deleteQuote(quote) {
  await deleteDoc(doc(db, 'quotes', quote.id));
  // older posts only have the download url, which ref() also accepts
  const image = quote.imagePath ?? quote.imglink;
  if (image) await deleteObject(ref(storage, image)).catch(() => {});
}

export async function reportQuote(reporterUid, quote, reason) {
  await addDoc(collection(db, 'reports'), {
    reporterUid,
    quoteId: quote.id,
    authorUid: quote.uid,
    reason,
    createdAt: serverTimestamp(),
  });
}
