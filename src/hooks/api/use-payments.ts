import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

// ============ Payment Hooks ============

export const useMyPayments = () => {
  return useQuery({
    queryKey: ['myPayments'],
    queryFn: async () => {
      return apiClient.get('/payments/student/my-payments');
    },
    staleTime: 2 * 60 * 1000,
  });
};

export const usePaymentSummary = () => {
  return useQuery({
    queryKey: ['paymentSummary'],
    queryFn: async () => {
      return apiClient.get('/payments/student/summary');
    },
    staleTime: 2 * 60 * 1000,
  });
};

export const useAllPayments = (status?: string) => {
  const queryParams = new URLSearchParams();
  if (status) queryParams.append('status', status);
  const queryString = queryParams.toString();

  return useQuery({
    queryKey: ['allPayments', status],
    queryFn: async () => {
      const url = queryString ? `/payments?${queryString}` : '/payments';
      return apiClient.get(url);
    },
    staleTime: 2 * 60 * 1000,
  });
};

export const useCreatePayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      studentId,
      data,
    }: {
      studentId: string;
      data: any;
    }) => {
      return apiClient.post(`/payments/${studentId}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allPayments'] });
      queryClient.invalidateQueries({ queryKey: ['myPayments'] });
      queryClient.invalidateQueries({ queryKey: ['paymentSummary'] });
    },
  });
};

export const useMarkPaymentPaid = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (paymentId: string) => {
      return apiClient.put(`/payments/${paymentId}/mark-paid`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myPayments'] });
      queryClient.invalidateQueries({ queryKey: ['paymentSummary'] });
      queryClient.invalidateQueries({ queryKey: ['allPayments'] });
    },
  });
};
