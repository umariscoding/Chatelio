import { createAsyncThunk } from "@reduxjs/toolkit";
import { userApi } from "@/utils/api";
import { setUserData, setLoading, setError } from "../slices/userAuthSlice";
import type { User, Tokens } from "@/types/auth";

export const loginUserThunk = createAsyncThunk(
  "userAuth/login",
  async (credentials: { email: string; password: string }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      const response = await userApi.post("/users/login", credentials);
      const { user, tokens }: { user: User; tokens: Tokens } = response.data;
      dispatch(setUserData({ user, tokens }));
      return { user, tokens };
    } catch (error: any) {
      const errorMsg = error.response?.data?.detail || "Login failed";
      dispatch(setError(errorMsg));
      return rejectWithValue(errorMsg);
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const registerUserThunk = createAsyncThunk(
  "userAuth/register",
  async (
    data: { name: string; email: string; password: string; company_id: string },
    { dispatch, rejectWithValue }
  ) => {
    try {
      dispatch(setLoading(true));
      const response = await userApi.post("/users/register", data);
      const { user, tokens }: { user: User; tokens: Tokens } = response.data;
      dispatch(setUserData({ user, tokens }));
      return { user, tokens };
    } catch (error: any) {
      const errorMsg = error.response?.data?.detail || "Registration failed";
      dispatch(setError(errorMsg));
      return rejectWithValue(errorMsg);
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const createGuestTokenThunk = createAsyncThunk(
  "userAuth/createGuest",
  async (company_id: string, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      const response = await userApi.post("/users/guest/create", { company_id });
      const { user, tokens }: { user: User; tokens: Tokens } = response.data;
      dispatch(setUserData({ user, tokens }));
      return { user, tokens };
    } catch (error: any) {
      const errorMsg = error.response?.data?.detail || "Failed to create guest session";
      dispatch(setError(errorMsg));
      return rejectWithValue(errorMsg);
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const verifyTokenThunk = createAsyncThunk(
  "userAuth/verify",
  async (_, { rejectWithValue }) => {
    try {
      const response = await userApi.get("/auth/verify");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || "Token verification failed");
    }
  }
);
