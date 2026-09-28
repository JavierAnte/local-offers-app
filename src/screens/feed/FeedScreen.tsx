import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Platform,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useOffers } from '../../hooks/useOffers';
import type { LocationStatus } from '../../hooks/useLocation';
import { OfferCard } from '../../components/common/OfferCard';
import { CategoryChip } from '../../components/common/CategoryChip';
import { EmptyState } from '../../components/common/EmptyState';
import OfferMap from '../../components/feed/OfferMap';
import { MOCK_CATEGORIES } from '../../constants/mockData';
import type { FeedStackParamList, Category } from '../../types';
import { colors } from '../../theme/colors';

type FeedNavProp = NativeStackNavigationProp<FeedStackParamList, 'Feed'>;
type FeedView = 'list' | 'map';

function ViewToggle({ value, onChange }: { value: FeedView; onChange: (value: FeedView) => void }) {
  return (
    <View
      style={{
        alignSelf: 'center',
        flexDirection: 'row',
        backgroundColor: colors.surface,
        borderRadius: 9,
        padding: 3,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: colors.border,
      }}
    >
      {([
        { value: 'list' as const, label: 'Lista', icon: 'list-outline' as const },
        { value: 'map' as const, label: 'Mapa', icon: 'map-outline' as const },
      ]).map((option) => {
        const selected = value === option.value;
        return (
          <TouchableOpacity
            key={option.value}
            onPress={() => onChange(option.value)}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
              paddingHorizontal: 18,
              paddingVertical: 7,
              borderRadius: 7,
              backgroundColor: selected ? colors.white : 'transparent',
            }}
          >
            <Ionicons
              name={option.icon}
              size={16}
              color={selected ? colors.primary : colors.textMuted}
            />
            <Text
              style={{
                fontSize: 13,
                fontWeight: selected ? '700' : '500',
                color: selected ? colors.primary : colors.textSecondary,
              }}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function LocationHeader({
  locationStatus,
  isUsingFallback,
  onRetry,
}: {
  locationStatus: LocationStatus;
  isUsingFallback: boolean;
  onRetry: () => void;
}) {
  const subtitle =
    locationStatus === 'loading'
      ? 'Buscando tu ubicación…'
      : isUsingFallback
        ? 'Ubicación no disponible · mostrando zona por defecto'
        : 'Cerca de ti';

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 }}>
      <Ionicons name="location" size={20} color={colors.primary} style={{ marginRight: 8 }} />
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 17, fontWeight: '700', color: colors.text }}>Tu ubicación</Text>
        <Text style={{ fontSize: 12, color: colors.textMuted }}>{subtitle}</Text>
      </View>
      {isUsingFallback && (
        <TouchableOpacity onPress={onRetry} hitSlop={8}>
          <Text style={{ fontSize: 12, fontWeight: '600', color: colors.primary }}>Reintentar</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

function SearchBar({
  value,
  onChangeText,
  onClear,
}: {
  value: string;
  onChangeText: (value: string) => void;
  onClear: () => void;
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 16,
        marginVertical: 8,
        backgroundColor: colors.surface,
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 9,
        borderWidth: 1,
        borderColor: colors.border,
      }}
    >
      <Ionicons name="search-outline" size={16} color={colors.textMuted} style={{ marginRight: 8 }} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Buscar ofertas..."
        placeholderTextColor={colors.textMuted}
        style={{ flex: 1, fontSize: 14, color: colors.text, padding: 0 }}
        returnKeyType="search"
        maxLength={100}
      />
      {value.length > 0 ? (
        <TouchableOpacity
          onPress={onClear}
          accessibilityRole="button"
          accessibilityLabel="Limpiar búsqueda"
          hitSlop={8}
          style={{ marginLeft: 8 }}
        >
          <Ionicons name="close-circle" size={18} color={colors.textMuted} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

export default function FeedScreen() {
  const navigation = useNavigation<FeedNavProp>();
  const route = useRoute<RouteProp<FeedStackParamList, 'Feed'>>();
  const [viewMode, setViewMode] = useState<FeedView>('list');
  const supportsMap = Platform.OS === 'android' || Platform.OS === 'ios';
  const {
    data,
    isLoading,
    isFetching,
    isError,
    refetch,
    selectedCategory,
    setSelectedCategory,
    searchText,
    setSearchText,
    clearFilters,
    hasActiveFilters,
    coords,
    locationStatus,
    isUsingFallback,
    refreshLocation,
  } = useOffers();

  useEffect(() => {
    if (route.params?.resetFiltersKey != null) {
      clearFilters();
    }
  }, [clearFilters, route.params?.resetFiltersKey]);

  const offers = data?.items ?? [];
  const showSpinner = locationStatus === 'loading' || isLoading;

  return (
    <View style={{ flex: 1, backgroundColor: colors.surface }}>
      {/* Header */}
      <View style={{ backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.border }}>
        <LocationHeader
          locationStatus={locationStatus}
          isUsingFallback={isUsingFallback}
          onRetry={refreshLocation}
        />
        <SearchBar
          value={searchText}
          onChangeText={setSearchText}
          onClear={() => setSearchText('')}
        />

        {/* Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 10 }}
        >
          {MOCK_CATEGORIES.map((cat) => (
            <CategoryChip
              key={cat.id}
              label={cat.label}
              icon={cat.icon}
              selected={selectedCategory === cat.id}
              onPress={() => setSelectedCategory(cat.id as Category | 'all')}
            />
          ))}
        </ScrollView>
        {supportsMap ? <ViewToggle value={viewMode} onChange={setViewMode} /> : null}
      </View>

      {showSpinner ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : isError && !data ? (
        <EmptyState
          title="No pudimos cargar las ofertas"
          description="Revisa tu conexión e inténtalo de nuevo."
          icon="⚠️"
          actionLabel="Reintentar"
          onAction={() => void refetch()}
        />
      ) : (
        <View style={{ flex: 1 }}>
          {isError ? (
            <TouchableOpacity
              onPress={() => void refetch()}
              style={{ paddingHorizontal: 16, paddingVertical: 8, backgroundColor: colors.warningLight }}
            >
              <Text style={{ color: colors.text, fontSize: 12, textAlign: 'center' }}>
                No se pudieron actualizar las ofertas. Toca para reintentar.
              </Text>
            </TouchableOpacity>
          ) : null}
          {supportsMap && viewMode === 'map' ? (
            <View style={{ flex: 1 }}>
              <OfferMap
                offers={offers}
                userCoords={coords}
                isUsingFallback={isUsingFallback}
                hasActiveFilters={hasActiveFilters}
                onClearFilters={clearFilters}
                onOfferPress={(offer) =>
                  navigation.navigate('OfferDetail', {
                    offerId: offer.id,
                    distanceMeters: offer.distanceMeters,
                  })
                }
              />
              {isFetching ? (
                <View
                  style={{
                    position: 'absolute',
                    top: 12,
                    right: 16,
                    backgroundColor: colors.white,
                    borderRadius: 18,
                    padding: 8,
                    elevation: 3,
                  }}
                >
                  <ActivityIndicator size="small" color={colors.primary} />
                </View>
              ) : null}
            </View>
          ) : (
            <FlatList
              data={offers}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <OfferCard
                  offer={item}
                  onPress={() => navigation.navigate('OfferDetail', { offerId: item.id, distanceMeters: item.distanceMeters })}
                />
              )}
              ListHeaderComponent={
                offers.length > 0 ? (
                  <Text
                    style={{
                      fontSize: 13,
                      color: colors.textMuted,
                      paddingHorizontal: 16,
                      paddingTop: 12,
                      paddingBottom: 4,
                    }}
                  >
                    {offers.length} oferta{offers.length !== 1 ? 's' : ''} cerca de ti
                  </Text>
                ) : null
              }
              ListEmptyComponent={
                <EmptyState
                  title={hasActiveFilters ? 'No encontramos coincidencias' : 'No hay ofertas cercanas'}
                  description={
                    hasActiveFilters
                      ? 'Prueba con otra búsqueda o categoría.'
                      : 'Sé el primero en publicar una oferta cercana.'
                  }
                  icon="🏷️"
                  actionLabel={hasActiveFilters ? 'Limpiar filtros' : undefined}
                  onAction={hasActiveFilters ? clearFilters : undefined}
                />
              }
              refreshControl={
                <RefreshControl
                  refreshing={isFetching && !isLoading}
                  onRefresh={refetch}
                  tintColor={colors.primary}
                />
              }
              contentContainerStyle={{ paddingBottom: 24, flexGrow: 1 }}
              keyboardDismissMode="on-drag"
              keyboardShouldPersistTaps="handled"
            />
          )}
        </View>
      )}
    </View>
  );
}
