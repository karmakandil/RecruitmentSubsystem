"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../stores/auth.store";
import { getPrimaryDashboard, hasRoleAccess } from "../utils/role-utils";

export const useAuth = () => {
  const store = useAuthStore();

  useEffect(() => {
    store.initialize();
  }, []);

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
  const [hasInitialized, setHasInitialized] = useState(false);

  // Ensure initialization runs
  useEffect(() => {
    const store = useAuthStore.getState();
    store.initialize();
    setHasInitialized(true);
  }, []);

  const hasRequiredRole = useMemo(() => {
    if (!requiredRole) return true;
    const roles = user?.roles || [];
    if (Array.isArray(requiredRole)) {
      return requiredRole.some((r) => hasRoleAccess(roles, r));
    }
    return hasRoleAccess(roles, requiredRole);
  }, [user, requiredRole]);

  useEffect(() => {
    // Wait for initialization to complete
    if (!hasInitialized) return;

    if (!loading) {
      if (!isAuthenticated) {
        router.replace(redirectTo || "/auth/login");
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
      } else if (
        requiredUserType &&
        user?.userType &&
        user.userType !== requiredUserType
      ) {
        const fallback = getPrimaryDashboard(user);
        router.replace(fallback);
        router.replace(redirectTo || "/auth/login");
      } else {
        setIsLoading(false);
      }
    }
  }, [
    loading,
    isAuthenticated,
    hasRequiredRole,
    requiredUserType,
    user?.userType,
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
