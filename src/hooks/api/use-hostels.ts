import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export const useHostels = () => {
  return useQuery({
    queryKey: ['hostels'],
    queryFn: async () => apiClient.get('/hostels'),
    staleTime: 2 * 60 * 1000,
  });
};

export const useCreateHostel = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => apiClient.post('/hostels', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hostels'] });
    },
  });
};

