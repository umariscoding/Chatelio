import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import type { CompanyRootState, CompanyAppDispatch } from '@/store/company';

// Company-specific typed hooks
export const useCompanyAppDispatch: () => CompanyAppDispatch = useDispatch;
export const useCompanyAppSelector: TypedUseSelectorHook<CompanyRootState> = useSelector;

