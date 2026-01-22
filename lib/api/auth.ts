import axiosInstance from '@/lib/axios';

// Type definitions
export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: 'LEARNER' | 'INSTRUCTOR' | 'CANDIDATE' | 'RECRUITER';
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    roles: string[];
  };
}

export interface UserMeResponse {
  id: string;
  name: string;
  email: string;
  roles: string[];
  primaryRole: 'LEARNER' | 'INSTRUCTOR' | 'CANDIDATE' | 'RECRUITER';
  instructorRating?: number | null;
  createdAt: string;
  updatedAt: string;
}

// Auth API calls
export const authAPI = {
  // Register new user
  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    const response = await axiosInstance.post('/api/auth/register', payload);
    return response.data;
  },

  // Login user
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const response = await axiosInstance.post('/api/auth/login', payload);
    return response.data;
  },

  // Get current user details (decision API)
  getUserMe: async (): Promise<UserMeResponse> => {
    const response = await axiosInstance.get('/api/users/me');
    return response.data;
  },

  // Refresh token
  refreshToken: async (refreshToken: string): Promise<{ token: string; refreshToken: string }> => {
    const response = await axiosInstance.post('/api/auth/refresh', { refreshToken });
    return response.data;
  },

  // Logout
  logout: async (): Promise<void> => {
    // Clear local storage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  },
};
