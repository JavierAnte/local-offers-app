import { useCallback, useEffect, useState } from 'react';
import * as Location from 'expo-location';

export interface Coords {
  latitude: number;
  longitude: number;
}

export type LocationStatus = 'loading' | 'granted' | 'denied' | 'unavailable';

// Cosquín, Argentina — matches the seeded offer data. Used whenever the real
// device location can't be read (permission denied, no GPS fix, simulator, etc).
export const FALLBACK_COORDS: Coords = { latitude: -31.2419, longitude: -64.4639 };

export function useLocation() {
  const [status, setStatus] = useState<LocationStatus>('loading');
  const [coords, setCoords] = useState<Coords>(FALLBACK_COORDS);

  const requestLocation = useCallback(async () => {
    setStatus('loading');
    try {
      const { status: permission } = await Location.requestForegroundPermissionsAsync();
      if (permission !== 'granted') {
        setStatus('denied');
        setCoords(FALLBACK_COORDS);
        return;
      }

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setCoords({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
      setStatus('granted');
    } catch (error) {
      console.warn('[useLocation] failed to get device location', error);
      setStatus('unavailable');
      setCoords(FALLBACK_COORDS);
    }
  }, []);

  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  return {
    coords,
    status,
    isUsingFallback: status === 'denied' || status === 'unavailable',
    refresh: requestLocation,
  };
}
