import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useCreateOffer } from '../../hooks/useCreateOffer';
import { useAuthStore } from '../../store/authStore';
import { MOCK_CATEGORIES } from '../../constants/mockData';
import { CategoryChip } from '../../components/common/CategoryChip';
import type { RootStackParamList, Category } from '../../types';
import { colors } from '../../theme/colors';

const createOfferSchema = z.object({
  title: z.string().min(5, 'Mínimo 5 caracteres').max(100),
  businessName: z.string().min(2, 'Mínimo 2 caracteres').max(80),
  currentPrice: z.string().refine((v) => !isNaN(parseFloat(v)) && parseFloat(v) > 0, {
    message: 'Precio inválido',
  }),
  previousPrice: z
    .string()
    .optional()
    .refine((v) => !v || (!isNaN(parseFloat(v)) && parseFloat(v) > 0), {
      message: 'Precio inválido',
    }),
  category: z.enum([
    'food',
    'grocery',
    'electronics',
    'fashion',
    'sports',
    'home',
    'beauty',
    'other',
  ]),
});

type CreateOfferForm = z.infer<typeof createOfferSchema>;
type RootNavProp = NativeStackNavigationProp<RootStackParamList>;

const categories = MOCK_CATEGORIES.filter((c) => c.id !== 'all');

export default function CreateOfferScreen() {
  const navigation = useNavigation<RootNavProp>();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { mutate, isPending, isSuccess, reset: resetMutation } = useCreateOffer();
  const [imageUri, setImageUri] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateOfferForm>({
    resolver: zodResolver(createOfferSchema),
    defaultValues: { category: 'other' },
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigation.navigate('LoginModal', { redirectBack: false });
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isSuccess) {
      reset();
      setImageUri(null);
      resetMutation();
      navigation.navigate('MainTabs');
    }
  }, [isSuccess]);

  async function pickImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });
    if (!result.canceled) setImageUri(result.assets[0].uri);
  }

  function onSubmit(data: CreateOfferForm) {
    mutate({
      title: data.title,
      businessName: data.businessName,
      currentPrice: parseFloat(data.currentPrice),
      previousPrice: data.previousPrice ? parseFloat(data.previousPrice) : undefined,
      category: data.category as Category,
      imageUri: imageUri ?? undefined,
    });
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        <Text className="text-2xl font-bold text-text mb-6">Publicar oferta</Text>

        <TouchableOpacity onPress={pickImage} className="mb-5">
          {imageUri ? (
            <Image source={{ uri: imageUri }} className="w-full h-44 rounded-2xl" resizeMode="cover" />
          ) : (
            <View className="w-full h-44 rounded-2xl bg-surface border-2 border-dashed border-border items-center justify-center">
              <Ionicons name="camera-outline" size={32} color={colors.textMuted} />
              <Text className="text-sm text-muted mt-2">Añadir foto (opcional)</Text>
            </View>
          )}
        </TouchableOpacity>

        <Text className="text-sm font-medium text-text mb-1">Título *</Text>
        <Controller
          control={control}
          name="title"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              className="bg-surface border border-border rounded-xl px-4 py-3 text-base text-text"
              placeholder="Ej: Pollo entero en oferta"
              placeholderTextColor={colors.textMuted}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {errors.title && (
          <Text className="text-xs text-danger mt-1 mb-2">{errors.title.message}</Text>
        )}

        <Text className="text-sm font-medium text-text mb-1 mt-4">Nombre del negocio *</Text>
        <Controller
          control={control}
          name="businessName"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              className="bg-surface border border-border rounded-xl px-4 py-3 text-base text-text"
              placeholder="Ej: Supermercado El Barrio"
              placeholderTextColor={colors.textMuted}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {errors.businessName && (
          <Text className="text-xs text-danger mt-1 mb-2">{errors.businessName.message}</Text>
        )}

        <View className="flex-row gap-3 mt-4">
          <View className="flex-1">
            <Text className="text-sm font-medium text-text mb-1">Precio actual *</Text>
            <Controller
              control={control}
              name="currentPrice"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className="bg-surface border border-border rounded-xl px-4 py-3 text-base text-text"
                  placeholder="3.99"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="decimal-pad"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            {errors.currentPrice && (
              <Text className="text-xs text-danger mt-1">{errors.currentPrice.message}</Text>
            )}
          </View>

          <View className="flex-1">
            <Text className="text-sm font-medium text-text mb-1">Precio anterior</Text>
            <Controller
              control={control}
              name="previousPrice"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className="bg-surface border border-border rounded-xl px-4 py-3 text-base text-text"
                  placeholder="6.50"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="decimal-pad"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
          </View>
        </View>

        <Text className="text-sm font-medium text-text mb-2 mt-4">Categoría *</Text>
        <Controller
          control={control}
          name="category"
          render={({ field: { onChange, value } }) => (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {categories.map((cat) => (
                <CategoryChip
                  key={cat.id}
                  label={cat.label}
                  selected={value === cat.id}
                  onPress={() => onChange(cat.id)}
                />
              ))}
            </ScrollView>
          )}
        />

        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          disabled={isPending}
          className="bg-primary rounded-2xl py-4 items-center mt-8"
        >
          {isPending ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text className="text-white font-bold text-base">Publicar oferta</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
