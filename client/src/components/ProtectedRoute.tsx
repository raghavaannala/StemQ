import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { isAuthenticated, requireGradeAccess, getCurrentUser } from "@/lib/auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireGrade?: string;
  fallbackPath?: string;
}

export default function ProtectedRoute({ 
  children, 
  requireGrade, 
  fallbackPath = "/signin" 
}: ProtectedRouteProps) {
  const [location, setLocation] = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    const checkAccess = () => {
      // Check if user is authenticated
      if (!isAuthenticated()) {
        setLocation("/signin");
        return;
      }

      // If specific grade access is required
      if (requireGrade) {
        if (!requireGradeAccess(requireGrade)) {
          // User will be redirected by requireGradeAccess function
          return;
        }
      }

      setHasAccess(true);
      setIsChecking(false);
    };

    checkAccess();
  }, [requireGrade, setLocation]);

  // Show loading while checking authentication
  if (isChecking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Render children if user has access
  if (hasAccess) {
    return <>{children}</>;
  }

  // This shouldn't render as user should be redirected
  return null;
}
