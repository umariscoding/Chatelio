import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '@/store';

// Typed hooks for Redux
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = <T>(selector: (state: RootState) => T) => useSelector(selector);

// Custom authentication hook
export const useAuth = () => {
  const companyAuth = useAppSelector((state) => state.companyAuth);
  const userAuth = useAppSelector((state) => state.userAuth);
  const dispatch = useAppDispatch();

  return {
    companyAuth,
    userAuth,
    isAuthenticated: companyAuth.isAuthenticated || userAuth.isAuthenticated,
    dispatch,
  };
};

export default useAuth;
