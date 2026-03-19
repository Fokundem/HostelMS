import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { normalizeStatus } from '@/lib/normalize';

export const useVisitors = (status?: string) => {
  const queryParams = new URLSearchParams();
  if (status) queryParams.append('status', status);
  const queryString = queryParams.toString();

  return useQuery({
    queryKey: ['visitors', status],
    queryFn: async () => {
      const url = queryString ? `/visitors?${queryString}` : '/visitors';
      const rows = await apiClient.get(url);
      return (rows || []).map((v: any) => ({
        ...v,
        status: normalizeStatus(v.status),
      }));
    },
    staleTime: 60 * 1000,
  });
};

export const useMyVisitorRequests = () => {
  return useQuery({
    queryKey: ['myVisitorRequests'],
    queryFn: async () => {
      const rows = await apiClient.get('/visitors/student/mine');
      return (rows || []).map((v: any) => ({
        ...v,
        status: normalizeStatus(v.status),
      }));
    },
    staleTime: 60 * 1000,
  });
};

export const useRequestVisitor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => apiClient.post('/visitors', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myVisitorRequests'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
    },
  });
};

export const useDecideVisitor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      visitorId,
      status,
      rejectionReason,
    }: {
      visitorId: string;
      status: 'APPROVED' | 'REJECTED';
      rejectionReason?: string;
    }) => apiClient.put(`/visitors/${visitorId}/decide`, { status, rejectionReason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visitors'] });
    },
  });
};

export const useDeleteVisitor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (visitorId: string) => apiClient.delete(`/visitors/${visitorId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myVisitorRequests'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
    },
  });
};
