# LocalOffers — App

Mobile client for LocalOffers, a hyperlocal, collaborative board of local offers: users see nearby offers, publish ones they find, and validate/comment on offers others post. Built with Expo/React Native. The backend lives in the sibling repo `local-offers-api` (Go).

## Status

Work in progress. Navigation, theming, and all 6 screens (Feed, Offer Detail, Create Offer, Profile, Notifications, Login) are built. Only the offer-reading endpoints (feed + offer detail) talk to the real backend today — everything else (auth, create offer, votes, comments, notifications, profile data) still runs on mock data. See [CLAUDE.md](CLAUDE.md) for the up-to-date breakdown of what's wired vs. mocked.

## Tech stack

- Expo SDK 54, React Native 0.81, React 19
- React Navigation (native-stack + bottom-tabs)
- TanStack Query for server state, Zustand for auth state
- NativeWind (Tailwind) for styling
- React Hook Form + Zod for forms/validation

## Getting started

```bash
npm install
npx expo start --clear
```

Then run on a platform:

```bash
npm run android   # Android emulator
npm run ios       # iOS simulator (Mac only)
npm run web       # Browser
```

To hit a local backend, update `API_BASE_URL` in [src/config/api.ts](src/config/api.ts) to your machine's LAN IP (Expo Go on a physical device can't reach `localhost`) and start `local-offers-api` locally.

No test runner or linter is configured yet.

## Project structure

```
src/
├── components/common/   # Presentational shared components (OfferCard, CategoryChip, ...)
├── config/               # API base URL config
├── constants/            # Mock data fixtures
├── hooks/                # TanStack Query hooks (useOffers, useOfferDetail, useCreateOffer)
├── navigation/           # RootNavigator → MainTabs → FeedStack
├── screens/              # Feed, Offer Detail, Create Offer, Profile, Notifications, Login
├── services/             # API/service functions consumed by hooks
├── store/                # Zustand auth store
├── theme/                # Colors, typography
├── types/                # Domain + navigation types
└── utils/                # format, cn (className) helpers
```

## Docs

- [CLAUDE.md](CLAUDE.md) — architecture and conventions for working in this repo (also read by Claude Code).
- `designDocs/` (local only, gitignored) — original product spec and implementation plan used during early development.
