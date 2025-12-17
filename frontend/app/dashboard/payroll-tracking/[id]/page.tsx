"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/use-auth";
import { useRequireAuth } from "@/lib/hooks/use-auth";
import { SystemRole } from "@/types";
import { payslipsApi } from "@/lib/api/payroll-tracking/payroll-tracking";
import { Payslip } from "@/types/payslip";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/shared/ui/Card";
import { Button } from "@/components/shared/ui/Button";

export default function PayslipDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [payslip, setPayslip] = useState<Payslip | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useRequireAuth(SystemRole.DEPARTMENT_EMPLOYEE);

  const payslipId = params.id as string;

  useEffect(() => {
    const fetchPayslip = async () => {
      if (!user?.id && !user?.userId) {
        setError("User ID not found");
        setLoading(false);
        return;
      }

      try {
        const employeeId = user.id || user.userId;
        const data = await payslipsApi.getPayslipById(employeeId!, payslipId);
        setPayslip(data);
      } catch (err: any) {
        setError(err.message || "Failed to load payslip");
      } finally {
        setLoading(false);
      }
    };

    fetchPayslip();
  }, [user, payslipId]);

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

  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    if (!payslip || !user) return;

    try {
      const employeeId = user.id || user.userId;
      if (!employeeId) {
        alert("User ID not found. Please log in again.");
        return;
      }
      
      setDownloading(true);
      const blob = await payslipsApi.downloadPayslip(employeeId, payslip._id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const fileName = `payslip-${payslip.payrollRunId?.runId || payslip._id}-${formatDate(payslip.payrollRunId?.payrollPeriod).replace(/\s/g, '-')}.pdf`;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      setDownloading(false);
    } catch (err: any) {
      console.error("Error downloading payslip:", err);
      alert(err.message || "Failed to download payslip. Please try again.");
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading payslip...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !payslip) {
    return (
      <div className="container mx-auto px-6 py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-red-600 mb-4">{error || "Payslip not found"}</p>
              <Button onClick={() => router.push("/dashboard/payroll-tracking")}>
                Back to Payslips
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payslip Details</h1>
          <p className="text-gray-600 mt-1">
            {formatDate(payslip.payrollRunId?.payrollPeriod)}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push("/dashboard/payroll-tracking")}>
            Back
          </Button>
          <Button variant="primary" onClick={handleDownload} disabled={downloading}>
            {downloading ? "Downloading..." : "Download PDF"}
          </Button>
        </div>
      </div>

      {/* Status Overview Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Payslip Status & Process</CardTitle>
          <CardDescription>Current status of your salary in the payroll process</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Payment Status */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Payment Status</p>
              <div className={`p-4 rounded-lg border-2 ${
                payslip.paymentStatus === "PAID" 
                  ? "bg-green-50 border-green-300" 
                  : "bg-yellow-50 border-yellow-300"
              }`}>
                <div className="flex items-center justify-between">
                  <span className={`text-lg font-bold ${
                    payslip.paymentStatus === "PAID" ? "text-green-700" : "text-yellow-700"
                  }`}>
                    {payslip.paymentStatus}
                  </span>
                  {payslip.paymentStatus === "PAID" ? (
                    <span className="text-2xl">✓</span>
                  ) : (
                    <span className="text-2xl">⏳</span>
                  )}
                </div>
                <p className="text-sm mt-2 text-gray-600">
                  {payslip.paymentStatus === "PAID" 
                    ? "Your salary has been processed and transferred to your account."
                    : "Your salary is currently being processed. Payment will be completed soon."}
                </p>
              </div>
            </div>

            {/* Overall Status */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Overall Status</p>
              <div className={`p-4 rounded-lg border-2 ${
                payslip.status === "paid" 
                  ? "bg-green-50 border-green-300"
                  : payslip.status === "disputed" || payslip.status === "paid-disputed"
                  ? "bg-red-50 border-red-300"
                  : "bg-yellow-50 border-yellow-300"
              }`}>
                <div className="flex items-center justify-between">
                  <span className={`text-lg font-bold ${
                    payslip.status === "paid" 
                      ? "text-green-700"
                      : payslip.status === "disputed" || payslip.status === "paid-disputed"
                      ? "text-red-700"
                      : "text-yellow-700"
                  }`}>
                    {payslip.status === "paid-disputed" ? "PAID (DISPUTED)" : (payslip.status || "PENDING").toUpperCase()}
                  </span>
                  {payslip.status === "paid" ? (
                    <span className="text-2xl">✓</span>
                  ) : payslip.status === "disputed" || payslip.status === "paid-disputed" ? (
                    <span className="text-2xl">⚠️</span>
                  ) : (
                    <span className="text-2xl">⏳</span>
                  )}
                </div>
                <p className="text-sm mt-2 text-gray-600">
                  {payslip.status === "paid" 
                    ? "All processes completed successfully."
                    : payslip.status === "paid-disputed"
                    ? "Payment completed, but there is an active dispute."
                    : payslip.status === "disputed"
                    ? "Payment is on hold due to an active dispute."
                    : "Awaiting processing and approval."}
                </p>
              </div>
            </div>
          </div>

          {/* Dispute Information */}
          {payslip.hasActiveDispute && payslip.latestDispute && (
            <div className="mt-6 p-4 bg-orange-50 border-2 border-orange-300 rounded-lg">
              <div className="flex items-start gap-3">
                <span className="text-2xl">⚠️</span>
                <div className="flex-1">
                  <h4 className="font-semibold text-orange-900 mb-2">Active Dispute</h4>
                  <p className="text-sm text-orange-800 mb-2">
                    <span className="font-medium">Dispute ID:</span> {payslip.latestDispute.disputeId}
                  </p>
                  <p className="text-sm text-orange-800 mb-2">
                    <span className="font-medium">Status:</span> {payslip.latestDispute.status}
                  </p>
                  <p className="text-sm text-orange-800 mb-2">
                    <span className="font-medium">Description:</span> {payslip.latestDispute.description}
                  </p>
                  {payslip.latestDispute.createdAt && (
                    <p className="text-xs text-orange-700 mt-2">
                      Created: {formatDate(payslip.latestDispute.createdAt)}
                    </p>
                  )}
                  {payslip.disputeCount && payslip.disputeCount > 1 && (
                    <p className="text-xs text-orange-700 mt-1">
                      Total disputes on this payslip: {payslip.disputeCount}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Status Timeline */}
          <div className="mt-6">
            <p className="text-sm font-medium text-gray-700 mb-3">Process Timeline</p>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${
                  payslip.paymentStatus === "PAID" ? "bg-green-500" : "bg-gray-300"
                }`}></div>
                <span className={`text-sm ${
                  payslip.paymentStatus === "PAID" ? "text-gray-900 font-medium" : "text-gray-500"
                }`}>
                  Payslip Generated
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${
                  payslip.paymentStatus === "PAID" ? "bg-green-500" : "bg-gray-300"
                }`}></div>
                <span className={`text-sm ${
                  payslip.paymentStatus === "PAID" ? "text-gray-900 font-medium" : "text-gray-500"
                }`}>
                  Approved by Finance
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${
                  payslip.paymentStatus === "PAID" ? "bg-green-500" : "bg-gray-300"
                }`}></div>
                <span className={`text-sm ${
                  payslip.paymentStatus === "PAID" ? "text-gray-900 font-medium" : "text-gray-500"
                }`}>
                  Payment Processed
                </span>
              </div>
              {payslip.hasActiveDispute && (
                <div className="flex items-center gap-3 mt-3 pt-3 border-t border-orange-200">
                  <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                  <span className="text-sm text-orange-700 font-medium">
                    Dispute Under Review
                  </span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Summary Card */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Employee</p>
                <p className="font-semibold text-gray-900">
                  {payslip.employeeId?.firstName} {payslip.employeeId?.lastName}
                </p>
                <p className="text-sm text-gray-500">{payslip.employeeId?.employeeNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Payroll Run</p>
                <p className="font-semibold text-gray-900">
                  {payslip.payrollRunId?.runId || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Period</p>
                <p className="font-semibold text-gray-900">
                  {formatDate(payslip.payrollRunId?.payrollPeriod)}
                </p>
              </div>
              {payslip.createdAt && (
                <div>
                  <p className="text-sm text-gray-500">Generated</p>
                  <p className="font-semibold text-gray-900">
                    {formatDate(payslip.createdAt)}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Earnings and Deductions */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Earnings & Deductions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Earnings */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Earnings</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-gray-700">Base Salary</span>
                    <span className="font-semibold text-gray-900">
                      {formatCurrency(payslip.earningsDetails.baseSalary)}
                    </span>
                  </div>
                  
                  {payslip.earningsDetails.allowances?.map((allowance, idx) => (
                    <div key={idx} className="flex justify-between items-center py-2 border-b">
                      <span className="text-gray-700">{allowance.allowanceName}</span>
                      <span className="font-semibold text-gray-900">
                        {formatCurrency(allowance.amount)}
                      </span>
                    </div>
                  ))}

                  {payslip.earningsDetails.bonuses?.map((bonus, idx) => (
                    <div key={idx} className="flex justify-between items-center py-2 border-b">
                      <span className="text-gray-700">{bonus.bonusName}</span>
                      <span className="font-semibold text-green-600">
                        +{formatCurrency(bonus.amount)}
                      </span>
                    </div>
                  ))}

                  {payslip.earningsDetails.refunds?.map((refund, idx) => (
                    <div key={idx} className="flex justify-between items-center py-2 border-b">
                      <span className="text-gray-700">{refund.refundDescription}</span>
                      <span className="font-semibold text-green-600">
                        +{formatCurrency(refund.refundAmount)}
                      </span>
                    </div>
                  ))}

                  <div className="flex justify-between items-center py-2 pt-3 border-t-2 border-gray-300">
                    <span className="text-lg font-semibold text-gray-900">Gross Salary</span>
                    <span className="text-lg font-bold text-gray-900">
                      {formatCurrency(payslip.totalGrossSalary)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Deductions */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Deductions</h3>
                <div className="space-y-2">
                  {payslip.deductionsDetails.taxes?.map((tax, idx) => (
                    <div key={idx} className="flex justify-between items-center py-2 border-b">
                      <span className="text-gray-700">{tax.taxName} ({tax.taxRate}%)</span>
                      <span className="font-semibold text-red-600">
                        -{formatCurrency(tax.taxAmount)}
                      </span>
                    </div>
                  ))}

                  {payslip.deductionsDetails.insurances?.map((insurance, idx) => (
                    <div key={idx} className="flex justify-between items-center py-2 border-b">
                      <span className="text-gray-700">{insurance.insuranceName}</span>
                      <span className="font-semibold text-red-600">
                        -{formatCurrency(insurance.employeeContribution)}
                      </span>
                    </div>
                  ))}

                  {payslip.deductionsDetails.penalties && (
                    <>
                      {payslip.deductionsDetails.penalties.missingHoursDeduction && (
                        <div className="flex justify-between items-center py-2 border-b">
                          <span className="text-gray-700">Missing Hours Deduction</span>
                          <span className="font-semibold text-red-600">
                            -{formatCurrency(payslip.deductionsDetails.penalties.missingHoursDeduction)}
                          </span>
                        </div>
                      )}
                      {payslip.deductionsDetails.penalties.missingDaysDeduction && (
                        <div className="flex justify-between items-center py-2 border-b">
                          <span className="text-gray-700">Missing Days Deduction</span>
                          <span className="font-semibold text-red-600">
                            -{formatCurrency(payslip.deductionsDetails.penalties.missingDaysDeduction)}
                          </span>
                        </div>
                      )}
                      {payslip.deductionsDetails.penalties.unpaidLeaveDeduction && (
                        <div className="flex justify-between items-center py-2 border-b">
                          <span className="text-gray-700">Unpaid Leave Deduction</span>
                          <span className="font-semibold text-red-600">
                            -{formatCurrency(payslip.deductionsDetails.penalties.unpaidLeaveDeduction)}
                          </span>
                        </div>
                      )}
                    </>
                  )}

                  <div className="flex justify-between items-center py-2 pt-3 border-t-2 border-gray-300">
                    <span className="text-lg font-semibold text-gray-900">Total Deductions</span>
                    <span className="text-lg font-bold text-red-600">
                      -{formatCurrency(payslip.totaDeductions || 0)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Net Pay */}
              <div className="pt-4 border-t-2 border-blue-500">
                <div className="flex justify-between items-center py-3 bg-blue-50 rounded-lg px-4">
                  <span className="text-xl font-bold text-gray-900">Net Pay</span>
                  <span className="text-2xl font-bold text-blue-600">
                    {formatCurrency(payslip.netPay)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

