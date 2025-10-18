import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { User, Tokens } from "@/types/auth";
import { userApi as api } from "@/utils/user/api";
import { API_CONFIG } from "@/constants/api";
import { resetChat } from "./chatSlice";

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

// Graceful User Token Verification (doesn't clear tokens on failure)
export const verifyUserTokenGraceful = createAsyncThunk(
  "userAuth/verifyGraceful",
  async (_, { getState }) => {
    try {
      const state = getState() as { userAuth: UserAuthState };
      const token =
        state.userAuth.tokens?.access_token ||
        localStorage.getItem("user_access_token");

      if (!token) {
        return { valid: false, reason: "No token found" };
      }

      // Use axios directly to avoid API interceptor token prioritization
      const response = await axios.get(`${API_CONFIG.BASE_URL}/auth/verify`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return { ...response.data, valid: true };
    } catch (error: any) {
      // Return failure info without throwing
      return {
        valid: false,
        reason:
          error.response?.data?.detail ||
          error.message ||
          "Token verification failed",
      };
    }
  },
);

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
    logout: (state) => {
      state.user = null;
      state.tokens = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;

      // Clear tokens and user data from localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("user_access_token");
        localStorage.removeItem("user_refresh_token");
        localStorage.removeItem("user_data");
      }
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

      // Store tokens in localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "user_access_token",
          action.payload.tokens.access_token,
        );
        localStorage.setItem(
          "user_refresh_token",
          action.payload.tokens.refresh_token,
        );
      }
    },
    // Load tokens and user data from storage
    loadFromStorage: (state) => {
      if (typeof window !== "undefined") {
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

          // Load complete user data if available
          if (userData) {
            try {
              state.user = JSON.parse(userData);
            } catch (error) {
              console.warn("Failed to parse stored user data:", error);
            }
          }
        }
      }
    },
  },
  extraReducers: (builder) => {
    // Graceful Token Verification (doesn't clear tokens on failure)
    builder
      .addCase(verifyUserTokenGraceful.pending, (state) => {
        state.loading = true;
      })
      .addCase(verifyUserTokenGraceful.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.valid) {
          state.isAuthenticated = true;
        } else {
          // Token is invalid but don't clear it - let the component handle it
          state.isAuthenticated = false;
        }
      })
      .addCase(verifyUserTokenGraceful.rejected, (state) => {
        state.loading = false;
        // Don't clear tokens on graceful verification failure
        state.isAuthenticated = false;
      });
  },
});

export const { logout, setUserData, loadFromStorage } = userAuthSlice.actions;

export default userAuthSlice.reducer;
