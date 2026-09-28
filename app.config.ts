import type { ConfigContext, ExpoConfig } from 'expo/config';

const APP_IDENTIFIER = 'com.javierante.localoffers';

export default ({ config }: ConfigContext): ExpoConfig => {
  const androidGoogleMapsApiKey = process.env.GOOGLE_MAPS_ANDROID_API_KEY;

  return {
    ...config,
    name: config.name ?? 'LocalOffers',
    slug: config.slug ?? 'local-offers-app',
    ios: {
      ...config.ios,
      bundleIdentifier: APP_IDENTIFIER,
    },
    android: {
      ...config.android,
      package: APP_IDENTIFIER,
    },
    plugins: [
      ...(config.plugins ?? []),
      androidGoogleMapsApiKey
        ? [
            'react-native-maps',
            { androidGoogleMapsApiKey },
          ]
        : 'react-native-maps',
    ],
  };
};
