"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useRequireAuth } from "@/lib/hooks/use-auth";
import { SystemRole } from "@/types";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/shared/ui/Card";
import { Button } from "@/components/shared/ui/Button";

type ReportType = "taxes" | "insurance" | "benefits";
type SummaryType = "month-end" | "year-end";

export default function FinanceReportsPage() {
  useRequireAuth(SystemRole.FINANCE_STAFF);
  const router = useRouter();

  const [reportType, setReportType] = useState<ReportType>("taxes");
  const [period, setPeriod] = useState("2025");
  const [range, setRange] = useState({ from: "", to: "" });
  const [summaryType, setSummaryType] = useState<SummaryType>("month-end");
  const [month, setMonth] = useState("02"); // default February for example

  const handleGenerate = () => {
    alert(
      `Report generation placeholder:\nType: ${reportType}\nYear/Period: ${period}\nFrom: ${range.from || "-"}\nTo: ${range.to || "-"}\n\nHook this to the backend reporting endpoints when available.`
    );
  };

  const handleDownload = () => {
    alert("Download placeholder. Integrate with backend export endpoint (CSV/PDF).");
  };

  const handleGenerateSummary = () => {
    const periodLabel =
      summaryType === "month-end"
        ? `Month-end ${period}-${month}`
        : `Year-end ${period}`;
    alert(
      `Payroll summary placeholder:\nType: ${summaryType}\nPeriod: ${periodLabel}\n\nHook this to backend summary endpoints (month-end / year-end payroll summaries).`
    );
  };

  const handleDownloadSummary = () => {
    alert("Download placeholder for payroll summaries. Connect to backend export (CSV/PDF).");
  };

  const renderDescription = () => {
    switch (reportType) {
      case "taxes":
        return "Summaries of income tax, social contributions, and withholding for compliance.";
      case "insurance":
        return "Employee/employer insurance contributions and brackets for the selected period.";
      case "benefits":
        return "Allowances and benefits paid (transportation, bonuses, encashment) for audit and accounting.";
      default:
        return "";
    }
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Finance Reports</h1>
          <p className="text-gray-600 mt-1">
            Generate tax, insurance, and benefits reports for accounting compliance
          </p>
        </div>
        <Button variant="outline" onClick={() => router.push("/dashboard/finance")}>
          Back to Finance Dashboard
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Report Type</CardTitle>
            <CardDescription>Select the report to generate</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex flex-col gap-2">
              <Button
                variant={reportType === "taxes" ? "primary" : "outline"}
                onClick={() => setReportType("taxes")}
                className="justify-start"
              >
                📊 Taxes & Withholding
              </Button>
              <Button
                variant={reportType === "insurance" ? "primary" : "outline"}
                onClick={() => setReportType("insurance")}
                className="justify-start"
              >
                🛡️ Insurance Contributions
              </Button>
              <Button
                variant={reportType === "benefits" ? "primary" : "outline"}
                onClick={() => setReportType("benefits")}
                className="justify-start"
              >
                🎁 Benefits & Allowances
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Period</CardTitle>
            <CardDescription>Select year or payroll period</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {["2025", "2024", "2023"].map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">From (optional)</label>
                <input
                  type="date"
                  value={range.from}
                  onChange={(e) => setRange((r) => ({ ...r, from: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">To (optional)</label>
                <input
                  type="date"
                  value={range.to}
                  onChange={(e) => setRange((r) => ({ ...r, to: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <p className="text-xs text-gray-500">
              If no dates are selected, the full year report for the selected year will be generated.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
            <CardDescription>Generate or download the report</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-gray-600">{renderDescription()}</p>
            <div className="flex gap-2">
              <Button onClick={handleGenerate} className="flex-1">
                Generate
              </Button>
              <Button variant="outline" onClick={handleDownload} className="flex-1">
                Download
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              Hook these actions to backend reporting/export endpoints (CSV/PDF) when available.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Payroll Summaries (Month-end / Year-end) */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Payroll Summaries</CardTitle>
          <CardDescription>
            Generate month-end and year-end payroll summaries for audits and reporting
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-700">Summary Type</p>
            <div className="flex flex-col gap-2">
              <Button
                variant={summaryType === "month-end" ? "primary" : "outline"}
                className="justify-start"
                onClick={() => setSummaryType("month-end")}
              >
                📅 Month-end Summary
              </Button>
              <Button
                variant={summaryType === "year-end" ? "primary" : "outline"}
                className="justify-start"
                onClick={() => setSummaryType("year-end")}
              >
                🗓️ Year-end Summary
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-700">Period</p>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Year</label>
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {["2025", "2024", "2023"].map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
            {summaryType === "month-end" && (
              <div>
                <label className="block text-sm text-gray-600 mb-1">Month</label>
                <select
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {[
                    ["01", "January"],
                    ["02", "February"],
                    ["03", "March"],
                    ["04", "April"],
                    ["05", "May"],
                    ["06", "June"],
                    ["07", "July"],
                    ["08", "August"],
                    ["09", "September"],
                    ["10", "October"],
                    ["11", "November"],
                    ["12", "December"],
                  ].map(([val, label]) => (
                    <option key={val} value={val}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-700">Actions</p>
            <p className="text-sm text-gray-600">
              Summaries of payroll totals, taxes, deductions, contributions, and benefits for audits.
            </p>
            <div className="flex gap-2">
              <Button className="flex-1" onClick={handleGenerateSummary}>
                Generate Summary
              </Button>
              <Button variant="outline" className="flex-1" onClick={handleDownloadSummary}>
                Download
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              Connect these actions to backend summary endpoints (CSV/PDF) when available.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Report Preview</CardTitle>
          <CardDescription>Key fields expected in the generated report</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes (optional)
            </label>
            <textarea
              placeholder="Add any specific instructions or clarifications for this report..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              rows={3}
            />
          </div>
          <table className="w-full text-sm border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-3 py-2 border-b border-gray-200">Field</th>
                <th className="text-left px-3 py-2 border-b border-gray-200">Description</th>
              </tr>
            </thead>
            <tbody>
              {reportType === "taxes" && (
                <>
                  <tr>
                    <td className="px-3 py-2 border-b border-gray-100">Employee</td>
                    <td className="px-3 py-2 border-b border-gray-100">Name, number, department</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 border-b border-gray-100">Period</td>
                    <td className="px-3 py-2 border-b border-gray-100">Payroll period or date range</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 border-b border-gray-100">Tax Rules</td>
                    <td className="px-3 py-2 border-b border-gray-100">Tax name, rate, basis, law/reference</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 border-b border-gray-100">Amounts</td>
                    <td className="px-3 py-2 border-b border-gray-100">Taxable income, withheld, total taxes</td>
                  </tr>
                </>
              )}
              {reportType === "insurance" && (
                <>
                  <tr>
                    <td className="px-3 py-2 border-b border-gray-100">Employee</td>
                    <td className="px-3 py-2 border-b border-gray-100">Name, number, department</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 border-b border-gray-100">Insurance</td>
                    <td className="px-3 py-2 border-b border-gray-100">Plan/Bracket, coverage type</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 border-b border-gray-100">Contributions</td>
                    <td className="px-3 py-2 border-b border-gray-100">Employee vs Employer amounts</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 border-b border-gray-100">Totals</td>
                    <td className="px-3 py-2 border-b border-gray-100">Aggregate contributions per period</td>
                  </tr>
                </>
              )}
              {reportType === "benefits" && (
                <>
                  <tr>
                    <td className="px-3 py-2 border-b border-gray-100">Employee</td>
                    <td className="px-3 py-2 border-b border-gray-100">Name, number, department</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 border-b border-gray-100">Benefit Type</td>
                    <td className="px-3 py-2 border-b border-gray-100">Transportation, allowances, bonuses, encashment</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 border-b border-gray-100">Amounts</td>
                    <td className="px-3 py-2 border-b border-gray-100">Benefit amount and totals per period</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 border-b border-gray-100">Notes</td>
                    <td className="px-3 py-2 border-b border-gray-100">Approvals and references</td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}

