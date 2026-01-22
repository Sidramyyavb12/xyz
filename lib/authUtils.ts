import { UserMeResponse } from './api/auth';
import { candidateAPI } from './api/candidate';
import { recruiterAPI } from './api/recruiter';

/**
 * Role-based routing logic
 * Returns the dashboard route for a given user role
 */
export function redirectByRole(user: UserMeResponse): string {
  const role = user.primaryRole;

  const roleRoutes: Record<string, string> = {
    LEARNER: '/learner/dashboard',
    INSTRUCTOR: '/instructor/dashboard',
    CANDIDATE: '/candidate/dashboard',
    RECRUITER: '/recruiter/dashboard',
  };

  return roleRoutes[role] || '/dashboard';
}

/**
 * Profile requirement check
 * Determines if a user needs to complete their profile
 */
export function needsProfile(user: UserMeResponse): boolean {
  switch (user.primaryRole) {
    case 'LEARNER':
      return false; // Learners don't need profile

    case 'INSTRUCTOR':
      // Instructor needs profile if rating is null
      return user.instructorRating === null;

    case 'CANDIDATE':
    case 'RECRUITER':
      // Candidate and Recruiter always need profile check
      return true;

    default:
      return false;
  }
}

/**
 * Check if candidate profile exists
 * Returns the appropriate redirect path
 */
export async function checkCandidateProfile(userId: string): Promise<string> {
  try {
    await candidateAPI.getProfileByUserId(userId);
    // Profile exists, go to dashboard
    return '/candidate/dashboard';
  } catch (error: any) {
    // Check if it's a 404 (profile not found)
    if (error.response?.status === 404) {
      return '/candidate/profile/create';
    }
    // Other errors, still go to profile create
    return '/candidate/profile/create';
  }
}

/**
 * Check if recruiter profile exists
 * Returns the appropriate redirect path
 */
export async function checkRecruiterProfile(userId: string): Promise<string> {
  try {
    await recruiterAPI.getProfileByUserId(userId);
    // Profile exists, go to dashboard
    return '/recruiter/dashboard';
  } catch (error: any) {
    // Check if it's a 404 (profile not found)
    if (error.response?.status === 404) {
      return '/recruiter/profile/create';
    }
    // Other errors, still go to profile create
    return '/recruiter/profile/create';
  }
}

/**
 * Check if instructor profile exists
 * For instructor, we check the instructorRating field
 */
export function checkInstructorProfile(user: UserMeResponse): string {
  if (user.instructorRating === null) {
    return '/instructor/profile/create';
  }
  return '/instructor/dashboard';
}

/**
 * Unified auth flow
 * Handles post-login/signup routing based on user role and profile status
 */
export async function handlePostAuthRouting(user: UserMeResponse): Promise<string> {
  const role = user.primaryRole;

  switch (role) {
    case 'LEARNER':
      // Learners go directly to dashboard
      return '/learner/dashboard';

    case 'INSTRUCTOR':
      // Check if instructor has completed profile
      return checkInstructorProfile(user);

    case 'CANDIDATE':
      // Check if candidate profile exists
      return await checkCandidateProfile(user.id);

    case 'RECRUITER':
      // Check if recruiter profile exists
      return await checkRecruiterProfile(user.id);

    default:
      // Fallback to generic dashboard
      return '/dashboard';
  }
}

/**
 * Store auth data in localStorage
 */
export function storeAuthData(
  accessToken: string,
  refreshToken: string,
  user: any
): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(user));
  }
}

/**
 * Clear auth data from localStorage
 */
export function clearAuthData(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }
}

/**
 * Get stored user data
 */
export function getStoredUser(): any | null {
  if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
  }
  return null;
}
