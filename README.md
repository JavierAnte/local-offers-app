# LocalOffers App

Expo/React Native client for LocalOffers. It supports nearby list/map discovery, email/password authentication, offer publishing with photos, comments, validate/invalidate voting, and in-app activity notifications. Product-level documentation lives in the sibling coordination repository's [`docs/`](../docs/) directory.

## Stack

- Expo SDK 57, React Native, React, and TypeScript
- React Navigation
- TanStack Query and Zustand
- React Hook Form and Zod
- NativeWind
- react-native-maps on Android and iOS

## Commands

```bash
npm install
npx expo start --clear

npm run android
npm run ios
npm run web

npx tsc --noEmit
npx expo-doctor
```

There is currently no configured test runner or linter.

The Feed map is available on Android and iOS. Web remains list-only. A current Expo Go Android authorization issue prevents Google tiles from loading there, so Android map testing requires a development build; iOS continues to use native Apple Maps.

Android development and store builds read a restricted Google Maps SDK key from `GOOGLE_MAPS_ANDROID_API_KEY` at build time. Copy `.env.example` to `.env.local` for local builds or configure the value in the build service's secret store. Never commit the real key. The stable Android package and iOS bundle identifier are both `com.javierante.localoffers`.

## Environments

| Environment | API configuration | Build behavior |
| --- | --- | --- |
| Local | Set `EXPO_PUBLIC_API_BASE_URL` in `.env.local`. When omitted in development, the app falls back to `http://localhost:8080/api/v1`. | `npx expo start`; no EAS build required. |
| Preview | Set `EXPO_PUBLIC_API_BASE_URL` to the public HTTPS API in the EAS `preview` environment. | Internal-distribution Android APK from the `preview` profile. |
| Production | Set `EXPO_PUBLIC_API_BASE_URL` in the EAS `production` environment when store publication begins. | Production build with automatic version increments. |

Release builds fail during startup if the public API variable is missing or does not use HTTPS. `EXPO_PUBLIC_API_BASE_URL` is public application configuration, not a secret. The Google Maps key should use sensitive visibility in EAS and remain restricted to the Android package and signing certificate.

For local device testing, copy the example and adjust the API host:

```bash
cp .env.example .env.local
```

- Web and the iOS simulator can normally use `localhost`.
- The standard Android emulator uses `http://10.0.2.2:8080/api/v1`.
- A physical device uses `http://<computer-lan-ip>:8080/api/v1` while both devices are on the same network.

`eas.json` defines the `preview` APK and eventual `production` profiles. EAS environment values are configured later in the publishing runbook, after the public API hostname exists.

## Structure

```text
src/components/   shared presentational components
src/config/       API configuration
src/constants/    remaining mock fixtures
src/hooks/        TanStack Query hooks
src/navigation/   root, tab, and feed navigators
src/screens/      application screens
src/services/     API and domain service functions
src/store/        persisted authentication state
src/theme/        design tokens
src/types/        domain and navigation types
src/utils/        formatting and class utilities
```

See [`../docs/architecture.md`](../docs/architecture.md) for the current data flow and cross-stack design, and [`../docs/development.md`](../docs/development.md) for the complete local workflow.
