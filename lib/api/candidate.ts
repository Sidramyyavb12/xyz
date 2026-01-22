import axiosInstance from '@/lib/axios';

// Type definitions
export interface CandidateProfile {
  id: string;
  userId: string;
  currentDesignation: string;
  totalExperienceYears: number;
  expectedSalary: number;
  availabilityStatus: 'OPEN_TO_OPPORTUNITIES' | 'ACTIVELY_LOOKING' | 'NOT_LOOKING';
  workTypePreference: 'REMOTE' | 'ONSITE' | 'HYBRID';
  profileCompletion?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCandidateProfilePayload {
  currentDesignation: string;
  totalExperienceYears: number;
  expectedSalary: number;
  availabilityStatus: 'OPEN_TO_OPPORTUNITIES' | 'ACTIVELY_LOOKING' | 'NOT_LOOKING';
  workTypePreference: 'REMOTE' | 'ONSITE' | 'HYBRID';
}

// Candidate API calls
export const candidateAPI = {
  // Get candidate profile by user ID
  getProfileByUserId: async (userId: string): Promise<CandidateProfile> => {
    const response = await axiosInstance.get(`/api/candidates/profile/user/${userId}`);
    return response.data;
  },

  // Create candidate profile
  createProfile: async (payload: CreateCandidateProfilePayload): Promise<CandidateProfile> => {
    const response = await axiosInstance.post('/api/candidates/profile', payload);
    return response.data;
  },

  // Update candidate profile
  updateProfile: async (payload: Partial<CreateCandidateProfilePayload>): Promise<CandidateProfile> => {
    const response = await axiosInstance.put('/api/candidates/profile', payload);
    return response.data;
  },
};
