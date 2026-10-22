# CLAUDE.md

That Push: an Expo (SDK 58) + Firebase app for swiping through motivational quotes. See README.md for features, layout and the data model.

## Commands

- `npm start` / `npm run web`: dev server (Expo Go on device, or browser)
- `npm run lint`: ESLint, should stay at zero findings
- `npm run doctor`: expo-doctor, should pass 20/20
- `npx expo export --platform ios|android|web --output-dir <tmp>`: fastest way to catch bundling/import errors without a device
- Add native packages with `npx expo install <pkg>` (not plain npm) so versions match the SDK

On this Windows machine Node lives at `C:\Program Files\nodejs`. A shell started before Node was installed may need `export PATH="/c/Program Files/nodejs:$PATH"`.

## Conventions

- All Firebase and Deezer calls go through `src/services/*`. Screens never import `firebase/firestore` directly.
- Styling: `useStyles((colors, { fonts }) => StyleSheet.create(...))` from `src/theme/ThemeProvider`. Never hard-code theme colors in screens. The only exceptions are `QuoteCard`/`QuoteGrid`, which always render dark text-on-photo.
- Use `showActionSheet` (src/components/ActionSheet) for menus with more than 2 options, because Android's `Alert` only shows 3 buttons.
- Navigation is React Navigation 7. Tab screens (Home/Create/Profile) are nested in the root stack, so from a stack screen navigate with `navigation.navigate('Tabs', { screen: 'Create' })`.
- Tab screens pad their bottom by `useTabBarSpace()` because the tab bar floats.

## Gotchas

- `users/{uid}` docs are keyed by uid, and `usernames/{name}` reservation docs enforce uniqueness. Renames and signups must go through the transactions in `services/users.js`, or `firestore.rules` will reject them.
- Old accounts used `users/{username}`. `ensureUserDoc` migrates them on first sign-in, so don't remove it while legacy data exists.
- Old quotes lack `createdAt`, `likes` and `trackId`. The feed sorts on the client because `orderBy('createdAt')` would drop them.
- Deezer preview URLs expire. Always play via `resolvePreview(quote)`, never `quote.link` directly. Deezer search doesn't work on web (CORS).
- Any change to client writes must be mirrored in `firestore.rules` / `storage.rules`, then deployed with `firebase deploy --only firestore:rules,storage`. The rules have only been reviewed by hand, not run in the emulator.
- Uploads set `customMetadata.owner`, which storage.rules requires for creates and deletes.
