import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient, setAuthToken, removeAuthToken, getAuthToken } from '@/lib/api-client';

// ============ Auth Hooks ============

export const useRegister = () => {
  return useMutation({
    mutationFn: async (data: any) => {
      return apiClient.post('/auth/register', data);
    },
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await apiClient.post('/auth/login', data);
      if (response.access_token) {
        setAuthToken(response.access_token);
        queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      }
      return response;
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      await apiClient.post('/auth/logout', {});
      removeAuthToken();
      queryClient.clear();
    },
  });
};

export const useCurrentUser = () => {
  const token = getAuthToken();
  
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      if (!token) return null;
      return apiClient.get('/auth/me');
    },
    enabled: !!token,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: any) => {
      return apiClient.put('/auth/me', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
  });
};
