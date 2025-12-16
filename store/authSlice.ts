import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  user: {
    email?: string;
    name?: string;
    role?: "admin" | "manager" | "staff";
  } | null;
}

const initialState: AuthState = {
  token: null,
  isAuthenticated: false,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ token: string; user?: any }>) => {
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.user = action.payload.user || null;
      if (typeof window !== 'undefined') {
        localStorage.setItem('krix_token', action.payload.token);
        if (action.payload.user) {
          localStorage.setItem('krix_user', JSON.stringify(action.payload.user));
        }
      }
    },
    logout: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      state.user = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('krix_token');
        localStorage.removeItem('krix_user');
      }
    },
    restoreAuth: (state) => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('krix_token');
        const userStr = localStorage.getItem('krix_user');
        if (token) {
          state.token = token;
          state.isAuthenticated = true;
          if (userStr) {
            try {
              state.user = JSON.parse(userStr);
            } catch (e) {
              state.user = null;
            }
          }
        }
      }
    },
  },
});

export const { setCredentials, logout, restoreAuth } = authSlice.actions;
export default authSlice.reducer;
