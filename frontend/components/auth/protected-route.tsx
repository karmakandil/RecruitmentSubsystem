// components/auth/protected-route.tsx - UPDATED
"use client";

import { useAuth } from "@/lib/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SystemRole } from "@/types";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: SystemRole[] | string[];
  requiredUserType?: string;
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  allowedRoles,
  requiredUserType,
  redirectTo = "/dashboard",
}: ProtectedRouteProps) {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Wait for mount and auth loading to complete
    if (!mounted || loading) {
      setHasChecked(false);
      return;
    }

    // Mark that we've checked
    setHasChecked(true);

    // Only redirect if we're sure there's no user (after loading completes)
    if (!user && !isAuthenticated) {
      // Small delay to prevent redirect loops during navigation
      const timer = setTimeout(() => {
        const currentPath = window.location.pathname;
        if (!currentPath.startsWith("/auth/login")) {
          router.push("/auth/login");
        }
      }, 100);
      return () => clearTimeout(timer);
    }

    let hasAccess = true;

    // Check user type if required
    if (requiredUserType && user && user.userType !== requiredUserType) {
      hasAccess = false;
    }

    // Check roles if required
    if (allowedRoles && allowedRoles.length > 0 && user) {
      const userRoles = user.roles || [];

      // Convert both arrays to strings for comparison
      const userRoleStrings = userRoles.map((role) =>
        typeof role === "string" ? role : (role as any).toString()
      );

      const allowedRoleStrings = allowedRoles.map((role) =>
        typeof role === "string" ? role : (role as any).toString()
      );

      // Check if any user role matches any allowed role
      const hasRoleAccess = userRoleStrings.some((userRole) =>
        allowedRoleStrings.includes(userRole)
      );

      if (!hasRoleAccess) {
        hasAccess = false;
      }
    }

    if (!hasAccess) {
      router.push(redirectTo);
      return;
    }

    setIsAuthorized(true);
  }, [mounted, user, loading, isAuthenticated, allowedRoles, requiredUserType, router, redirectTo]);

  // Show loading while checking auth or if not yet authorized
  if (!mounted || loading || !hasChecked || (!isAuthorized && hasChecked)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return <>{children}</>;
}
