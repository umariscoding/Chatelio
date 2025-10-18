"use client";

import React, { useEffect, useState } from "react";
import {
  useUserAppSelector,
  useUserAppDispatch,
} from "@/hooks/user/useUserAuth";
import { loadFromStorage } from "@/store/user/slices/userAuthSlice";

interface UserAuthProviderProps {
  children: React.ReactNode;
}

export const UserAuthProvider: React.FC<UserAuthProviderProps> = ({
  children,
}) => {
  const dispatch = useUserAppDispatch();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      // Load from storage
      dispatch(loadFromStorage());
      setIsInitialized(true);
    };

    initAuth();
  }, [dispatch]);

  // User auth provider doesn't block rendering - user auth is optional on public pages
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-primary">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return <>{children}</>;
};
