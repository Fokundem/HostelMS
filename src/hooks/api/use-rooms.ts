import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

// ============ Room Hooks ============

export const useAvailableRooms = (hostelId?: string, floor?: string) => {
  // Build query string
  const queryParams = new URLSearchParams();
  if (hostelId) queryParams.append('hostel_id', hostelId);
  if (floor) queryParams.append('floor', floor);
  const queryString = queryParams.toString();

  return useQuery({
    queryKey: ['availableRooms', hostelId, floor],
    queryFn: async () => {
      const url = queryString ? `/rooms?${queryString}` : '/rooms';
      return apiClient.get(url);
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useAllRooms = (hostelId?: string) => {
  const queryParams = new URLSearchParams();
  if (hostelId) queryParams.append('hostel_id', hostelId);
  const queryString = queryParams.toString();

  return useQuery({
    queryKey: ['allRooms', hostelId],
    queryFn: async () => {
      const url = queryString ? `/rooms/all?${queryString}` : '/rooms/all';
      return apiClient.get(url);
    },
    staleTime: 2 * 60 * 1000,
  });
};

export const useRoomDetails = (roomId: string) => {
  return useQuery({
    queryKey: ['room', roomId],
    queryFn: async () => {
      return apiClient.get(`/rooms/${roomId}`);
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      hostelId,
      data,
    }: {
      hostelId: string;
      data: any;
    }) => {
      return apiClient.post(`/rooms?hostel_id=${hostelId}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['availableRooms'] });
      queryClient.invalidateQueries({ queryKey: ['allRooms'] });
    },
  });
};

export const useUpdateRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ roomId, data }: { roomId: string; data: any }) => {
      return apiClient.put(`/rooms/${roomId}`, data);
    },
    onSuccess: (_, { roomId }) => {
      queryClient.invalidateQueries({ queryKey: ['room', roomId] });
      queryClient.invalidateQueries({ queryKey: ['availableRooms'] });
      queryClient.invalidateQueries({ queryKey: ['allRooms'] });
    },
  });
};

export const useDeleteRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (roomId: string) => {
      return apiClient.delete(`/rooms/${roomId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['availableRooms'] });
      queryClient.invalidateQueries({ queryKey: ['allRooms'] });
    },
  });
};
