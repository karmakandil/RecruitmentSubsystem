"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../stores/auth.store";
import { getPrimaryDashboard, hasRoleAccess } from "../utils/role-utils";

export const useAuth = () => {
  const store = useAuthStore();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Initialize auth state from localStorage
    if (!initialized) {
      store.initialize();
      setInitialized(true);
    }
  }, [initialized, store]);

  return store;
};

export const useRequireAuth = (
  requiredRole?: string | string[],
  redirectTo?: string,
  requiredUserType?: "employee" | "candidate"
) => {
  const router = useRouter();
  const { isAuthenticated, user, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false);

  // Wait for auth to initialize from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Check if auth data exists in localStorage
      const token = localStorage.getItem("auth_token");
      const userStr = localStorage.getItem("user");
      
      // Give a small delay to ensure zustand store has initialized
      const timer = setTimeout(() => {
        setAuthInitialized(true);
      }, 100);
      
      return () => clearTimeout(timer);
    } else {
      setAuthInitialized(true);
    }
  }, []);
  const [hasInitialized, setHasInitialized] = useState(false);

  // Ensure initialization runs
  useEffect(() => {
    const store = useAuthStore.getState();
    store.initialize();
    setHasInitialized(true);
  }, []);

  const hasRequiredRole = useMemo(() => {
    if (!requiredRole) return true;
    if (!user) return false;
    const roles = user.roles || [];
    
    // Convert roles to strings for comparison
    const userRoleStrings = roles.map((r) => String(r).toLowerCase().trim());
    
    if (Array.isArray(requiredRole)) {
      return requiredRole.some((r) => {
        const requiredRoleStr = String(r).toLowerCase().trim();
        return userRoleStrings.includes(requiredRoleStr);
      });
    }
    
    const requiredRoleStr = String(requiredRole).toLowerCase().trim();
    return userRoleStrings.includes(requiredRoleStr);
  }, [user, requiredRole]);

  useEffect(() => {
    // Wait for both loading to finish AND auth to be initialized
    if (!loading && authInitialized) {
      // Debug logging
      if (requiredRole) {
        console.log('🔍 Role Check:', {
          requiredRole,
          userRoles: user?.roles,
          isAuthenticated,
          hasRequiredRole,
          userType: user?.userType,
        });
      }
      
    // Wait for initialization to complete
    if (!hasInitialized) return;

    if (!loading) {
      if (!isAuthenticated) {
        console.log('❌ Not authenticated, redirecting to login');
        router.replace(redirectTo || "/auth/login");
        setIsLoading(false);
        return;
      }
      
      if (requiredRole && !hasRequiredRole) {
        console.log('❌ Missing required role, redirecting to dashboard');
      } else if (!hasRequiredRole) {
        // Debug logging for role access issues
        console.log("useRequireAuth: Access denied", {
          requiredRole,
          userRoles: user?.roles,
          hasRequiredRole,
          userId: user?.id || user?.userId,
          username: user?.username,
        });
        const fallback = getPrimaryDashboard(user);
        console.log("useRequireAuth: Redirecting to", fallback);
        router.replace(fallback);
        setIsLoading(false);
        return;
      }
      
      if (
        requiredUserType &&
        user?.userType &&
        user.userType !== requiredUserType
      ) {
        console.log('❌ Wrong user type, redirecting to dashboard');
        const fallback = getPrimaryDashboard(user);
        router.replace(fallback);
        setIsLoading(false);
        return;
        router.replace(redirectTo || "/auth/login");
      } else {
        setIsLoading(false);
      }
    }
  }}, [
    loading,
    authInitialized,
    isAuthenticated,
    hasRequiredRole,
    requiredRole,
    requiredUserType,
    user?.userType,
    user,
    redirectTo,
    router,
    hasInitialized,
    requiredRole,
    user,
  ]);

  return { isLoading: isLoading || !hasInitialized || loading };
};

export const useRequireUserType = (
  expectedType: "employee" | "candidate",
  redirectTo?: string
) => {
  const router = useRouter();
  const { isAuthenticated, user, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  const matchesType = useMemo(() => {
    if (!user) return false;
    return user.userType === expectedType;
  }, [user, expectedType]);

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.replace(redirectTo || "/auth/login");
      } else if (!matchesType) {
        router.replace(redirectTo || "/auth/login");
      }
      setIsLoading(false);
    }
  }, [loading, isAuthenticated, matchesType, redirectTo, router]);

  return { isLoading };
};
