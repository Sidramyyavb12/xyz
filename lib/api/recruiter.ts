import axiosInstance from '@/lib/axios';

// Type definitions
export interface RecruiterProfile {
  id: string;
  userId: string;
  companyName: string;
  recruiterType: 'INTERNAL' | 'EXTERNAL' | 'AGENCY';
  designation: string;
  isVerified?: boolean;
  verificationStatus?: 'PENDING' | 'VERIFIED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
}

export interface CreateRecruiterProfilePayload {
  companyName: string;
  recruiterType: 'INTERNAL' | 'EXTERNAL' | 'AGENCY';
  designation: string;
}

// Recruiter API calls
export const recruiterAPI = {
  // Get recruiter profile by user ID
  getProfileByUserId: async (userId: string): Promise<RecruiterProfile> => {
    const response = await axiosInstance.get(`/api/recruiters/profile/user/${userId}`);
    return response.data;
  },

  // Create recruiter profile
  createProfile: async (payload: CreateRecruiterProfilePayload): Promise<RecruiterProfile> => {
    const response = await axiosInstance.post('/api/recruiters/profile', payload);
    return response.data;
  },

  // Update recruiter profile
  updateProfile: async (payload: Partial<CreateRecruiterProfilePayload>): Promise<RecruiterProfile> => {
    const response = await axiosInstance.put('/api/recruiters/profile', payload);
    return response.data;
  },
};
