import React from 'react';
import {
  View,
  Text,
  FlatList,
  ScrollView,
  TextInput,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useOffers } from '../../hooks/useOffers';
import { OfferCard } from '../../components/common/OfferCard';
import { CategoryChip } from '../../components/common/CategoryChip';
import { EmptyState } from '../../components/common/EmptyState';
import { MOCK_CATEGORIES } from '../../constants/mockData';
import type { FeedStackParamList, Category } from '../../types';
import { colors } from '../../theme/colors';

type FeedNavProp = NativeStackNavigationProp<FeedStackParamList, 'Feed'>;

function LocationHeader() {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 }}>
      <Ionicons name="location" size={20} color={colors.primary} style={{ marginRight: 8 }} />
      <View>
        <Text style={{ fontSize: 17, fontWeight: '700', color: colors.text }}>Tu ubicación</Text>
        <Text style={{ fontSize: 12, color: colors.textMuted }}>Centro · 2km de alcance</Text>
      </View>
    </View>
  );
}

function SearchBar() {
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
        placeholder="Buscar ofertas..."
        placeholderTextColor={colors.textMuted}
        style={{ flex: 1, fontSize: 14, color: colors.text, padding: 0 }}
      />
    </View>
  );
}

export default function FeedScreen() {
  const navigation = useNavigation<FeedNavProp>();
  const { data, isLoading, isFetching, refetch, selectedCategory, setSelectedCategory } =
    useOffers();

  const offers = data?.items ?? [];

  return (
    <View style={{ flex: 1, backgroundColor: colors.surface }}>
      {/* Header */}
      <View style={{ backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.border }}>
        <LocationHeader />
        <SearchBar />

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
      </View>

      {isLoading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={offers}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <OfferCard
              offer={item}
              onPress={() => navigation.navigate('OfferDetail', { offerId: item.id })}
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
              title="Sin ofertas en esta categoría"
              description="Sé el primero en publicar una oferta cercana."
              icon="🏷️"
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
        />
      )}
    </View>
  );
}
