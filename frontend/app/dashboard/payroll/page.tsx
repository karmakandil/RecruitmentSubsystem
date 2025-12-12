"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/hooks/use-auth";
import { useRequireAuth } from "@/lib/hooks/use-auth";
import { SystemRole } from "@/types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/shared/ui/Card";
import { CheckCircle2, XCircle, Clock, BarChart3, FileCheck, TrendingUp, FileText, DollarSign, Gift, Shield, Briefcase, Users } from "lucide-react";
import { statsApi, ConfigurationStats } from "@/lib/api/payroll-configuration";
import { approvalsApi } from "@/lib/api/payroll-configuration";

export default function PayrollDashboardPage() {
  const { user } = useAuth();
  // Allow both Payroll Manager and Payroll Specialist
  useRequireAuth([SystemRole.PAYROLL_MANAGER, SystemRole.PAYROLL_SPECIALIST]);
  
  const isPayrollManager = user?.roles?.includes(SystemRole.PAYROLL_MANAGER);
  const isPayrollSpecialist = user?.roles?.includes(SystemRole.PAYROLL_SPECIALIST);

  const [stats, setStats] = useState<ConfigurationStats | null>(null);
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Load stats (only for Payroll Manager)
      if (isPayrollManager) {
        try {
          const statsData = await statsApi.getStats();
          console.log("Stats data loaded:", statsData);
          // Ensure stats object has all required fields
          setStats({
            total: statsData?.total ?? 0,
            pending: statsData?.pending ?? 0,
            approved: statsData?.approved ?? 0,
            rejected: statsData?.rejected ?? 0,
          });
        } catch (err: any) {
          console.error("Error loading stats:", err);
          // Set default stats if API fails
          setStats({
            total: 0,
            pending: 0,
            approved: 0,
            rejected: 0,
          });
        }

        // Load pending approvals count (only for Payroll Manager)
        try {
          const approvals = await approvalsApi.getPendingApprovals();
          const count = Array.isArray(approvals) 
            ? approvals.length 
            : (approvals && typeof approvals === 'object' && 'data' in approvals && Array.isArray((approvals as any).data) 
              ? (approvals as any).data.length 
              : 0);
          setPendingCount(count);
          console.log("Pending approvals count:", count);
        } catch (err: any) {
          console.error("Error loading pending approvals:", err);
          setPendingCount(0);
        }
      }
    } catch (err) {
      console.error("Error loading dashboard data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">
          {isPayrollManager ? "Payroll Manager Dashboard" : "Payroll Specialist Dashboard"}
        </h1>
        <p className="text-lg font-medium text-gray-200">
          Welcome, {user?.fullName || (isPayrollManager ? "Manager" : "Specialist")}. 
          {isPayrollManager 
            ? " Manage payroll configurations, approvals, and oversight."
            : " Create and manage payroll configurations."}
        </p>
      </div>

      {/* Primary Actions - Role-based content */}
      {isPayrollManager ? (
        /* Payroll Manager View */
        <div className="mb-10">
          <h2 className="text-3xl font-semibold text-white mb-6">
            Payroll Configuration Management
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Approval Dashboard - Primary Action */}
            <Card className="hover:shadow-lg transition-shadow border-2 border-blue-200">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <FileCheck className="h-7 w-7 text-blue-600" />
                  <CardTitle className="text-2xl font-bold">Approval Dashboard</CardTitle>
                </div>
                <CardDescription className="text-base text-gray-700 font-medium">
                  Review and approve pending payroll configurations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link
                  href="/dashboard/payroll-configuration/approvals"
                  className="block w-full text-center bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition font-semibold text-base"
                >
                  View Pending Approvals →
                </Link>
                <p className="text-sm text-gray-800 text-center mt-2 font-medium">
                  Approve or reject draft configurations
                </p>
              </CardContent>
            </Card>

            {/* Configuration Statistics */}
            <Card className="hover:shadow-lg transition-shadow border-2 border-green-200">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-7 w-7 text-green-600" />
                  <CardTitle className="text-2xl font-bold">Configuration Statistics</CardTitle>
                </div>
                <CardDescription className="text-base text-gray-700 font-medium">
                  View overview and statistics of all configurations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link
                  href="/dashboard/payroll-configuration/stats"
                  className="block w-full text-center bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition font-semibold text-base"
                >
                  View Statistics →
                </Link>
                <p className="text-sm text-gray-800 text-center mt-2 font-medium">
                  Track configuration status and trends
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        /* Payroll Specialist View */
        <div className="mb-10">
          <h2 className="text-3xl font-semibold text-white mb-6">
            Configuration Management
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Policies */}
            <Card className="hover:shadow-lg transition-shadow border-2 border-blue-200">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <FileText className="h-7 w-7 text-blue-600" />
                  <CardTitle className="text-2xl font-bold">Payroll Policies</CardTitle>
                </div>
                <CardDescription className="text-base text-gray-700 font-medium">
                  Manage payroll policies and rules
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link
                  href="/dashboard/payroll-configuration/policies"
                  className="block w-full text-center bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition font-semibold text-base"
                >
                  Manage Policies →
                </Link>
              </CardContent>
            </Card>

            {/* Pay Grades */}
            <Card className="hover:shadow-lg transition-shadow border-2 border-purple-200">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-7 w-7 text-purple-600" />
                  <CardTitle className="text-2xl font-bold">Pay Grades</CardTitle>
                </div>
                <CardDescription className="text-base text-gray-700 font-medium">
                  Configure pay grades and salary bands
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link
                  href="/dashboard/payroll-configuration/pay-grades"
                  className="block w-full text-center bg-purple-600 text-white py-3 px-4 rounded-md hover:bg-purple-700 transition font-semibold text-base"
                >
                  Manage Pay Grades →
                </Link>
              </CardContent>
            </Card>

            {/* Pay Types */}
            <Card className="hover:shadow-lg transition-shadow border-2 border-indigo-200">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Briefcase className="h-7 w-7 text-indigo-600" />
                  <CardTitle className="text-2xl font-bold">Pay Types</CardTitle>
                </div>
                <CardDescription className="text-base text-gray-700 font-medium">
                  Manage different pay types
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link
                  href="/dashboard/payroll-configuration/pay-types"
                  className="block w-full text-center bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 transition font-semibold text-base"
                >
                  Manage Pay Types →
                </Link>
              </CardContent>
            </Card>

            {/* Allowances */}
            <Card className="hover:shadow-lg transition-shadow border-2 border-green-200">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Gift className="h-7 w-7 text-green-600" />
                  <CardTitle className="text-2xl font-bold">Allowances</CardTitle>
                </div>
                <CardDescription className="text-base text-gray-700 font-medium">
                  Configure employee allowances
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link
                  href="/dashboard/payroll-configuration/allowances"
                  className="block w-full text-center bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition font-semibold text-base"
                >
                  Manage Allowances →
                </Link>
              </CardContent>
            </Card>

            {/* Signing Bonuses */}
            <Card className="hover:shadow-lg transition-shadow border-2 border-amber-200">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Users className="h-7 w-7 text-amber-600" />
                  <CardTitle className="text-2xl font-bold">Signing Bonuses</CardTitle>
                </div>
                <CardDescription className="text-base text-gray-700 font-medium">
                  Manage signing bonus configurations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link
                  href="/dashboard/payroll-configuration/signing-bonuses"
                  className="block w-full text-center bg-amber-600 text-white py-3 px-4 rounded-md hover:bg-amber-700 transition font-semibold text-base"
                >
                  Manage Signing Bonuses →
                </Link>
              </CardContent>
            </Card>

            {/* Termination Benefits */}
            <Card className="hover:shadow-lg transition-shadow border-2 border-red-200">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Shield className="h-7 w-7 text-red-600" />
                  <CardTitle className="text-2xl font-bold">Termination Benefits</CardTitle>
                </div>
                <CardDescription className="text-base text-gray-700 font-medium">
                  Configure termination and resignation benefits
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link
                  href="/dashboard/payroll-configuration/termination-benefits"
                  className="block w-full text-center bg-red-600 text-white py-3 px-4 rounded-md hover:bg-red-700 transition font-semibold text-base"
                >
                  Manage Termination Benefits →
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Quick Stats Section - Only for Payroll Manager */}
      {isPayrollManager && (
        <div className="mb-10">
          <h2 className="text-3xl font-semibold text-white mb-6">
            Quick Access
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-base font-semibold text-blue-700 mb-2">Pending Approvals</p>
                    <p className="text-4xl font-bold text-blue-900">
                      {isLoading ? "..." : pendingCount}
                    </p>
                  </div>
                  <Clock className="h-10 w-10 text-blue-500" />
                </div>
                <Link
                  href="/dashboard/payroll-configuration/approvals?filter=pending"
                  className="text-sm font-medium text-blue-700 hover:underline mt-3 inline-block"
                >
                  View all →
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-green-50 border-green-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-base font-semibold text-green-700 mb-2">Approved</p>
                    <p className="text-4xl font-bold text-green-900">
                      {isLoading ? "..." : (stats?.approved || 0)}
                    </p>
                  </div>
                  <CheckCircle2 className="h-10 w-10 text-green-500" />
                </div>
                <Link
                  href="/dashboard/payroll-configuration/stats"
                  className="text-sm font-medium text-green-700 hover:underline mt-3 inline-block"
                >
                  View stats →
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-red-50 border-red-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-base font-semibold text-red-700 mb-2">Rejected</p>
                    <p className="text-4xl font-bold text-red-900">
                      {isLoading ? "..." : (stats?.rejected || 0)}
                    </p>
                  </div>
                  <XCircle className="h-10 w-10 text-red-500" />
                </div>
                <Link
                  href="/dashboard/payroll-configuration/stats"
                  className="text-sm font-medium text-red-700 hover:underline mt-3 inline-block"
                >
                  View stats →
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-base font-semibold text-purple-700 mb-2">Total Configs</p>
                    <p className="text-4xl font-bold text-purple-900">
                      {isLoading ? "..." : (stats?.total || 0)}
                    </p>
                  </div>
                  <TrendingUp className="h-10 w-10 text-purple-500" />
                </div>
                <Link
                  href="/dashboard/payroll-configuration/stats"
                  className="text-sm font-medium text-purple-700 hover:underline mt-3 inline-block"
                >
                  View stats →
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

    </div>
  );
}


