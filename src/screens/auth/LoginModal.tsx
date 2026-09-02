import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLogin, useRegister } from '../../hooks/useAuth';
import type { RootStackParamList } from '../../types';
import { colors } from '../../theme/colors';

type NavProp = NativeStackNavigationProp<RootStackParamList, 'LoginModal'>;
type Mode = 'login' | 'register';

const authSchema = z
  .object({
    mode: z.enum(['login', 'register']),
    name: z.string().optional(),
    email: z.string().email('Ingresá un email válido'),
    password: z.string().min(8, 'Mínimo 8 caracteres'),
  })
  .superRefine((data, ctx) => {
    if (data.mode === 'register' && !data.name?.trim()) {
      ctx.addIssue({ code: 'custom', path: ['name'], message: 'Ingresá tu nombre' });
    }
  });

type AuthForm = z.infer<typeof authSchema>;

export default function LoginModal() {
  const navigation = useNavigation<NavProp>();
  const [mode, setMode] = useState<Mode>('login');
  const [showPassword, setShowPassword] = useState(false);
  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const activeMutation = mode === 'login' ? loginMutation : registerMutation;

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<AuthForm>({
    resolver: zodResolver(authSchema),
    defaultValues: { mode: 'login', email: '', password: '', name: '' },
  });

  function switchMode(next: Mode) {
    setMode(next);
    setValue('mode', next);
    loginMutation.reset();
    registerMutation.reset();
  }

  function onSubmit(data: AuthForm) {
    const onSuccess = () => navigation.goBack();
    if (data.mode === 'login') {
      loginMutation.mutate({ email: data.email, password: data.password }, { onSuccess });
    } else {
      registerMutation.mutate(
        { name: data.name!.trim(), email: data.email, password: data.password },
        { onSuccess },
      );
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View className="flex-1 px-6 pt-10 pb-8">
          <TouchableOpacity onPress={() => navigation.goBack()} className="self-end mb-8">
            <Ionicons name="close" size={28} color={colors.textSecondary} />
          </TouchableOpacity>

          <View className="flex-1 justify-center">
            <Text className="text-3xl font-bold text-text mb-2">
              {mode === 'login' ? 'Bienvenido' : 'Crear cuenta'}
            </Text>
            <Text className="text-base text-muted mb-8">
              {mode === 'login'
                ? 'Inicia sesión para publicar, validar y comentar ofertas.'
                : 'Registrate para empezar a publicar y validar ofertas.'}
            </Text>

            {mode === 'register' && (
              <>
                <Controller
                  control={control}
                  name="name"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      className="bg-surface border border-border rounded-xl px-4 py-3 text-base text-text mb-1"
                      placeholder="Nombre"
                      placeholderTextColor={colors.textMuted}
                      autoCapitalize="words"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                    />
                  )}
                />
                {errors.name && (
                  <Text className="text-xs text-danger mb-2">{errors.name.message}</Text>
                )}
              </>
            )}

            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className="bg-surface border border-border rounded-xl px-4 py-3 text-base text-text mb-1 mt-3"
                  placeholder="Email"
                  placeholderTextColor={colors.textMuted}
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            {errors.email && (
              <Text className="text-xs text-danger mb-2">{errors.email.message}</Text>
            )}

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <View className="flex-row items-center bg-surface border border-border rounded-xl mb-1 mt-3">
                  <TextInput
                    className="flex-1 px-4 py-3 text-base text-text"
                    placeholder="Contraseña"
                    placeholderTextColor={colors.textMuted}
                    secureTextEntry={!showPassword}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword((prev) => !prev)}
                    hitSlop={8}
                    className="px-4"
                  >
                    <Ionicons
                      name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={20}
                      color={colors.textMuted}
                    />
                  </TouchableOpacity>
                </View>
              )}
            />
            {errors.password && (
              <Text className="text-xs text-danger mb-2">{errors.password.message}</Text>
            )}

            {activeMutation.isError && (
              <Text className="text-sm text-danger mt-2 text-center">
                {mode === 'login'
                  ? 'Email o contraseña incorrectos.'
                  : 'No pudimos crear tu cuenta. Probá con otro email.'}
              </Text>
            )}

            <TouchableOpacity
              onPress={handleSubmit(onSubmit)}
              disabled={activeMutation.isPending}
              className="bg-primary rounded-2xl py-4 items-center mt-6"
            >
              {activeMutation.isPending ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <Text className="text-white font-bold text-base">
                  {mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => switchMode(mode === 'login' ? 'register' : 'login')}
              className="py-4 items-center"
            >
              <Text className="text-primary text-sm font-medium">
                {mode === 'login' ? '¿No tenés cuenta? Creá una' : '¿Ya tenés cuenta? Iniciá sesión'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.goBack()} className="py-2 items-center">
              <Text className="text-muted text-sm">Continuar como invitado</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
