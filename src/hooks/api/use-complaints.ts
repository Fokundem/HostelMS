import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { normalizeStatus } from '@/lib/normalize';

function normalizeComplaint(c: any) {
  return {
    ...c,
    status: normalizeStatus(c.status),
    priority: normalizeStatus(c.priority),
    category: normalizeStatus(c.category),
  };
}

export const useComplaints = (status?: string) => {
  const queryParams = new URLSearchParams();
  if (status) queryParams.append('status', status);
  const queryString = queryParams.toString();

  return useQuery({
    queryKey: ['complaints', status],
    queryFn: async () => {
      const url = queryString ? `/complaints?${queryString}` : '/complaints';
      const rows = await apiClient.get(url);
      return (rows || []).map(normalizeComplaint);
    },
    staleTime: 60 * 1000,
  });
};

export const useUpdateComplaint = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ complaintId, data }: { complaintId: string; data: any }) =>
      apiClient.put(`/complaints/${complaintId}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['complaints'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
    },
  });
};

export const useMyComplaints = () => {
  return useQuery({
    queryKey: ['myComplaints'],
    queryFn: async () => {
      const rows = await apiClient.get('/complaints/student/mine');
      return (rows || []).map(normalizeComplaint);
    },
    staleTime: 60 * 1000,
  });
};

export const useCreateComplaint = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => apiClient.post('/complaints', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myComplaints'] });
      queryClient.invalidateQueries({ queryKey: ['complaints'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
    },
  });
};

