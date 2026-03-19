import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api-client';
import { normalizeStatus } from '@/lib/normalize';

// ============ Room Allocation Hooks ============

export const useRequestRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (roomId: string) => {
      return apiClient.post('/allocations', { roomId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myAllocation'] });
      queryClient.invalidateQueries({ queryKey: ['allocations'] });
      queryClient.invalidateQueries({ queryKey: ['pendingAllocations'] });
      queryClient.invalidateQueries({ queryKey: ['availableRooms'] });
    },
  });
};

export const useMyAllocation = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['myAllocation'],
    queryFn: async () => {
      if (!user || user.role !== 'student') return null;
      return apiClient.get('/allocations/student/mine');
    },
    enabled: !!user && user.role === 'student',
    staleTime: 2 * 60 * 1000,
  });
};

export const useAllocations = (status?: string, hostelId?: string) => {
  const queryParams = new URLSearchParams();
  if (status) queryParams.append('status', status.toUpperCase());
  if (hostelId) queryParams.append('hostel_id', hostelId);
  const queryString = queryParams.toString();

  return useQuery({
    queryKey: ['allocations', status, hostelId],
    queryFn: async () => {
      const url = queryString ? `/allocations?${queryString}` : '/allocations';
      const rows = await apiClient.get(url);
      return (rows || []).map((a: any) => ({
        ...a,
        status: normalizeStatus(a.status),
        requestedAt: a.requestedAt,
        approvedAt: a.approvedAt,
      }));
    },
    staleTime: 2 * 60 * 1000,
  });
};

export const usePendingAllocations = (hostelId?: string) => {
  const queryParams = new URLSearchParams();
  if (hostelId) queryParams.append('hostel_id', hostelId);
  const queryString = queryParams.toString();

  return useQuery({
    queryKey: ['pendingAllocations', hostelId],
    queryFn: async () => {
      const url = queryString ? `/allocations/pending?${queryString}` : '/allocations/pending';
      const rows = await apiClient.get(url);
      return (rows || []).map((a: any) => ({
        ...a,
        status: normalizeStatus(a.status),
        requestedAt: a.requestedAt,
      }));
    },
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

export const useAllocationDetails = (allocationId: string) => {
  return useQuery({
    queryKey: ['allocation', allocationId],
    queryFn: async () => {
      return apiClient.get(`/allocations/${allocationId}`);
    },
    staleTime: 2 * 60 * 1000,
  });
};

export const useApproveAllocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (allocationId: string) => {
      return apiClient.put(`/allocations/${allocationId}/approve`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allocations'] });
      queryClient.invalidateQueries({ queryKey: ['pendingAllocations'] });
      queryClient.invalidateQueries({ queryKey: ['myAllocation'] });
      queryClient.invalidateQueries({ queryKey: ['availableRooms'] });
    },
  });
};

export const useRejectAllocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      allocationId,
      reason,
    }: {
      allocationId: string;
      reason: string;
    }) => {
      return apiClient.put(
        `/allocations/${allocationId}/reject?reason=${encodeURIComponent(reason)}`,
        {}
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allocations'] });
      queryClient.invalidateQueries({ queryKey: ['pendingAllocations'] });
      queryClient.invalidateQueries({ queryKey: ['myAllocation'] });
      queryClient.invalidateQueries({ queryKey: ['availableRooms'] });
    },
  });
};
