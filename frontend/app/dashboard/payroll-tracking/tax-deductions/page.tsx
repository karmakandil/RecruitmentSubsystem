"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/hooks/use-auth";
import { useRequireAuth } from "@/lib/hooks/use-auth";
import { SystemRole } from "@/types";
import { payslipsApi } from "@/lib/api/payroll-tracking/payroll-tracking";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/shared/ui/Card";
import { Button } from "@/components/shared/ui/Button";
import { useRouter } from "next/navigation";

interface TaxDeduction {
  _id?: string;
  name?: string;
  taxName?: string;
  rate?: number;
  taxRate?: number;
  amount?: number;
  taxAmount?: number;
  description?: string;
  status?: string;
}

interface TaxDeductionsData {
  payslipId: string;
  payrollPeriod?: {
    _id?: string;
    runId?: string;
    payrollPeriod?: string;
  };
  taxDeductions: TaxDeduction[];
  totalTaxDeductions: number;
}

export default function TaxDeductionsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [taxData, setTaxData] = useState<TaxDeductionsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useRequireAuth(SystemRole.DEPARTMENT_EMPLOYEE);

  useEffect(() => {
    const fetchTaxDeductions = async () => {
      if (!user?.id && !user?.userId) {
        setError("User ID not found");
        setLoading(false);
        return;
      }

      try {
        const employeeId = user.id || user.userId;
        const data = await payslipsApi.getTaxDeductions(employeeId!);
        setTaxData(data);
      } catch (err: any) {
        setError(err.message || "Failed to load tax deductions information");
      } finally {
        setLoading(false);
      }
    };

    fetchTaxDeductions();
  }, [user]);

  const formatCurrency = (amount?: number) => {
    if (amount === null || amount === undefined) return "N/A";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

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

  const getTaxName = (tax: TaxDeduction): string => {
    return tax.taxName || tax.name || "Tax Deduction";
  };

  const getTaxRate = (tax: TaxDeduction): number => {
    return tax.taxRate || tax.rate || 0;
  };

  const getTaxAmount = (tax: TaxDeduction): number => {
    return tax.taxAmount || tax.amount || 0;
  };

  const getTaxType = (taxName: string): string => {
    const name = taxName.toLowerCase();
    if (name.includes("income")) return "Income Tax";
    if (name.includes("social") || name.includes("pension")) return "Social Security";
    if (name.includes("health")) return "Health Insurance";
    if (name.includes("unemployment")) return "Unemployment Insurance";
    if (name.includes("medicare")) return "Medicare";
    return "Tax";
  };

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading tax deductions information...</p>
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
              <div className="flex gap-2 justify-center">
                <Button onClick={() => window.location.reload()}>Retry</Button>
                <Button variant="outline" onClick={() => router.push("/dashboard/payroll-tracking")}>
                  Back to Payroll
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!taxData) {
    return (
      <div className="container mx-auto px-6 py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-gray-500 mb-4">No tax deductions information available</p>
              <Button onClick={() => router.push("/dashboard/payroll-tracking")}>
                Back to Payroll
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
          <h1 className="text-3xl font-bold text-gray-900">Tax Deductions</h1>
          <p className="text-gray-600 mt-1">
            Detailed breakdown of tax deductions with applicable laws and rules
          </p>
        </div>
        <Button variant="outline" onClick={() => router.push("/dashboard/payroll-tracking")}>
          Back to Payroll
        </Button>
      </div>

      {/* Payroll Period Info */}
      {taxData.payrollPeriod && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Payroll Period</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {taxData.payrollPeriod.runId && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Payroll Run ID</p>
                  <p className="font-semibold text-gray-900">
                    {taxData.payrollPeriod.runId}
                  </p>
                </div>
              )}
              {taxData.payrollPeriod.payrollPeriod && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Period</p>
                  <p className="font-semibold text-gray-900">
                    {formatDate(taxData.payrollPeriod.payrollPeriod)}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tax Deductions */}
      <Card>
        <CardHeader>
          <CardTitle>Tax Deductions Breakdown</CardTitle>
          <CardDescription>
            Income tax, social contributions, and other tax deductions applied to your salary
          </CardDescription>
        </CardHeader>
        <CardContent>
          {taxData.taxDeductions.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">📋</div>
              <p className="text-gray-500 text-lg mb-2">No Tax Deductions</p>
              <p className="text-gray-400 text-sm">
                No tax deductions are applied to your current payslip.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {taxData.taxDeductions.map((tax, idx) => {
                const taxName = getTaxName(tax);
                const taxRate = getTaxRate(tax);
                const taxAmount = getTaxAmount(tax);
                const taxType = getTaxType(taxName);

                return (
                  <div
                    key={idx}
                    className="p-5 bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-lg hover:border-red-300 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl">📊</span>
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900">{taxName}</h4>
                            <span className="inline-block mt-1 px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded">
                              {taxType}
                            </span>
                          </div>
                        </div>
                        {tax.description && (
                          <p className="text-sm text-gray-600 mt-2">{tax.description}</p>
                        )}
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-sm text-gray-500 mb-1">Deduction Amount</p>
                        <p className="text-2xl font-bold text-red-600">
                          {formatCurrency(taxAmount)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-red-200">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-3 bg-white rounded border border-gray-200">
                          <p className="text-xs text-gray-500 mb-1">Tax Rate</p>
                          <p className="text-lg font-bold text-gray-900">{taxRate}%</p>
                        </div>
                        <div className="p-3 bg-white rounded border border-gray-200">
                          <p className="text-xs text-gray-500 mb-1">Calculation Basis</p>
                          <p className="text-sm font-semibold text-gray-900">Base Salary</p>
                        </div>
                        <div className="p-3 bg-white rounded border border-gray-200">
                          <p className="text-xs text-gray-500 mb-1">Calculation Method</p>
                          <p className="text-sm font-semibold text-gray-900">Percentage</p>
                        </div>
                      </div>
                      <div className="mt-3 p-3 bg-gray-50 rounded text-xs text-gray-600">
                        <p className="font-medium mb-1">Calculation Formula:</p>
                        <p>
                          Base Salary × {taxRate}% = {formatCurrency(taxAmount)}
                        </p>
                      </div>
                    </div>

                    {/* Law/Rule Information */}
                    <div className="mt-4 pt-4 border-t border-red-200">
                      <p className="text-xs font-medium text-gray-700 mb-2">Applicable Rule/Law</p>
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                        <p className="text-sm text-blue-900">
                          <span className="font-semibold">Tax Rule:</span> {taxName}
                        </p>
                        {tax.description && (
                          <p className="text-xs text-blue-800 mt-1">{tax.description}</p>
                        )}
                        <p className="text-xs text-blue-700 mt-2">
                          This tax deduction is calculated based on approved tax rules and regulations.
                          The rate of {taxRate}% is applied to your base salary as per company policy
                          and applicable tax laws.
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Total Summary */}
              <div className="pt-6 mt-6 border-t-2 border-red-300">
                <div className="flex justify-between items-center p-4 bg-red-100 rounded-lg">
                  <div>
                    <p className="text-lg font-semibold text-gray-900">
                      Total Tax Deductions
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Combined total of all tax deductions from your salary
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-red-700">
                      {formatCurrency(taxData.totalTaxDeductions)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tax Calculation Information */}
      <Card className="mt-6 bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <span className="text-xl">ℹ️</span>
            <div>
              <p className="font-semibold text-blue-900 mb-1">How Tax Deductions Are Calculated</p>
              <p className="text-sm text-blue-800 mb-3">
                Tax deductions are calculated based on your base salary and the applicable tax rates
                defined in the company's tax rules. Here's how it works:
              </p>
              <ul className="text-sm text-blue-800 list-disc list-inside space-y-1 mb-3">
                <li>
                  <strong>Calculation Basis:</strong> Tax deductions are calculated as a percentage of
                  your base salary (before allowances and bonuses).
                </li>
                <li>
                  <strong>Tax Rate:</strong> Each tax type has a specific rate (percentage) that is
                  applied to your base salary.
                </li>
                <li>
                  <strong>Formula:</strong> Tax Amount = Base Salary × Tax Rate (%)
                </li>
                <li>
                  <strong>Tax Types:</strong> Common tax deductions include income tax, social security
                  contributions, health insurance, and other statutory deductions.
                </li>
              </ul>
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> Tax rules and rates are determined by applicable laws and
                company policies. If you have questions about specific tax deductions, please contact
                HR or Payroll department.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

