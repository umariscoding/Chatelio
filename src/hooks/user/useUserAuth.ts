import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import type { UserRootState, UserAppDispatch } from '@/store/user';

// User-specific typed hooks
export const useUserAppDispatch: () => UserAppDispatch = useDispatch;
export const useUserAppSelector: TypedUseSelectorHook<UserRootState> = useSelector;

// Convenience hook for user auth
export const useUserAuth = () => {
  const userAuth = useUserAppSelector((state) => state.userAuth);
  const dispatch = useUserAppDispatch();
  
  return {
    user: userAuth.user,
    tokens: userAuth.tokens,
    isAuthenticated: userAuth.isAuthenticated,
    loading: userAuth.loading,
    error: userAuth.error,
    dispatch,
  };
};

