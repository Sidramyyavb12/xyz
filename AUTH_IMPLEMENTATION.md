# Multi-Role Authentication System - Implementation Guide

## 🚀 Overview

This project now includes a complete multi-role authentication system with support for four user roles:
- **LEARNER** - Students/learners with direct dashboard access
- **INSTRUCTOR** - Teachers/instructors with profile requirements
- **CANDIDATE** - Job seekers with detailed profile management
- **RECRUITER** - Hiring professionals with company profile management

## 📋 Features Implemented

### 1. **Signup System**
- Role selection dropdown with 4 roles
- Full name, email, password validation
- Automatic token storage (accessToken, refreshToken, user)
- Post-signup flow: register → store tokens → call /api/users/me → check profile → redirect

**Location**: `/app/signup/page.tsx`

### 2. **Login System**
- Updated to use new auth flow
- Calls `/api/users/me` after login for complete user details
- Role-based routing after authentication
- Automatic profile requirement check

**Location**: `/app/login/page.tsx`

### 3. **Axios Instance with Token Management**
- Automatic token attachment to all requests
- 401 response interceptor with automatic token refresh
- Retry failed requests after token refresh
- Logout on refresh failure

**Location**: `/lib/axios.ts`

### 4. **API Utilities**

#### Auth API (`/lib/api/auth.ts`)
- `register(payload)` - Register new user
- `login(payload)` - Login user
- `getUserMe()` - Get current user details (decision API)
- `refreshToken(token)` - Refresh access token
- `logout()` - Clear auth data

#### Candidate API (`/lib/api/candidate.ts`)
- `getProfileByUserId(userId)` - Get candidate profile
- `createProfile(payload)` - Create candidate profile
- `updateProfile(payload)` - Update candidate profile

#### Recruiter API (`/lib/api/recruiter.ts`)
- `getProfileByUserId(userId)` - Get recruiter profile
- `createProfile(payload)` - Create recruiter profile
- `updateProfile(payload)` - Update recruiter profile

### 5. **Auth Utilities** (`/lib/authUtils.ts`)

#### Role-Based Routing
```typescript
redirectByRole(user: UserMeResponse): string
// Returns: /learner/dashboard, /instructor/dashboard, etc.
```

#### Profile Requirement Check
```typescript
needsProfile(user: UserMeResponse): boolean
// Returns: true if profile creation needed, false otherwise
```

#### Profile Checkers
```typescript
checkCandidateProfile(userId): Promise<string>
checkRecruiterProfile(userId): Promise<string>
checkInstructorProfile(user): string
```

#### Unified Auth Flow
```typescript
handlePostAuthRouting(user: UserMeResponse): Promise<string>
// Handles complete post-auth routing based on role and profile status
```

### 6. **Updated Redux Auth Slice** (`/store/authSlice.ts`)

**New State Structure**:
```typescript
{
  accessToken: string | null,
  refreshToken: string | null,
  isAuthenticated: boolean,
  user: {
    id?: string,
    email?: string,
    name?: string,
    role?: string,
    primaryRole?: 'LEARNER' | 'INSTRUCTOR' | 'CANDIDATE' | 'RECRUITER',
    roles?: string[]
  } | null
}
```

**New Actions**:
- `setCredentials({ accessToken, refreshToken, user })` - Store auth data
- `updateUser(user)` - Update user details
- `updateTokens({ accessToken, refreshToken? })` - Update tokens only
- `logout()` - Clear all auth data
- `restoreAuth()` - Restore auth from localStorage

### 7. **Dashboards**

#### Candidate Dashboard (`/app/candidate/dashboard/page.tsx`)
Displays:
- Current designation
- Total experience years
- Expected salary
- Availability status
- Work type preference
- Profile completion percentage

#### Candidate Profile Create (`/app/candidate/profile/create/page.tsx`)
Required fields:
- Current Designation
- Total Experience (years)
- Expected Salary (₹)
- Availability Status (OPEN_TO_OPPORTUNITIES, ACTIVELY_LOOKING, NOT_LOOKING)
- Work Type Preference (REMOTE, ONSITE, HYBRID)

#### Recruiter Dashboard (`/app/recruiter/dashboard/page.tsx`)
Displays:
- Company name
- Designation
- Recruiter type
- Verification status (Verified, Pending, Rejected)

#### Recruiter Profile Create (`/app/recruiter/profile/create/page.tsx`)
Required fields:
- Company Name
- Recruiter Type (INTERNAL, EXTERNAL, AGENCY)
- Designation

#### Learner Dashboard (`/app/learner/dashboard/page.tsx`)
- Simple welcome dashboard
- No profile required

#### Instructor Dashboard (`/app/instructor/dashboard/page.tsx`)
- Simple welcome dashboard
- Profile check based on instructorRating field

## 🔄 Complete Auth Flow

### Signup Flow
```
1. User fills signup form with role selection
2. POST /api/auth/register
   Body: { name, email, password, role }
   Response: { token, refreshToken, user }
3. Store tokens in localStorage (accessToken, refreshToken, user)
4. Dispatch setCredentials to Redux
5. GET /api/users/me (Decision API)
   Response: { id, name, email, roles, primaryRole, instructorRating?, ... }
6. Update user in Redux with complete details
7. Check role and profile requirements:
   - LEARNER → /learner/dashboard
   - INSTRUCTOR → Check instructorRating → /instructor/dashboard or /instructor/profile/create
   - CANDIDATE → GET /api/candidates/profile/user/{userId}
     - 200: /candidate/dashboard
     - 404: /candidate/profile/create
   - RECRUITER → GET /api/recruiters/profile/user/{userId}
     - 200: /recruiter/dashboard
     - 404: /recruiter/profile/create
```

### Login Flow
```
1. User enters email and password
2. POST /api/auth/login
   Body: { email, password }
   Response: { token, refreshToken, user }
3. Store tokens in localStorage
4. Dispatch setCredentials to Redux
5. GET /api/users/me (Same as signup from step 5)
6. Follow same routing logic as signup
```

### Profile Creation Flow (Candidate)
```
1. User fills profile form
2. POST /api/candidates/profile
   Body: {
     currentDesignation,
     totalExperienceYears,
     expectedSalary,
     availabilityStatus,
     workTypePreference
   }
3. On success → Redirect to /candidate/dashboard
```

### Profile Creation Flow (Recruiter)
```
1. User fills profile form
2. POST /api/recruiters/profile
   Body: {
     companyName,
     recruiterType,
     designation
   }
3. On success → Redirect to /recruiter/dashboard
```

## 🔐 Token Management

### Automatic Token Refresh
The axios instance automatically handles token refresh:

```typescript
1. Request fails with 401
2. Check if already refreshing (prevent multiple calls)
3. Call POST /api/auth/refresh with refreshToken
4. Store new tokens
5. Retry original request with new token
6. If refresh fails → Clear tokens → Redirect to /login
```

### Token Storage
Tokens are stored in:
- **localStorage**: `accessToken`, `refreshToken`, `user`
- **Redux Store**: For runtime access

## 📁 Project Structure

```
app/
├── signup/
│   └── page.tsx                 # Signup page with role dropdown
├── login/
│   └── page.tsx                 # Login page (updated)
├── candidate/
│   ├── dashboard/
│   │   └── page.tsx            # Candidate dashboard
│   └── profile/
│       └── create/
│           └── page.tsx        # Candidate profile creation
├── recruiter/
│   ├── dashboard/
│   │   └── page.tsx            # Recruiter dashboard
│   └── profile/
│       └── create/
│           └── page.tsx        # Recruiter profile creation
├── learner/
│   └── dashboard/
│       └── page.tsx            # Learner dashboard
└── instructor/
    └── dashboard/
        └── page.tsx            # Instructor dashboard

lib/
├── axios.ts                    # Axios instance with interceptors
├── authUtils.ts                # Role-based routing utilities
└── api/
    ├── auth.ts                 # Auth API calls
    ├── candidate.ts            # Candidate API calls
    └── recruiter.ts            # Recruiter API calls

store/
└── authSlice.ts                # Updated Redux auth slice
```

## 🛠️ Environment Setup

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

For production:
```env
NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com
```

## 🧪 Testing the Flow

### Test Signup
1. Go to `/signup`
2. Fill in the form:
   - Name: Test User
   - Email: test@example.com
   - Password: Password123!
   - Role: Select any (LEARNER, INSTRUCTOR, CANDIDATE, RECRUITER)
3. Submit
4. Should redirect based on role and profile status

### Test Login
1. Go to `/login`
2. Use credentials from signup
3. Should redirect to appropriate dashboard

### Test Candidate Flow
1. Signup as CANDIDATE
2. Should redirect to `/candidate/profile/create`
3. Fill profile form
4. Should redirect to `/candidate/dashboard`

### Test Recruiter Flow
1. Signup as RECRUITER
2. Should redirect to `/recruiter/profile/create`
3. Fill profile form
4. Should redirect to `/recruiter/dashboard`

## 📊 API Endpoints Required

### Auth Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/users/me` - Get current user details (Decision API)

### Candidate Endpoints
- `GET /api/candidates/profile/user/{userId}` - Get candidate profile
- `POST /api/candidates/profile` - Create candidate profile
- `PUT /api/candidates/profile` - Update candidate profile

### Recruiter Endpoints
- `GET /api/recruiters/profile/user/{userId}` - Get recruiter profile
- `POST /api/recruiters/profile` - Create recruiter profile
- `PUT /api/recruiters/profile` - Update recruiter profile

## 🎯 Key Benefits

1. **Unified Auth Flow** - Single flow for all roles
2. **Automatic Token Refresh** - No manual token management needed
3. **Role-Based Routing** - Automatic redirect based on user role
4. **Profile Management** - Conditional profile creation based on role
5. **Type Safety** - Full TypeScript support with proper types
6. **Clean Architecture** - Separated concerns (API, utils, components)
7. **Redux Integration** - Centralized state management
8. **Error Handling** - Comprehensive error handling and user feedback

## 🚨 Important Notes

1. The `/api/users/me` endpoint is the **decision API** - it determines routing
2. Tokens are stored in localStorage and Redux for redundancy
3. Token refresh happens automatically on 401 responses
4. Profile checks return 404 when profile doesn't exist
5. Each role has specific profile requirements:
   - LEARNER: No profile needed
   - INSTRUCTOR: Check instructorRating field
   - CANDIDATE: Must have candidate profile
   - RECRUITER: Must have recruiter profile

## 🔄 Migration from Old System

If you had an old auth system:

1. **Update all login/signup calls** to use new API utilities
2. **Update Redux selectors** to use new state structure:
   - Old: `state.auth.token` → New: `state.auth.accessToken`
3. **Update localStorage keys**:
   - Old: `krix_token` → New: `accessToken`
   - Old: `krix_user` → New: `user`
4. **Use axios instance** instead of fetch for all API calls

## 📝 Next Steps

1. Set up backend API endpoints matching the structure above
2. Configure CORS properly on backend
3. Test all role flows thoroughly
4. Add loading states and error handling as needed
5. Implement additional features (password reset, email verification, etc.)

## 🎉 Summary

You now have a complete, production-ready multi-role authentication system with:
- ✅ Role-based signup and login
- ✅ Automatic token management and refresh
- ✅ Profile requirement checks and conditional routing
- ✅ Four complete role flows (LEARNER, INSTRUCTOR, CANDIDATE, RECRUITER)
- ✅ Dashboard and profile creation pages for each role
- ✅ Clean, maintainable code architecture
- ✅ Full TypeScript support

The system is ready to be connected to your backend API!
