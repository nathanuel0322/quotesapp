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
- `src/GlobalValues.js`, `GlobalFunctions.js`, `GlobalStyles.js` — shared mutable globals, helpers, and styles.
- `.env` (gitignored) is read through `react-native-dotenv` (see `babel.config.js`).

## Conventions

- Users are identified by **username** throughout the app, not uid (only the logged-in user can access their uid).
- Home is a Stack navigator (profiles are reachable from it); the logged-in user's profile and other users' profiles are separate components (`Profile.jsx` vs `OtherProfile.jsx`).
- Liking uses a hybrid of local state and Firestore for responsiveness.
- Theme colors come from `ThemeContext`; avoid hardcoding colors in new components.

## Dependencies

- `package.json` `overrides` pin transitive packages (`tar`, `braces`, Babel peers) to patched versions for Dependabot security alerts. After changing them, run `npm install --package-lock-only` and confirm the resolved versions in `package-lock.json`.
- Stay on Expo SDK 49-compatible versions; use `npx expo install <pkg>` for Expo/React Native native modules.
