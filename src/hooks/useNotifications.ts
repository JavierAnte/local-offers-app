import { useQuery } from '@tanstack/react-query';
import { getNotifications } from '../services/notificationsService';
import { useAuthStore } from '../store/authStore';

export function useNotifications() {
  const token = useAuthStore((state) => state.token);
  const userID = useAuthStore((state) => state.user?.id);

  return useQuery({
    queryKey: ['notifications', userID],
    queryFn: () => getNotifications(token!),
    enabled: token != null && userID != null,
  });
}
