import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { User, Tokens } from "@/types/auth";

interface UserAuthState {
  user: User | null;
  tokens: Tokens | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: UserAuthState = {
  user: null,
  tokens: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const userAuthSlice = createSlice({
  name: "userAuth",
  initialState,
  reducers: {
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.tokens = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;

      localStorage.removeItem("user_access_token");
      localStorage.removeItem("user_refresh_token");
      localStorage.removeItem("user_data");
    },
    setUserData: (
      state,
      action: PayloadAction<{ user: User; tokens: Tokens }>,
    ) => {
      state.user = action.payload.user;
      state.tokens = action.payload.tokens;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;

      localStorage.setItem(
        "user_access_token",
        action.payload.tokens.access_token,
      );
      localStorage.setItem(
        "user_refresh_token",
        action.payload.tokens.refresh_token,
      );
      localStorage.setItem("user_data", JSON.stringify(action.payload.user));
    },
    loadFromStorage: (state) => {
      const accessToken = localStorage.getItem("user_access_token");
      const refreshToken = localStorage.getItem("user_refresh_token");
      const userData = localStorage.getItem("user_data");

      if (accessToken && refreshToken) {
        state.tokens = {
          access_token: accessToken,
          refresh_token: refreshToken,
          token_type: "bearer",
        };
        state.isAuthenticated = true;

        if (userData) {
          try {
            state.user = JSON.parse(userData);
          } catch (error) {
            console.warn("Failed to parse stored user data:", error);
          }
        }
      }
    },
  },
});

export const { logout, setUserData, loadFromStorage, setError, clearError, setLoading } = userAuthSlice.actions;

export default userAuthSlice.reducer;
