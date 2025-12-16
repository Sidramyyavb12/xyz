import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  user: {
    email?: string;
    name?: string;
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
      }
    },
    logout: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      state.user = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('krix_token');
      }
    },
    restoreAuth: (state) => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('krix_token');
        if (token) {
          state.token = token;
          state.isAuthenticated = true;
        }
      }
    },
  },
});

export const { setCredentials, logout, restoreAuth } = authSlice.actions;
export default authSlice.reducer;