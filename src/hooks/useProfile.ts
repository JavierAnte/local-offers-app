import { useQuery } from '@tanstack/react-query';
import { getMe, getMyOffers } from '../services/userService';
import { useAuthStore } from '../store/authStore';

export function useProfile() {
  const token = useAuthStore((state) => state.token);
  const userID = useAuthStore((state) => state.user?.id);
  const enabled = token != null && userID != null;

  const profileQuery = useQuery({
    queryKey: ['me', userID],
    queryFn: () => getMe(token!),
    enabled,
  });

  const offersQuery = useQuery({
    queryKey: ['myOffers', userID],
    queryFn: () => getMyOffers(token!),
    enabled,
  });

  return { profileQuery, offersQuery };
}
