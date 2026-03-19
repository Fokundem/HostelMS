import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { monthNumberToName, normalizePaymentType, normalizeStatus } from '@/lib/normalize';

// ============ Payment Hooks ============

export const useMyPayments = () => {
  return useQuery({
    queryKey: ['myPayments'],
    queryFn: async () => {
      const rows = await apiClient.get('/payments/student/my-payments');
      return (rows || []).map((p: any) => ({
        id: p.id,
        studentId: p.studentId,
        studentName: p.studentName || '', // backend doesn't include; student view doesn't need it
        amount: p.amount,
        status: normalizeStatus(p.status),
        type: normalizePaymentType(p.type),
        method: normalizeStatus(p.method),
        proofImageUrl: p.proofImageUrl,
        rejectionReason: p.rejectionReason,
        reviewedAt: p.reviewedAt,
        reviewedBy: p.reviewedBy,
        month: monthNumberToName(p.month),
        year: p.year,
        paidAt: p.paidAt,
        createdAt: p.createdAt,
      }));
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
      const rows = await apiClient.get(url);
      return (rows || []).map((p: any) => ({
        id: p.id,
        studentId: p.studentId,
        studentName: p.studentName || '',
        amount: p.amount,
        status: normalizeStatus(p.status),
        type: normalizePaymentType(p.type),
        method: normalizeStatus(p.method),
        proofImageUrl: p.proofImageUrl,
        rejectionReason: p.rejectionReason,
        reviewedAt: p.reviewedAt,
        reviewedBy: p.reviewedBy,
        month: monthNumberToName(p.month),
        year: p.year,
        paidAt: p.paidAt,
        createdAt: p.createdAt,
      }));
    },
    staleTime: 2 * 60 * 1000,
  });
};

export const useSubmitPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: FormData) => apiClient.postForm('/payments/student/submit', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myPayments'] });
      queryClient.invalidateQueries({ queryKey: ['paymentSummary'] });
      queryClient.invalidateQueries({ queryKey: ['allPayments'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
    },
  });
};

export const useReviewPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      paymentId,
      status,
      rejectionReason,
    }: {
      paymentId: string;
      status: 'APPROVED' | 'REJECTED' | 'PAID';
      rejectionReason?: string;
    }) => apiClient.put(`/payments/${paymentId}/review`, { status, rejectionReason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myPayments'] });
      queryClient.invalidateQueries({ queryKey: ['paymentSummary'] });
      queryClient.invalidateQueries({ queryKey: ['allPayments'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
    },
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
