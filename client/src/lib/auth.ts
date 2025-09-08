// Authentication and access control utilities

export interface AuthUser {
  phoneNumber: string;
  grade: string;
  isAuthenticated: boolean;
  signInDate: string;
  accessLevel: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  phoneNumber?: string;
  grade?: string;
  loginTime?: string;
}

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  try {
    const authData = localStorage.getItem('stemquest_auth');
    if (!authData) return false;
    
    const auth: AuthState = JSON.parse(authData);
    return auth.isAuthenticated === true;
  } catch {
    return false;
  }
};

// Get current user data
export const getCurrentUser = (): AuthUser | null => {
  try {
    const userData = localStorage.getItem('stemquest_user');
    if (!userData) return null;
    
    const user: AuthUser = JSON.parse(userData);
    return user.isAuthenticated ? user : null;
  } catch {
    return null;
  }
};

// Get user's authorized grade
export const getUserGrade = (): string | null => {
  const user = getCurrentUser();
  return user?.accessLevel || null;
};

// Check if user has access to a specific grade
export const hasGradeAccess = (requestedGrade: string): boolean => {
  const userGrade = getUserGrade();
  return userGrade === requestedGrade;
};

// Redirect to sign-in if not authenticated
export const requireAuth = (): boolean => {
  if (!isAuthenticated()) {
    window.location.href = '/signin';
    return false;
  }
  return true;
};

// Check grade access and redirect if unauthorized
export const requireGradeAccess = (requestedGrade: string): boolean => {
  if (!isAuthenticated()) {
    window.location.href = '/signin';
    return false;
  }
  
  if (!hasGradeAccess(requestedGrade)) {
    const userGrade = getUserGrade();
    if (userGrade) {
      // Redirect to user's authorized grade
      window.location.href = `/dashboard/${userGrade}`;
    } else {
      window.location.href = '/signin';
    }
    return false;
  }
  
  return true;
};

// Sign out user
export const signOut = (): void => {
  localStorage.removeItem('stemquest_auth');
  localStorage.removeItem('stemquest_user');
  window.location.href = '/signin';
};

// Get available grade options (for admin or selection purposes)
export const getGradeOptions = () => [
  {
    id: "6-8",
    name: "Middle School",
    description: "Grades 6-8",
  },
  {
    id: "9-10", 
    name: "High School",
    description: "Grades 9-10",
  },
  {
    id: "11-12",
    name: "Senior High", 
    description: "Grades 11-12",
  }
];

// Validate grade ID
export const isValidGrade = (gradeId: string): boolean => {
  const validGrades = ["6-8", "9-10", "11-12"];
  return validGrades.includes(gradeId);
};
