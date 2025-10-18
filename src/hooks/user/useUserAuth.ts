import { useDispatch, useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";
import type { UserRootState, UserAppDispatch } from "@/store/user";

// User-specific typed hooks
export const useUserAppDispatch: () => UserAppDispatch = useDispatch;
export const useUserAppSelector: TypedUseSelectorHook<UserRootState> =
  useSelector;
