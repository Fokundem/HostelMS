import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export const useMyNotifications = (unreadOnly?: boolean, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['myNotifications', !!unreadOnly],
    queryFn: async () => {
      const qs = unreadOnly ? '?unread_only=true' : '';
      const rows = await apiClient.get(`/notifications/mine${qs}`);
      return (rows || []).map((n: any) => ({
        id: n.id,
        userId: n.userId,
        title: n.title,
        message: n.message,
        // map backend types to UI types
        type: ['ROOM_APPROVED', 'PAYMENT_DUE'].includes(n.type) ? 'success'
          : ['ROOM_REJECTED'].includes(n.type) ? 'error'
          : ['COMPLAINT_UPDATE'].includes(n.type) ? 'info'
          : 'info',
        read: !!n.read,
        createdAt: typeof n.createdAt === 'string' ? n.createdAt : new Date(n.createdAt).toISOString(),
        link: n.data?.link,
      }));
    },
    staleTime: 30 * 1000,
    retry: false,
    ...options,
  });
};

export const useMarkNotificationRead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => apiClient.put(`/notifications/${id}/read`, {}),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['myNotifications'] });
    },
  });
};

export const useMarkAllNotificationsRead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => apiClient.put('/notifications/mine/read-all', {}),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['myNotifications'] });
    },
  });
};

export const useDeleteNotification = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => apiClient.delete(`/notifications/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['myNotifications'] });
    },
  });
};

