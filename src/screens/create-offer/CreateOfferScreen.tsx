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
import type { RootStackParamList, Category, PricingType } from '../../types';
import { colors } from '../../theme/colors';

const PRICING_OPTIONS: Array<{ type: PricingType | 'none'; label: string }> = [
  { type: 'none', label: 'Sin precio' },
  { type: 'percentage', label: '% Descuento' },
  { type: 'price', label: 'Precio' },
  { type: 'bundle', label: 'Promoción' },
];

const createOfferSchema = z
  .object({
    headline: z.string().min(5, 'Mínimo 5 caracteres').max(100),
    businessName: z.string().min(2, 'Mínimo 2 caracteres').max(80),
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
    pricingType: z.enum(['none', 'percentage', 'price', 'bundle']),
    percentage: z.string().optional(),
    currentPrice: z.string().optional(),
    previousPrice: z.string().optional(),
    bundleLabel: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.pricingType === 'percentage') {
      const v = parseFloat(data.percentage ?? '');
      if (isNaN(v) || v <= 0 || v >= 100) {
        ctx.addIssue({ code: 'custom', path: ['percentage'], message: 'Ingresá un valor entre 1 y 99' });
      }
    }
    if (data.pricingType === 'price') {
      const v = parseFloat(data.currentPrice ?? '');
      if (isNaN(v) || v <= 0) {
        ctx.addIssue({ code: 'custom', path: ['currentPrice'], message: 'Precio inválido' });
      }
    }
    if (data.pricingType === 'bundle') {
      if (!data.bundleLabel?.trim()) {
        ctx.addIssue({ code: 'custom', path: ['bundleLabel'], message: 'Ej: 2x1, 3x2' });
      }
    }
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
    watch,
    formState: { errors },
  } = useForm<CreateOfferForm>({
    resolver: zodResolver(createOfferSchema),
    defaultValues: { category: 'other', pricingType: 'none' },
  });

  const pricingType = watch('pricingType');

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
    let pricing = undefined;
    if (data.pricingType === 'percentage') {
      pricing = { type: 'percentage' as const, percentage: parseFloat(data.percentage!) };
    } else if (data.pricingType === 'price') {
      pricing = {
        type: 'price' as const,
        currentPrice: parseFloat(data.currentPrice!),
        previousPrice: data.previousPrice ? parseFloat(data.previousPrice) : undefined,
      };
    } else if (data.pricingType === 'bundle') {
      pricing = { type: 'bundle' as const, label: data.bundleLabel! };
    }

    mutate({
      headline: data.headline,
      businessName: data.businessName,
      category: data.category as Category,
      pricing,
      imageUri: imageUri ?? undefined,
    });
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        <Text className="text-2xl font-bold text-text mb-1">Publicar oferta</Text>
        <Text className="text-sm text-muted mb-6">¿Qué oferta encontraste?</Text>

        {/* Headline */}
        <Controller
          control={control}
          name="headline"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              className="bg-surface border border-border rounded-xl px-4 py-3 text-base text-text"
              placeholder="Ej: 2x1 en hamburguesas, 30% pagando en efectivo…"
              placeholderTextColor={colors.textMuted}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {errors.headline && (
          <Text className="text-xs text-danger mt-1 mb-2">{errors.headline.message}</Text>
        )}

        {/* Business name */}
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

        {/* Category */}
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

        {/* Pricing type */}
        <Text className="text-sm font-medium text-text mb-2 mt-4">Tipo de oferta</Text>
        <Controller
          control={control}
          name="pricingType"
          render={({ field: { onChange, value } }) => (
            <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
              {PRICING_OPTIONS.map((opt) => (
                <TouchableOpacity
                  key={opt.type}
                  onPress={() => onChange(opt.type)}
                  style={{
                    paddingHorizontal: 14,
                    paddingVertical: 8,
                    borderRadius: 20,
                    borderWidth: 1.5,
                    borderColor: value === opt.type ? colors.primary : colors.border,
                    backgroundColor: value === opt.type ? colors.primaryLight ?? '#EBF5FF' : colors.white,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: '600',
                      color: value === opt.type ? colors.primary : colors.textSecondary,
                    }}
                  >
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        />

        {/* Conditional pricing fields */}
        {pricingType === 'percentage' && (
          <View className="mt-3">
            <Text className="text-sm font-medium text-text mb-1">Porcentaje de descuento *</Text>
            <Controller
              control={control}
              name="percentage"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <TextInput
                    className="bg-surface border border-border rounded-xl px-4 py-3 text-base text-text"
                    style={{ width: 120 }}
                    placeholder="30"
                    placeholderTextColor={colors.textMuted}
                    keyboardType="decimal-pad"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                  <Text className="text-lg font-bold text-text ml-3">%</Text>
                </View>
              )}
            />
            {errors.percentage && (
              <Text className="text-xs text-danger mt-1">{errors.percentage.message}</Text>
            )}
          </View>
        )}

        {pricingType === 'price' && (
          <View className="flex-row gap-3 mt-3">
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
        )}

        {pricingType === 'bundle' && (
          <View className="mt-3">
            <Text className="text-sm font-medium text-text mb-1">Etiqueta de la promo *</Text>
            <Controller
              control={control}
              name="bundleLabel"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className="bg-surface border border-border rounded-xl px-4 py-3 text-base text-text"
                  placeholder="Ej: 2x1, 3x2, 2da al 50%"
                  placeholderTextColor={colors.textMuted}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            {errors.bundleLabel && (
              <Text className="text-xs text-danger mt-1">{errors.bundleLabel.message}</Text>
            )}
          </View>
        )}

        {/* Photo — optional, lower hierarchy */}
        <Text className="text-sm font-medium text-text mb-1 mt-4">Foto (opcional)</Text>
        <TouchableOpacity onPress={pickImage}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} className="w-full h-36 rounded-2xl" resizeMode="cover" />
          ) : (
            <View className="w-full h-36 rounded-2xl bg-surface border border-dashed border-border items-center justify-center">
              <Ionicons name="camera-outline" size={28} color={colors.textMuted} />
              <Text className="text-sm text-muted mt-1">Añadir foto</Text>
            </View>
          )}
        </TouchableOpacity>

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
