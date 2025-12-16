"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/hooks/use-auth";
import NotificationBell from "@/components/notifications/NotificationBell";
import { isHRAdminOrManager } from "@/lib/utils/role-utils";
import { SystemRole } from "@/types";
import { User, ChevronDown, LogOut, UserCircle, Settings } from "lucide-react";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
  };

  const isHR = isHRAdminOrManager(user);
  const isHRAdmin = user?.roles?.includes(SystemRole.HR_ADMIN) ?? false;
  const isHRManager = user?.roles?.includes(SystemRole.HR_MANAGER) ?? false;
  const isSystemAdmin = user?.roles?.includes(SystemRole.SYSTEM_ADMIN) ?? false;
  const canConfigureShifts = isHRAdmin || isHRManager || isSystemAdmin;

  const navItemClass = (href: string) =>
    `text-sm font-medium transition-colors ${
      pathname.startsWith(href)
        ? "text-blue-600"
        : "text-gray-700 hover:text-blue-600"
    }`;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-lg bg-blue-600" />
          <span className="text-xl font-bold text-gray-900">HR System</span>
        </Link>

        {isAuthenticated && (
          <div className="flex items-center space-x-6">
            {/* Navigation Links */}
            <nav className="flex items-center space-x-6">
              {/* All Authenticated Users */}
              <Link href="/dashboard" className={navItemClass("/dashboard")}>
                Dashboard
              </Link>

              {/* Admin Link - Only for HR Admins */}
              {isHRAdmin && (
                <Link
                  href="/dashboard/admin"
                  className={navItemClass("/dashboard/admin")}
                >
                  Admin
                </Link>

                {/* Optional: Additional Admin Links */}
                <Link
                  href="/dashboard/leaves"
                  className={navItemClass("/dashboard/leaves")}
                >
                  Leaves
                </Link>
              </>
            )}

            {/* HR Manager Navigation */}
            {isHRManager && (
              <>
                <Link
                  href="/dashboard/employee-profile/admin/search"
                  className={navItemClass("/dashboard/employee-profile/admin")}
                >
                  Employees
                </Link>

                <Link
                  href="/dashboard/employee-profile/admin/approvals"
                  className={navItemClass(
                    "/dashboard/employee-profile/admin/approvals"
                  )}
                >
                  Approvals
                </Link>

                <Link
                  href="/dashboard/employee-profile/team"
                  className={navItemClass("/dashboard/employee-profile/team")}
                >
                  Team
                </Link>

                <Link
                  href="/dashboard/employee-profile/my-profile"
                  className={navItemClass("/dashboard/employee-profile/my-profile")}
                >
                  My Profile
                </Link>
              </>
            )}

            {/* Regular Employee Navigation */}
            {!isHR && (
              <Link
                href="/dashboard/employee-profile/my-profile"
                className={navItemClass("/dashboard/employee-profile/my-profile")}
              >
                My Profile
              </Link>
            )}

                  {/* Divider */}
                  <div className="border-t border-gray-100 my-2"></div>

                  {/* Logout */}
                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {!isAuthenticated && (
          <nav className="flex items-center space-x-4">
            <Link
              href="/auth/login"
              className="text-sm font-medium text-gray-700 hover:text-blue-600"
            >
              Login
            </Link>

            <Link
              href="/auth/register"
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Register
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
