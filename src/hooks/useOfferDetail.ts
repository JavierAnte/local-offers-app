import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getOfferById, voteOffer } from '../services/offersService';
import { getComments, addComment } from '../services/commentsService';
import { useAuthStore } from '../store/authStore';
import type { VoteType } from '../types';

export function useOfferDetail(offerId: string) {
  const queryClient = useQueryClient();
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);

  const offerQuery = useQuery({
    queryKey: ['offer', offerId],
    queryFn: () => getOfferById(offerId),
  });

  const commentsQuery = useQuery({
    queryKey: ['comments', offerId],
    queryFn: () => getComments(offerId),
    enabled: !!offerQuery.data,
  });

  const voteMutation = useMutation({
    mutationFn: (type: VoteType) => {
      if (!token) {
        return Promise.reject(new Error('Debés iniciar sesión para votar.'));
      }
      return voteOffer(offerId, type, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['offer', offerId] });
      queryClient.invalidateQueries({ queryKey: ['offers'] });
    },
  });

  const commentMutation = useMutation({
    mutationFn: (text: string) => {
      if (!token || !user) {
        return Promise.reject(new Error('Debés iniciar sesión para comentar.'));
      }
      return addComment({ offerId, text }, token, user);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', offerId] });
      queryClient.invalidateQueries({ queryKey: ['offer', offerId] });
      queryClient.invalidateQueries({ queryKey: ['offers'] });
    },
  });

  return {
    offer: offerQuery.data,
    comments: commentsQuery.data ?? [],
    isLoading: offerQuery.isLoading || commentsQuery.isLoading,
    isError: offerQuery.isError || commentsQuery.isError,
    voteMutation,
    commentMutation,
  };
}
