import { useMutation } from '@tanstack/react-query';
import { login, register, type LoginPayload, type RegisterPayload } from '../services/authService';
import { useAuthStore } from '../store/authStore';

export function useLogin() {
  const storeLogin = useAuthStore((s) => s.login);

  return useMutation({
    mutationFn: (payload: LoginPayload) => login(payload),
    onSuccess: (result) => storeLogin(result.user, result.token),
  });
}

export function useRegister() {
  const storeLogin = useAuthStore((s) => s.login);

  return useMutation({
    mutationFn: (payload: RegisterPayload) => register(payload),
    onSuccess: (result) => storeLogin(result.user, result.token),
  });
}
