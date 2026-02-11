
import * as React from "react";
import { User, ViewState } from "./App";

interface ProtectedRouteProps {
  user: User | null;
  requiredRole?: 'user' | 'admin';
  fallbackView: ViewState;
  onNavigate: (view: ViewState) => void;
  children: React.ReactNode;
}

/**
 * A wrapper component to protect views based on authentication and user roles.
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  user, 
  requiredRole, 
  fallbackView, 
  onNavigate, 
  children 
}) => {
  React.useEffect(() => {
    // If user is not logged in
    if (!user) {
      onNavigate('auth');
      return;
    }

    // If a specific role is required (like admin)
    if (requiredRole && user.role !== requiredRole) {
      onNavigate(fallbackView);
      return;
    }
  }, [user, requiredRole, fallbackView, onNavigate]);

  // If unauthorized, return null while the effect handles navigation
  if (!user || (requiredRole && user.role !== requiredRole)) {
    return null;
  }

  return <>{children}</>;
};
