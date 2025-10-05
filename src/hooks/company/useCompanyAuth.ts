import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import type { CompanyRootState, CompanyAppDispatch } from '@/store/company';

// Company-specific typed hooks
export const useCompanyAppDispatch: () => CompanyAppDispatch = useDispatch;
export const useCompanyAppSelector: TypedUseSelectorHook<CompanyRootState> = useSelector;

// Convenience hook for company auth
export const useCompanyAuth = () => {
  const companyAuth = useCompanyAppSelector((state) => state.companyAuth);
  const dispatch = useCompanyAppDispatch();
  
  return {
    company: companyAuth.company,
    tokens: companyAuth.tokens,
    isAuthenticated: companyAuth.isAuthenticated,
    loading: companyAuth.loading,
    error: companyAuth.error,
    dispatch,
  };
};

