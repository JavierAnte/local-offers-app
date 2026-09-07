# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

This is the frontend (Expo/React Native) half of LocalOffers, a hyperlocal collaborative offers board. The backend lives in the sibling repo `local-offers-api` (Go). Development-process docs (original plan, product spec, agent notes) live in `designDocs/`, which is gitignored — read them locally for background, but don't rely on them existing in other clones.

## Commands

```bash
# Start dev server (scan QR code with Expo Go)
npx expo start --clear

# Platform-specific
npm run android   # Android emulator
npm run ios       # iOS simulator (Mac only)
npm run web       # Browser
```

No test runner or linter is configured yet.

## SDK and Expo Go

This app runs on **Expo SDK 57** (upgraded from 54 on 2026-09-07 after the Expo Go app itself moved past SDK 54, breaking `npx expo start` on physical devices — the project's SDK version, not just the client, has to track whatever Expo Go currently supports). Always check the versioned docs at https://docs.expo.dev/versions/latest/ before writing Expo-specific code. When Expo Go moves to a newer SDK again, upgrade with `npx expo install expo@<version> && npx expo install --fix`, then run `npx expo-doctor` to catch missing peer deps (SDK 57 needed `expo-font` and `react-native-worklets` added explicitly, both required transitively by `@expo/vector-icons` and `react-native-reanimated` but not auto-installed).

`babel-preset-expo` tracks whatever `npx expo install --fix` sets it to for the current SDK — don't hand-pin it unless you hit a specific bundler bug again (SDK 54 briefly needed a `~54.0.10` pin to dodge a `[runtime not ready]` Metro crash; not needed as of SDK 57).

### Web support

`react-dom` and `react-native-web` are installed so `npx expo start --web` works for quick testing without a device/simulator (useful on Linux, where there's no iOS simulator and no lightweight Android option). Two Metro/web-specific workarounds exist purely for this:
- [metro.config.js](metro.config.js) forces `zustand`/`zustand/*` to resolve their CommonJS build on web — zustand's ESM build's `devtools` middleware references a bare `import.meta`, which is a parse-time `SyntaxError` when Metro serves the web bundle as a plain (non-`type="module"`) `<script>`. Native platforms are unaffected.
- [src/store/authStore.ts](src/store/authStore.ts)'s `secureStorage` falls back to `localStorage` when `Platform.OS === 'web'` — `expo-secure-store` has no web implementation (its web build is a stub `export default {}`), so calling it on web throws and the zustand `persist` hydration never resolves, leaving the app stuck on the loading spinner indefinitely (looks like a blank screen). Native still uses the real `SecureStore`.

## Architecture

Entry: [index.ts](index.ts) → [App.tsx](App.tsx) (providers) → [RootNavigator](src/navigation/RootNavigator.tsx)

### Navigation (three-layer hierarchy)

```
RootNavigator (NavigationContainer)
├── MainTabs (bottom tabs)
│   ├── FeedTab → FeedStack (native stack)
│   │   ├── FeedScreen
│   │   ├── OfferDetailScreen
│   │   └── NotificationsScreen
│   ├── CreateOffer → CreateOfferScreen
│   └── Profile → ProfileScreen
└── LoginModal (modal, slide from bottom)
```

All navigation param types live in [src/types/index.ts](src/types/index.ts) (`RootStackParamList`, `MainTabParamList`, `FeedStackParamList`).

The 'Perfil' tab icon in [MainTabs.tsx](src/navigation/MainTabs.tsx) is the app's login-state indicator: `ProfileTabIcon` reads `authStore` directly and swaps between the generic outline icon (logged out) and a filled circle with the user's initial (logged in), tinted the same active/inactive color as the other tab icons. It's the only place in the tab bar that reflects auth state — keep it in sync if login/logout behavior changes.

### Data flow

- All API calls go through service functions in [src/services/](src/services/).
- Hooks in [src/hooks/](src/hooks/) wrap TanStack Query (`useQuery` / `useMutation`) and are the only place components fetch or mutate data.
- Auth state (`user`, `token`, `isAuthenticated`, `login`, `logout`) lives in [src/store/authStore.ts](src/store/authStore.ts) via Zustand, persisted to `expo-secure-store` (`persist` middleware, key `auth-storage`). `App.tsx` blocks on `hasHydrated` before mounting `RootNavigator`, so a restored session is available before any screen's auth checks run — don't remove that gate or `CreateOfferScreen`'s auth redirect will flash for a moment on a real device with a saved session.
- Query cache invalidation on mutations: `useCreateOffer` invalidates `['offers']` on success. `useOfferDetail`'s `voteMutation`/`commentMutation` invalidate their own detail-scoped query (`['offer', offerId]`/`['comments', offerId]`) *and* `['offers']`, so the Feed's confirmations/invalidations/commentsCount don't go stale after voting or commenting on an offer from its detail screen — easy to miss since the detail screen itself looks correct either way.

### Backend integration status (Phase 3, in progress)

Real: [src/services/offersService.ts](src/services/offersService.ts)'s `getOffers`/`getOfferById`/`createOffer`/`voteOffer` (`GET /offers/nearby`, `GET /offers/{id}`, `POST /offers`, `POST /offers/{id}/votes` via plain `fetch`, defined in `api.ts`/`offersService.ts`), [src/services/authService.ts](src/services/authService.ts)'s `register`/`login` (`POST /auth/register`, `POST /auth/login`), and [src/services/commentsService.ts](src/services/commentsService.ts)'s `getComments`/`addComment` (`GET`/`POST /offers/{id}/comments`, auth required on POST). `voteOffer` requires a token (auth-gated like commenting). Still mock-backed via `simulateDelay()` + [src/constants/mockData.ts](src/constants/mockData.ts): all of `userService.ts`. When wiring a new service function to the real API, follow the pattern already used for `getOffers`.

- `API_BASE_URL` in [src/config/api.ts](src/config/api.ts) is a hardcoded LAN IP including the `/api/v1` prefix the backend routes live under — update the IP to match your machine's when running the backend locally (Expo Go can't reach `localhost`).
- An `axios` client exists commented out in `api.ts` — the live code path uses `fetch` instead; don't assume axios is active.
- Auth is real (email/password, JWT): `LoginModal` toggles login/register via [src/hooks/useAuth.ts](src/hooks/useAuth.ts) (`useLogin`/`useRegister`, wrapping `authService`), and `authStore.login(user, token)` persists the session. `useCreateOffer` reads `token` from the store and attaches `Authorization: Bearer <token>` — the backend now requires it on `POST /offers`. There's no OAuth (Google login was removed as a fake button, not replaced).
- Geolocation is implemented via [src/hooks/useLocation.ts](src/hooks/useLocation.ts): requests foreground permission, reads the device's current position, and falls back to a fixed Cosquín, Argentina point (matching the seeded offer data) when permission is denied or the position can't be read. `useOffers`/`FeedScreen` and `CreateOfferScreen` both consume this hook — don't reintroduce hardcoded coordinates in either.

### Styling

NativeWind v4 with Tailwind CSS. Custom design tokens are defined in two places that must stay in sync:
- [tailwind.config.js](tailwind.config.js) — `theme.extend.colors` (for `className` usage)
- [src/theme/colors.ts](src/theme/colors.ts) — `colors` object (for inline `style` props and logic)

Use `className` for layout and styling. Use `colors.*` only when a string value is needed (e.g. `tintColor`, `placeholderTextColor`). Use `clsx`/`tailwind-merge` via [src/utils/cn.ts](src/utils/cn.ts) for conditional classes.

### Forms

React Hook Form + Zod v4. Define the schema first with `z.object(...)`, derive the type with `z.infer<typeof schema>`, then pass `zodResolver(schema)` to `useForm`. See [CreateOfferScreen](src/screens/create-offer/CreateOfferScreen.tsx) as the reference implementation.

### Core domain types

Defined in [src/types/index.ts](src/types/index.ts):
- `Offer` — the central entity; `distance` is in metres, prices are numbers, dates are ISO 8601 strings.
- `Category` — string union used in both the type system and Zod schemas (keep them in sync).
- `VoteType` — `'validate' | 'invalidate'`

### Mock data

All mock data is in [src/constants/mockData.ts](src/constants/mockData.ts). Services import from there and add simulated latency via `simulateDelay()` from [src/services/api.ts](src/services/api.ts). Replace service functions one at a time in Phase 3 without touching components.

## Product context

Hyperlocal offers feed. Browsing is public; voting, commenting, and posting require auth. The CreateOffer tab immediately redirects unauthenticated users to `LoginModal`. Auth is real (register/login against the backend) but there's no password reset, email verification, or OAuth yet.