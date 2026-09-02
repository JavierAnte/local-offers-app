import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createOffer, type CreateOfferPayload } from '../services/offersService';
import { useAuthStore } from '../store/authStore';

export function useCreateOffer() {
  const queryClient = useQueryClient();
  const token = useAuthStore((s) => s.token);

  return useMutation({
    mutationFn: (payload: CreateOfferPayload) => {
      if (!token) {
        return Promise.reject(new Error('Debés iniciar sesión para publicar una oferta.'));
      }
      return createOffer(payload, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['offers'] });
    },
  });
}
