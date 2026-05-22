import React from 'react';
import {
  View,
  FlatList,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useOffers } from '../../hooks/useOffers';
import { OfferCard } from '../../components/common/OfferCard';
import { CategoryChip } from '../../components/common/CategoryChip';
import { EmptyState } from '../../components/common/EmptyState';
import { MOCK_CATEGORIES } from '../../constants/mockData';
import type { FeedStackParamList, Category } from '../../types';
import { colors } from '../../theme/colors';

type FeedNavProp = NativeStackNavigationProp<FeedStackParamList, 'Feed'>;

export default function FeedScreen() {
  const navigation = useNavigation<FeedNavProp>();
  const { data, isLoading, isFetching, refetch, selectedCategory, setSelectedCategory } =
    useOffers();

  const offers = data?.items ?? [];

  return (
    <View className="flex-1 bg-surface">
      <View className="bg-white border-b border-border py-3">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        >
          {MOCK_CATEGORIES.map((cat) => (
            <CategoryChip
              key={cat.id}
              label={cat.label}
              selected={selectedCategory === cat.id}
              onPress={() => setSelectedCategory(cat.id as Category | 'all')}
            />
          ))}
        </ScrollView>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
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
          contentContainerStyle={{ paddingTop: 12, paddingBottom: 24, flexGrow: 1 }}
        />
      )}
    </View>
  );
}
