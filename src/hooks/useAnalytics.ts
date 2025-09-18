import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '@/store';
import { fetchDashboardAnalytics, clearError, resetAnalytics } from '@/store/slices/analyticsSlice';

export const useAnalytics = () => {
  const dispatch = useDispatch<AppDispatch>();
  const analytics = useSelector((state: RootState) => state.analytics);

  const loadDashboardAnalytics = useCallback(async () => {
    // Check if data is fresh (less than 5 minutes old)
    const isDataFresh = analytics.lastFetched && 
      (Date.now() - analytics.lastFetched) < 5 * 60 * 1000;
    
    if (analytics.dashboard && isDataFresh && !analytics.error) {
      return; // Use cached data
    }

    // Fetch fresh data
    dispatch(fetchDashboardAnalytics());
  }, [analytics, dispatch]);

  const refreshAnalytics = useCallback(() => {
    dispatch(fetchDashboardAnalytics());
  }, [dispatch]);

  const clearAnalyticsError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const resetAnalyticsData = useCallback(() => {
    dispatch(resetAnalytics());
  }, [dispatch]);

  return {
    // Data
    dashboard: analytics.dashboard,
    loading: analytics.loading,
    error: analytics.error,
    lastFetched: analytics.lastFetched,
    
    // Actions
    loadDashboardAnalytics,
    refreshAnalytics,
    clearAnalyticsError,
    resetAnalyticsData,
    
    // Computed values
    isDataFresh: analytics.lastFetched && (Date.now() - analytics.lastFetched) < 5 * 60 * 1000,
    hasData: !!analytics.dashboard,
  };
};
