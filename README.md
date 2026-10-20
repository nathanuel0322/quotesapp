# That Push

Swipe through motivational quotes. Each one is a photo, a message, a mood, and (optionally) a song preview. Swipe right to save it, left to pass, and post your own.

Built with Expo (SDK 58), React Native and Firebase (Auth, Firestore, Storage). Songs come from Deezer's public API.

## Run it

You need Node 20+ and the **Expo Go** app on your phone.

```bash
npm install
npm start
```

Scan the QR code with your camera (iOS) or Expo Go (Android). `npm run web` runs it in a browser too, though song search doesn't work on web because Deezer blocks browser (CORS) requests.

```bash
npm run lint     # ESLint (eslint-config-expo)
npm run doctor   # expo-doctor dependency checks
```

## Firebase setup

The app points at the `motivationapp-9dc3f` project (config in `firebase.js`). In the Firebase console make sure that:

1. **Authentication → Email/Password** is enabled.
2. **Firestore** and **Storage** are created.
3. The security rules in this repo are deployed. Until they are, whatever rules the project already has stay in effect.

```bash
npm install -g firebase-tools
firebase login
firebase deploy --only firestore:rules,storage
```

## Features

- **Feed**: Tinder-style swipe deck with like/pass buttons, mood filter, auto-playing song previews (mute persists), and tap the author to see their profile.
- **Create**: pick or take a photo (cropped 3:4), write up to 220 characters, choose a mood, optionally search Deezer for a song. Shows a live preview of the card.
- **Profiles**: avatar, bio, follower/following lists, follow/unfollow, a grid of posts, a grid of liked quotes (your own profile), and a mood filter.
- **Quote detail**: like/unlike, share, delete your own, report or block others.
- **People search** by username.
- **Settings**: light/dark/system appearance, edit profile (username and bio), change password, blocked accounts, reset passed quotes, log out, delete account.

## Project layout

```
App.js                    fonts, providers, root navigator
firebase.js               Firebase init (RN auth persistence)
firestore.rules           Firestore security rules
storage.rules             Storage security rules
src/
  navigation/             root stack + floating tab bar
  screens/                one file per screen
  components/             QuoteCard, SwipeDeck, QuoteGrid, Sheet, ActionSheet, ui kit
  services/               all Firebase and Deezer calls (users, quotes, storage, deezer)
  context/AuthProvider    auth state + the live profile doc
  hooks/                  user lookups, audio players, tab bar spacing
  theme/                  light/dark palettes, fonts, useStyles()
  constants/moods.js      the list of moods
```

## Data model

| Collection | Doc id | Fields |
| --- | --- | --- |
| `users` | uid | `username`, `bio`, `photoURL`, `followers[]`, `following[]` (uids), `likedquotes[]`, `passedquotes[]`, `blocked[]` |
| `usernames` | username | `uid` (keeps usernames unique) |
| `quotes` | auto | `uid`, `username`, `text`, `phrase` (mood), `color`, `imglink`, `imagePath`, `trackId`, `link`, `pic`, `artist`, `name`, `likes`, `createdAt` |
| `reports` | auto | `reporterUid`, `quoteId`, `authorUid`, `reason`, `createdAt` |

Older accounts stored their profile at `users/{username}`. The first time one of them signs in, it is copied to `users/{uid}` automatically (see `ensureUserDoc` in `src/services/users.js`).

Deezer preview URLs expire, so new posts store `trackId` and the app fetches a fresh preview URL right before playing. Older posts without a track ID are looked up again by song name and artist.

## Before shipping to the stores

- Change `ios.bundleIdentifier` / `android.package` in `app.json` (currently `com.thatpush.app`).
- Set up an EAS project (`npx eas init`) and build with `npx eas build`.
- Have a way to review documents in the `reports` collection. Apple requires that you act on reports for apps with user-generated content.
- The feed loads every quote and sorts it on the device. That's fine for hundreds of posts. Past that, add `createdAt` to old posts and switch to a paginated `orderBy('createdAt')` query.
