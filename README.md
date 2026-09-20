# LocalOffers App

Expo/React Native client for LocalOffers. It supports nearby discovery, email/password authentication, offer publishing with photos, comments, and validate/invalidate voting. Product-level documentation lives in the sibling coordination repository's [`docs/`](../docs/) directory.

## Stack

- Expo SDK 57, React Native, React, and TypeScript
- React Navigation
- TanStack Query and Zustand
- React Hook Form and Zod
- NativeWind

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

## Local API

`src/config/api.ts` currently contains a LAN-specific `API_BASE_URL`. A physical device running Expo Go cannot reach the computer through `localhost`, so update the address to the development machine's LAN IP and keep the `/api/v1` suffix.

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
