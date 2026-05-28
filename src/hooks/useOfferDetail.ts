import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getOfferById, voteOffer } from '../services/offersService';
import { getComments, addComment } from '../services/commentsService';
import type { VoteType } from '../types';

export function useOfferDetail(offerId: string) {
  const queryClient = useQueryClient();

  const offerQuery = useQuery({
    queryKey: ['offer', offerId],
    queryFn: () => getOfferById(offerId),
  });

  const commentsQuery = useQuery({
    queryKey: ['comments', offerId],
    queryFn: () => getComments(offerId, offerQuery.data?.commentsCount),
    enabled: !!offerQuery.data,
  });

  const voteMutation = useMutation({
    mutationFn: (type: VoteType) => voteOffer(offerId, type),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['offer', offerId] });
    },
  });

  const commentMutation = useMutation({
    mutationFn: (text: string) => addComment({ offerId, text }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', offerId] });
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
