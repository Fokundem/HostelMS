import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

// ============ Dashboard Hooks ============

export const useDashboardStats = () => {
    return useQuery({
        queryKey: ['dashboardStats'],
        queryFn: async () => {
            return apiClient.get('/dashboard/stats');
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};
