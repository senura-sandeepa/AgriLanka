# Running Database Locally

1. Install MySQL
2. Create database:
   CREATE DATABASE agrilanka_db;
3. Run schema:
   mysql -u root -p agrilanka_db < db/schema.sql
4. Run seed (optional):
   mysql -u root -p agrilanka_db < db/seed.sql

# Agrilanka — Quick Start ⚡

Short guide to get the project running locally on Windows.

---

## Prerequisites ✅
- Node.js LTS (recommended **Node 18+**)
- npm (or Yarn)
- For Android testing: Android Studio + Android SDK + AVD (emulator) or physical device
- Optional: Expo account and `eas-cli` for native builds

## Install & Run ▶️
1. Install dependencies:
   - npm: `npm install`
   - or yarn: `yarn`

2. Start the Expo dev server:
   - `npm start` or `npx expo start`

3. Run on Android (emulator or connected device):
   - `npm run android`

4. Run in browser:
   - `npm run web`

## Helpful commands 🔧
- `npx expo doctor` — diagnose environment & config issues
- If `expo` command not found, use `npx expo start` or install CLI: `npm install -g expo-cli`

## Notes & Recommendations ⚠️
- `app.json` contains `"newArchEnabled": true`. If you do not plan to use the new RN architecture or native custom modules, consider setting it to `false` to simplify local development (avoids needing custom dev clients / EAS builds).
- If you prefer, I can add an `engines` field to `package.json` (e.g., to recommend Node version) and create a short CONTRIBUTING or DEV guide.

---

If you'd like, I can make the config change to disable `newArchEnabled` for easier local dev, or add a `CONTRIBUTING.md` with more detailed steps. Send me what you'd prefer next.

---

## Project structure created 📁
I added a `src/` folder with navigation, screens, components, context, services, utils, and sample data, plus `babel.config.js` and `metro.config.js`.

### Next steps I can do for you:
- Install and configure React Navigation and test the tab/stack flows (recommended)
- Flesh out screens and components with real UI and business logic
- Add unit tests and linting configuration

To install React Navigation (recommended):

1. Install core packages & dependencies:
   - `npx expo install react-native-screens react-native-safe-area-context`
   - `npm install @react-navigation/native @react-navigation/bottom-tabs`

2. Start the app and verify navigation:
   - `npm start`
   - `npm run android` or `npm run ios` or open in browser

Let me know which of the next steps you'd like me to take.