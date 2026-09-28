import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Platform, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import MapView, { Marker } from 'react-native-maps';
import type { OfferMapProps } from './OfferMap.types';
import { colors } from '../../theme/colors';

const DEFAULT_DELTA = 0.09;
const MAP_PADDING = { top: 64, right: 48, bottom: 120, left: 48 };

function AndroidExpoGoNotice() {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 32,
        backgroundColor: colors.surface,
      }}
    >
      <Ionicons name="map-outline" size={56} color={colors.textMuted} />
      <Text
        style={{
          color: colors.text,
          fontSize: 18,
          fontWeight: '700',
          textAlign: 'center',
          marginTop: 16,
        }}
      >
        El mapa requiere una compilación de la app
      </Text>
      <Text
        style={{
          color: colors.textSecondary,
          fontSize: 14,
          lineHeight: 20,
          textAlign: 'center',
          marginTop: 8,
        }}
      >
        Expo Go para Android no puede cargar los mapas de Google actualmente. La vista estará
        disponible en la compilación de desarrollo y en la aplicación publicada.
      </Text>
    </View>
  );
}

function NativeOfferMap({
  offers,
  userCoords,
  isUsingFallback,
  hasActiveFilters,
  onClearFilters,
  onOfferPress,
}: OfferMapProps) {
  const mapRef = useRef<MapView>(null);
  const [isMapReady, setIsMapReady] = useState(false);

  const recenter = useCallback(
    (animated = true) => {
      if (!mapRef.current) return;

      if (offers.length === 0) {
        mapRef.current.animateToRegion(
          {
            ...userCoords,
            latitudeDelta: DEFAULT_DELTA,
            longitudeDelta: DEFAULT_DELTA,
          },
          animated ? 350 : 0,
        );
        return;
      }

      const coordinates = [
        userCoords,
        ...offers.map(({ latitude, longitude }) => ({ latitude, longitude })),
      ];
      const latitudes = coordinates.map(({ latitude }) => latitude);
      const longitudes = coordinates.map(({ longitude }) => longitude);
      const minLatitude = Math.min(...latitudes);
      const maxLatitude = Math.max(...latitudes);
      const minLongitude = Math.min(...longitudes);
      const maxLongitude = Math.max(...longitudes);
      const latitudeSpan = maxLatitude - minLatitude;
      const longitudeSpan = maxLongitude - minLongitude;

      if (latitudeSpan < 0.0005 && longitudeSpan < 0.0005) {
        mapRef.current.animateToRegion(
          {
            latitude: (minLatitude + maxLatitude) / 2,
            longitude: (minLongitude + maxLongitude) / 2,
            latitudeDelta: Math.max(latitudeSpan * 2.5, 0.01),
            longitudeDelta: Math.max(longitudeSpan * 2.5, 0.01),
          },
          animated ? 350 : 0,
        );
        return;
      }

      mapRef.current.fitToCoordinates(
        coordinates,
        { edgePadding: MAP_PADDING, animated },
      );
    },
    [offers, userCoords],
  );

  useEffect(() => {
    if (isMapReady) {
      recenter();
    }
  }, [isMapReady, recenter]);

  return (
    <View style={{ flex: 1 }}>
      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        initialRegion={{
          ...userCoords,
          latitudeDelta: DEFAULT_DELTA,
          longitudeDelta: DEFAULT_DELTA,
        }}
        onMapReady={() => setIsMapReady(true)}
        showsCompass
        toolbarEnabled={false}
      >
        <Marker
          coordinate={userCoords}
          pinColor={colors.primary}
          title={isUsingFallback ? 'Ubicación predeterminada' : 'Tu ubicación'}
          zIndex={2}
        />
        {offers.map((offer) => (
          <Marker
            key={offer.id}
            coordinate={{ latitude: offer.latitude, longitude: offer.longitude }}
            pinColor={colors.danger}
            title={offer.headline}
            description={offer.businessName}
            accessibilityLabel={`${offer.headline}, ${offer.businessName}`}
            onPress={() => onOfferPress(offer)}
          />
        ))}
      </MapView>

      <TouchableOpacity
        onPress={() => recenter()}
        accessibilityRole="button"
        accessibilityLabel="Centrar mapa en las ofertas"
        style={{
          position: 'absolute',
          right: 16,
          bottom: 24,
          width: 44,
          height: 44,
          borderRadius: 22,
          backgroundColor: colors.white,
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: colors.black,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.18,
          shadowRadius: 5,
          elevation: 5,
        }}
      >
        <Ionicons name="locate" size={23} color={colors.primary} />
      </TouchableOpacity>

      {offers.length === 0 ? (
        <View
          pointerEvents="box-none"
          style={{ position: 'absolute', left: 16, right: 16, top: 24, alignItems: 'center' }}
        >
          <View
            style={{
              backgroundColor: colors.white,
              borderRadius: 12,
              paddingHorizontal: 18,
              paddingVertical: 14,
              alignItems: 'center',
              shadowColor: colors.black,
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.12,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <Text style={{ color: colors.text, fontWeight: '700', fontSize: 15 }}>
              {hasActiveFilters ? 'No encontramos coincidencias' : 'No hay ofertas cercanas'}
            </Text>
            {hasActiveFilters ? (
              <TouchableOpacity onPress={onClearFilters} style={{ marginTop: 8 }}>
                <Text style={{ color: colors.primary, fontWeight: '600' }}>Limpiar filtros</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      ) : null}
    </View>
  );
}

export default function OfferMap(props: OfferMapProps) {
  const isAndroidExpoGo =
    Platform.OS === 'android' &&
    Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

  if (isAndroidExpoGo) {
    return <AndroidExpoGoNotice />;
  }

  return <NativeOfferMap {...props} />;
}
