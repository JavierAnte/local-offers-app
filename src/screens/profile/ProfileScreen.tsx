import React from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../store/authStore';
import { OfferCard } from '../../components/common/OfferCard';
import { EmptyState } from '../../components/common/EmptyState';
import { useProfile } from '../../hooks/useProfile';
import type { RootStackParamList } from '../../types';
import { colors } from '../../theme/colors';

type RootNavProp = NativeStackNavigationProp<RootStackParamList>;

export default function ProfileScreen() {
  const navigation = useNavigation<RootNavProp>();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { profileQuery, offersQuery } = useProfile();

  if (!isAuthenticated || !user) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-8">
        <Ionicons name="person-circle-outline" size={80} color={colors.textMuted} />
        <Text className="text-xl font-bold text-text mt-4 mb-2">¡Únete a la comunidad!</Text>
        <Text className="text-sm text-muted text-center mb-8">
          Inicia sesión para publicar ofertas y ganar reputación.
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('LoginModal', {})}
          className="bg-primary px-8 py-3 rounded-2xl"
        >
          <Text className="text-white font-bold">Iniciar sesión</Text>
        </TouchableOpacity>
      </View>
    );
  }

  function handleLogout() {
    Alert.alert('Cerrar sesión', '¿Seguro que quieres salir?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Salir', style: 'destructive', onPress: logout },
    ]);
  }

  const profile = profileQuery.data ?? user;
  const offers = offersQuery.data ?? [];
  const isRefreshing = profileQuery.isRefetching || offersQuery.isRefetching;

  function handleRefresh() {
    void profileQuery.refetch();
    void offersQuery.refetch();
  }

  function handleRetry() {
    void profileQuery.refetch();
    void offersQuery.refetch();
  }

  return (
    <ScrollView
      className="flex-1 bg-surface"
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
      }
    >
      <View className="bg-white px-6 py-8 items-center border-b border-border">
        {profile.avatarUrl ? (
          <Image
            source={{ uri: profile.avatarUrl }}
            className="w-20 h-20 rounded-full mb-3"
          />
        ) : (
          <View className="w-20 h-20 rounded-full bg-primary-light items-center justify-center mb-3">
            <Text className="text-3xl font-bold text-primary">
              {profile.name[0]?.toUpperCase()}
            </Text>
          </View>
        )}
        <Text className="text-xl font-bold text-text">{profile.name}</Text>
        {profile.email ? (
          <Text className="text-sm text-muted mt-1">{profile.email}</Text>
        ) : null}

        <View className="mt-4">
          <View className="items-center">
            <Text className="text-lg font-bold text-primary">{offers.length}</Text>
            <Text className="text-xs text-muted">Ofertas</Text>
          </View>
        </View>
      </View>

      <Text className="text-base font-semibold text-text px-4 py-4">Mis ofertas</Text>

      {offersQuery.isPending ? (
        <ActivityIndicator color={colors.primary} className="my-8" />
      ) : offersQuery.isError ? (
        <View className="items-center px-8 py-8">
          <Text className="text-sm text-muted text-center mb-4">
            No pudimos cargar tus ofertas.
          </Text>
          <TouchableOpacity
            onPress={handleRetry}
            className="border border-primary px-5 py-2 rounded-xl"
          >
            <Text className="text-primary font-semibold">Reintentar</Text>
          </TouchableOpacity>
        </View>
      ) : offers.length === 0 ? (
        <EmptyState
          title="Sin ofertas publicadas"
          description="Publica tu primera oferta."
          icon="🏷️"
        />
      ) : (
        offers.map((offer) => (
          <OfferCard
            key={offer.id}
            offer={offer}
            showDistance={false}
            onPress={() =>
              navigation.navigate('MainTabs', {
                screen: 'FeedTab',
                params: {
                  screen: 'OfferDetail',
                  params: {
                    offerId: offer.id,
                    distanceMeters: offer.distanceMeters,
                  },
                },
              })
            }
          />
        ))
      )}

      <View className="bg-white mx-4 mt-6 mb-8 rounded-2xl border border-border overflow-hidden">
        <TouchableOpacity
          onPress={handleLogout}
          className="flex-row items-center gap-3 px-4 py-4"
        >
          <Ionicons name="log-out-outline" size={20} color={colors.danger} />
          <Text className="text-base text-danger font-medium">Cerrar sesión</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
