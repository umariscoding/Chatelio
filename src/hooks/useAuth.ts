// Custom auth hook - will be implemented in Day 1
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

export const useAuth = () => {
  const auth = useSelector((state: RootState) => state.auth);
  
  return {
    user: auth.user,
    company: auth.company,
    isAuthenticated: auth.isAuthenticated,
    userType: auth.userType,
    loading: auth.loading,
    error: auth.error,
  };
};

export default useAuth;
