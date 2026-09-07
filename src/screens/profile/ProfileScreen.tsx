import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../store/authStore';
import { OfferCard } from '../../components/common/OfferCard';
import { EmptyState } from '../../components/common/EmptyState';
import { MOCK_MY_OFFERS } from '../../constants/mockData';
import type { RootStackParamList } from '../../types';
import { colors } from '../../theme/colors';

type RootNavProp = NativeStackNavigationProp<RootStackParamList>;

export default function ProfileScreen() {
  const navigation = useNavigation<RootNavProp>();
  const { user, isAuthenticated, logout } = useAuthStore();

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

  return (
    <ScrollView className="flex-1 bg-surface">
      <View className="bg-white px-6 py-8 items-center border-b border-border">
        {user.avatarUrl ? (
          <Image
            source={{ uri: user.avatarUrl }}
            className="w-20 h-20 rounded-full mb-3"
          />
        ) : (
          <View className="w-20 h-20 rounded-full bg-primary-light items-center justify-center mb-3">
            <Text className="text-3xl font-bold text-primary">{user.name[0]}</Text>
          </View>
        )}
        <Text className="text-xl font-bold text-text">{user.name}</Text>

        <View className="flex-row gap-8 mt-4">
          <View className="items-center">
            <Text className="text-lg font-bold text-primary">{user.reputationScore}</Text>
            <Text className="text-xs text-muted">Reputación</Text>
          </View>
          <View className="items-center">
            <Text className="text-lg font-bold text-primary">{user.badgesCount}</Text>
            <Text className="text-xs text-muted">Insignias</Text>
          </View>
          <View className="items-center">
            <Text className="text-lg font-bold text-primary">{MOCK_MY_OFFERS.length}</Text>
            <Text className="text-xs text-muted">Ofertas</Text>
          </View>
        </View>
      </View>

      <Text className="text-base font-semibold text-text px-4 py-4">Mis ofertas</Text>

      {MOCK_MY_OFFERS.length === 0 ? (
        <EmptyState
          title="Sin ofertas publicadas"
          description="Publica tu primera oferta."
          icon="🏷️"
        />
      ) : (
        MOCK_MY_OFFERS.map((offer) => (
          <OfferCard
            key={offer.id}
            offer={offer}
            onPress={() => {
              // TODO: cross-tab navigation to OfferDetail — Phase 2+
            }}
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
