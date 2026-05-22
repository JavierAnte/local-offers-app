import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createOffer, type CreateOfferPayload } from '../services/offersService';

export function useCreateOffer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateOfferPayload) => createOffer(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['offers'] });
    },
  });
}
