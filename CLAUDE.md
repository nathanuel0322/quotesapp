# quotesapp

Expo (SDK 49) / React Native 0.72 social app for sharing quotes ("posts"), with Firebase auth, Firestore and Storage. JavaScript only (no TypeScript, no test suite, no linter configured).

## Commands

```bash
npm install
npm start          # expo start
npm run ios        # expo start --ios
npm run android    # expo start --android
npm run web        # expo start --web
```

## Structure

- `App.js` — loads Gilroy fonts, wraps the app in `ThemeProvider` and `Providers`.
- `firebase.js` — Firebase init; auth persists via AsyncStorage. Exports `Firebase` and `auth`.
- `src/components/global/` — providers and navigation: `index.js` (provider tree), `AuthProvider.jsx`, `Routes.js`, `AuthStack.js`, `bottomNavigation.jsx`, `ThemeContext.jsx` (light/dark), shared form components.
- `src/screens/` — one file per screen (Home, Profile, OtherProfile, Create, Settings and its sub-screens, Login/SignUp).
- `src/components/{home,profile,settings,create}/` — components and stack navigators grouped by feature.
- `src/GlobalValues.js`, `GlobalStyles.js` — shared mutable globals, and styles (fonts, light/dark palettes, tab bar styles; `showTabBar(colors)` is a function of the active palette).
- `.env` (gitignored) is read through `react-native-dotenv` (see `babel.config.js`).

## Conventions

- Users are identified by **username** throughout the app, not uid (only the logged-in user can access their uid). The username is the `users/{username}` doc ID, the `profilepictures/{username}` Storage path, and the `username` field on each `quotes` doc, so it must be unique (`register` checks) and renames must go through `changeUsername` in `AuthProvider.jsx`, which moves all three. Read `auth.currentUser.displayName` at call time rather than capturing it, since it can change mid-session.
- Home is a Stack navigator (profiles are reachable from it); the logged-in user's profile and other users' profiles are separate components (`Profile.jsx` vs `OtherProfile.jsx`).
- Liking uses a hybrid of local state and Firestore for responsiveness.
- Theme colors come from `useTheme().colors` (palettes in `GlobalStyles.themes`); avoid hardcoding colors in new components. The preference (`system`/`light`/`dark`) persists in AsyncStorage under `THEME_PREFERENCE`.
- Single-color SVG icons use `currentColor`, so pass `color={colors.text}` (or another token) wherever they're rendered; without it they draw black.

## Dependencies

- `package.json` `overrides` pin transitive packages (`tar`, `braces`, Babel peers) to patched versions for Dependabot security alerts. After changing them, run `npm install --package-lock-only` and confirm the resolved versions in `package-lock.json`.
- Stay on Expo SDK 49-compatible versions; use `npx expo install <pkg>` for Expo/React Native native modules.
