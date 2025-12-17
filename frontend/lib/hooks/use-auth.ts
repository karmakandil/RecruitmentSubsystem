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
  const [hasChecked, setHasChecked] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);

  // Ensure initialization runs
  useEffect(() => {
    const store = useAuthStore.getState();
    store.initialize();
    
    // Give a small delay to ensure zustand store has initialized
    const timer = setTimeout(() => {
      setHasInitialized(true);
    }, 100);
    
    return () => clearTimeout(timer);
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
    // Wait for initialization to complete
    if (!hasInitialized) {
      setHasChecked(false);
      setIsLoading(true);
      return;
    }

    // Wait for loading to complete before making decisions
    if (loading) {
      setHasChecked(false);
      setIsLoading(true);
      return;
    }

    // Mark that we've checked
    setHasChecked(true);

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

    // Only redirect if we're certain after loading completes
    if (!isAuthenticated) {
      console.log('❌ Not authenticated, redirecting to login');
      const currentPath = typeof window !== "undefined" ? window.location.pathname : "";
      if (!currentPath.startsWith("/auth/login")) {
        // Small delay to prevent redirect loops
        const timer = setTimeout(() => {
          router.replace(redirectTo || "/auth/login");
        }, 100);
        setIsLoading(false);
        return () => clearTimeout(timer);
      }
    } else if (requiredRole && !hasRequiredRole) {
      console.log('❌ Missing required role, redirecting to dashboard');
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
      const timer = setTimeout(() => {
        router.replace(fallback);
      }, 100);
      setIsLoading(false);
      return () => clearTimeout(timer);
    } else if (
      requiredUserType &&
      user?.userType &&
      user.userType !== requiredUserType
    ) {
      console.log('❌ Wrong user type, redirecting to dashboard');
      const fallback = getPrimaryDashboard(user);
      const timer = setTimeout(() => {
        router.replace(fallback);
      }, 100);
      setIsLoading(false);
      return () => clearTimeout(timer);
    }
    
    setIsLoading(false);
  }, [
    loading,
    hasInitialized,
    isAuthenticated,
    hasRequiredRole,
    requiredRole,
    requiredUserType,
    user?.userType,
    user,
    redirectTo,
    router,
  ]);

  return { isLoading: isLoading || !hasChecked || !hasInitialized || loading };
};

export const useRequireUserType = (
  expectedType: "employee" | "candidate",
  redirectTo?: string
) => {
  const router = useRouter();
  const { isAuthenticated, user, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [hasChecked, setHasChecked] = useState(false);

  const matchesType = useMemo(() => {
    if (!user) return false;
    return user.userType === expectedType;
  }, [user, expectedType]);

  useEffect(() => {
    // Wait for loading to complete
    if (loading) {
      setHasChecked(false);
      return;
    }

    setHasChecked(true);

    // Only redirect if we're certain after loading completes
    if (!isAuthenticated) {
      const currentPath = typeof window !== "undefined" ? window.location.pathname : "";
      if (!currentPath.startsWith("/auth/login")) {
        const timer = setTimeout(() => {
          router.replace(redirectTo || "/auth/login");
        }, 100);
        return () => clearTimeout(timer);
      }
    } else if (!matchesType) {
      const currentPath = typeof window !== "undefined" ? window.location.pathname : "";
      if (!currentPath.startsWith("/auth/login")) {
        const timer = setTimeout(() => {
          router.replace(redirectTo || "/auth/login");
        }, 100);
        return () => clearTimeout(timer);
      }
    }
    
    setIsLoading(false);
  }, [loading, isAuthenticated, matchesType, redirectTo, router]);

  return { isLoading: isLoading || !hasChecked };
};
