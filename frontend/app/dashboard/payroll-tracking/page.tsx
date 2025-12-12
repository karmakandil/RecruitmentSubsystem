"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/hooks/use-auth";
import { SystemRole } from "@/types";
import { payslipsApi } from "@/lib/api/payroll-tracking/payroll-tracking";
import { Payslip } from "@/types/payslip";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/shared/ui/Card";
import { Button } from "@/components/shared/ui/Button";
import { useRouter } from "next/navigation";

export default function PayrollPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [payslips, setPayslips] = useState<Payslip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Allow employees, finance staff, and payroll specialists to access this page
  const hasAccess = user?.roles?.some(
    (role) => 
      role === SystemRole.DEPARTMENT_EMPLOYEE || 
      role === SystemRole.FINANCE_STAFF || 
      role === SystemRole.PAYROLL_SPECIALIST ||
      role === SystemRole.PAYROLL_MANAGER ||
      role === SystemRole.SYSTEM_ADMIN
  );

  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Wait for mount and auth initialization before redirecting
    if (!mounted || authLoading) return;
    
    if (!isAuthenticated) {
      router.replace("/auth/login");
      return;
    }
    
    if (!hasAccess) {
      router.replace("/dashboard");
      return;
    }
  }, [mounted, hasAccess, isAuthenticated, authLoading, router]);

  useEffect(() => {
    const fetchPayslips = async () => {
      // Only fetch data if user is authenticated and has access
      if (authLoading || !isAuthenticated || !hasAccess) {
        return;
      }

      // For Finance staff and Payroll Specialists, they might not have an employee ID, so show empty state
      // TODO: In the future, Finance staff and Payroll Specialists could see all payslips or a different view
      if (!user?.id && !user?.userId) {
        // Finance staff and Payroll Specialists might not have employee profile - show empty state
        if (
          user?.roles?.includes(SystemRole.FINANCE_STAFF) ||
          user?.roles?.includes(SystemRole.PAYROLL_SPECIALIST) ||
          user?.roles?.includes(SystemRole.PAYROLL_MANAGER)
        ) {
          setPayslips([]);
          setLoading(false);
          return;
        }
        setError("User ID not found");
        setLoading(false);
        return;
      }

      try {
        const employeeId = user.id || user.userId;
        const data = await payslipsApi.getPayslipsByEmployeeId(employeeId!);
        setPayslips(data);
      } catch (err: any) {
        setError(err.message || "Failed to load payroll information");
      } finally {
        setLoading(false);
      }
    };

    fetchPayslips();
  }, [user, isAuthenticated, hasAccess, authLoading]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getStatusBadge = (status?: string, paymentStatus?: string) => {
    const statusColors: Record<string, string> = {
      paid: "bg-green-100 text-green-800 border border-green-300",
      pending: "bg-yellow-100 text-yellow-800 border border-yellow-300",
      disputed: "bg-red-100 text-red-800 border border-red-300",
      "paid-disputed": "bg-orange-100 text-orange-800 border border-orange-300",
    };

    const color = statusColors[status || "pending"] || "bg-gray-100 text-gray-800 border border-gray-300";
    const displayText = status === "paid-disputed" 
      ? "PAID (DISPUTED)" 
      : status?.toUpperCase() || "PENDING";
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${color}`}>
        {displayText}
      </span>
    );
  };

  const getStatusMessage = (payslip: Payslip): string => {
    if (payslip.status === "paid") {
      return "Your salary has been processed and paid.";
    } else if (payslip.status === "paid-disputed") {
      return "Your salary has been paid, but there is an active dispute on this payslip.";
    } else if (payslip.status === "disputed") {
      return "This payslip has an active dispute. Payment is on hold until resolved.";
    } else {
      return "Your salary is being processed. Payment is pending.";
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading payroll information...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-6 py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>Retry</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Payroll Tracking</h1>
        <p className="text-gray-600 mt-1">Manage and track your payroll information, claims, and disputes</p>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Salary Information Section */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg">Salary Information</CardTitle>
            <CardDescription>View your salary details and history</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button 
              variant="outline" 
              className="w-full justify-start" 
              size="sm"
              onClick={() => router.push("/dashboard/payroll-tracking/base-salary")}
            >
              <span className="mr-2">💰</span>
              Base Salary
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start" 
              size="sm"
              onClick={() => router.push("/dashboard/payroll-tracking/salary-history")}
            >
              <span className="mr-2">📊</span>
              Salary History
            </Button>
          </CardContent>
        </Card>

        {/* Earnings & Benefits Section */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg">Earnings & Benefits</CardTitle>
            <CardDescription>View your additional earnings and benefits</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button 
              variant="outline" 
              className="w-full justify-start" 
              size="sm"
              onClick={() => router.push("/dashboard/payroll-tracking/leave-encashment")}
            >
              <span className="mr-2">🏖️</span>
              Leave Encashment
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start" 
              size="sm"
              onClick={() => router.push("/dashboard/payroll-tracking/transportation")}
            >
              <span className="mr-2">🚗</span>
              Transportation Allowance
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start" 
              size="sm"
              onClick={() => router.push("/dashboard/payroll-tracking/employer-contributions")}
            >
              <span className="mr-2">💼</span>
              Employer Contributions
            </Button>
          </CardContent>
        </Card>

        {/* Deductions Section */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg">Deductions</CardTitle>
            <CardDescription>View detailed breakdown of deductions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button 
              variant="outline" 
              className="w-full justify-start" 
              size="sm"
              onClick={() => router.push("/dashboard/payroll-tracking/tax-deductions")}
            >
              <span className="mr-2">📋</span>
              Tax Deductions
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start" 
              size="sm"
              onClick={() => router.push("/dashboard/payroll-tracking/insurance-deductions")}
            >
              <span className="mr-2">🛡️</span>
              Insurance Deductions
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start" 
              size="sm"
              onClick={() => router.push("/dashboard/payroll-tracking/misconduct-deductions")}
            >
              <span className="mr-2">⚠️</span>
              Misconduct Deductions
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start" 
              size="sm"
              onClick={() => router.push("/dashboard/payroll-tracking/unpaid-leave-deductions")}
            >
              <span className="mr-2">📅</span>
              Unpaid Leave Deductions
            </Button>
          </CardContent>
        </Card>

        {/* Documents & Reports Section */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg">Documents & Reports</CardTitle>
            <CardDescription>Access official documents and reports</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button 
              variant="outline" 
              className="w-full justify-start" 
              size="sm"
              onClick={() => router.push("/dashboard/payroll-tracking/tax-documents")}
            >
              <span className="mr-2">📄</span>
              Tax Documents
            </Button>
          </CardContent>
        </Card>

        {/* Claims & Disputes Section */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg">Claims & Disputes</CardTitle>
            <CardDescription>Manage your expense claims and disputes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button 
              variant="outline" 
              className="w-full justify-start" 
              size="sm"
              onClick={() => {
                // Route Payroll Specialists to pending claims, employees to their claims
                const isPayrollSpecialist = user?.roles?.includes(SystemRole.PAYROLL_SPECIALIST);
                if (isPayrollSpecialist) {
                  router.push("/dashboard/payroll-tracking/pending-claims");
                } else {
                  router.push("/dashboard/payroll-tracking/claims");
                }
              }}
            >
              <span className="mr-2">💵</span>
              Expense Claims
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start" 
              size="sm"
              onClick={() => {
                // Route Payroll Specialists to pending disputes, employees to their disputes
                const isPayrollSpecialist = user?.roles?.includes(SystemRole.PAYROLL_SPECIALIST);
                if (isPayrollSpecialist) {
                  router.push("/dashboard/payroll-tracking/pending-disputes");
                } else {
                  router.push("/dashboard/payroll-tracking/disputes");
                }
              }}
            >
              <span className="mr-2">⚖️</span>
              Payroll Disputes
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start" 
              size="sm"
              onClick={() => router.push("/dashboard/payroll-tracking/tracking")}
            >
              <span className="mr-2">📈</span>
              Track Status
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Payslips Section */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">My Payslips</h2>
        <p className="text-gray-600 mb-4">View and download your monthly payslips</p>
      </div>

      {payslips.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No payslips found</p>
              <p className="text-gray-400 text-sm mt-2">
                Your payslips will appear here once they are generated by the payroll system.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {payslips.map((payslip) => (
            <Card key={payslip._id}>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Payslip - {formatDate(payslip.payrollRunId?.payrollPeriod)}
                      </h3>
                      {getStatusBadge(payslip.status, payslip.paymentStatus)}
                    </div>
                    
                    {/* Status Message */}
                    <div className={`mb-3 p-2 rounded-md text-sm ${
                      payslip.status === "paid" 
                        ? "bg-green-50 text-green-800 border border-green-200"
                        : payslip.status === "paid-disputed" || payslip.status === "disputed"
                        ? "bg-orange-50 text-orange-800 border border-orange-200"
                        : "bg-yellow-50 text-yellow-800 border border-yellow-200"
                    }`}>
                      <p className="font-medium">{getStatusMessage(payslip)}</p>
                      {payslip.hasActiveDispute && payslip.latestDispute && (
                        <p className="text-xs mt-1 opacity-90">
                          Latest dispute: {payslip.latestDispute.description.substring(0, 60)}
                          {payslip.latestDispute.description.length > 60 ? "..." : ""}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Gross Salary</p>
                        <p className="font-semibold text-gray-900">
                          {formatCurrency(payslip.totalGrossSalary)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Deductions</p>
                        <p className="font-semibold text-gray-900">
                          {formatCurrency(payslip.totaDeductions || 0)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Net Pay</p>
                        <p className="font-semibold text-blue-600 text-lg">
                          {formatCurrency(payslip.netPay)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Payment Status</p>
                        <p className={`font-semibold ${
                          payslip.paymentStatus === "PAID" ? "text-green-600" : "text-yellow-600"
                        }`}>
                          {payslip.paymentStatus}
                        </p>
                      </div>
                    </div>
                    
                    {payslip.hasActiveDispute && (
                      <div className="mt-2 flex items-center gap-2 text-sm">
                        <span className="text-orange-600 font-medium">⚠️ Active Dispute</span>
                        {payslip.disputeCount && payslip.disputeCount > 1 && (
                          <span className="text-gray-500">
                            ({payslip.disputeCount} dispute{payslip.disputeCount > 1 ? "s" : ""})
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/dashboard/payroll-tracking/${payslip._id}`}>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </Link>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={async () => {
                        try {
                          const employeeId = user?.id || user?.userId;
                          const blob = await payslipsApi.downloadPayslip(
                            employeeId!,
                            payslip._id
                          );
                          const url = window.URL.createObjectURL(blob);
                          const a = document.createElement("a");
                          a.href = url;
                          a.download = `payslip-${payslip.payrollRunId?.runId || payslip._id}.pdf`;
                          document.body.appendChild(a);
                          a.click();
                          window.URL.revokeObjectURL(url);
                          document.body.removeChild(a);
                        } catch (err: any) {
                          alert(err.message || "Failed to download payslip");
                        }
                      }}
                    >
                      Download PDF
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

