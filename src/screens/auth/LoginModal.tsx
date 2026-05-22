import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../store/authStore';
import { MOCK_CURRENT_USER } from '../../constants/mockData';
import type { RootStackParamList } from '../../types';
import { colors } from '../../theme/colors';

type NavProp = NativeStackNavigationProp<RootStackParamList, 'LoginModal'>;

export default function LoginModal() {
  const navigation = useNavigation<NavProp>();
  const login = useAuthStore((s) => s.login);

  function handleGoogleLogin() {
    login(MOCK_CURRENT_USER);
    navigation.goBack();
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-6 pt-10 pb-8">
        <TouchableOpacity onPress={() => navigation.goBack()} className="self-end mb-8">
          <Ionicons name="close" size={28} color={colors.textSecondary} />
        </TouchableOpacity>

        <View className="flex-1 justify-center">
          <Text className="text-3xl font-bold text-text mb-2">Bienvenido</Text>
          <Text className="text-base text-muted mb-10">
            Inicia sesión para publicar, validar y comentar ofertas.
          </Text>

          <TouchableOpacity
            onPress={handleGoogleLogin}
            className="flex-row items-center justify-center gap-3 bg-primary py-4 rounded-2xl mb-4"
          >
            <Ionicons name="logo-google" size={22} color={colors.white} />
            <Text className="text-white font-bold text-base">Continuar con Google</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.goBack()} className="py-4 items-center">
            <Text className="text-muted text-sm">Continuar como invitado</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
