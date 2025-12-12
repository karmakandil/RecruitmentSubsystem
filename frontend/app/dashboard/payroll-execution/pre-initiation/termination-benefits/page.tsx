"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "../../../../../components/shared/ui/Card";
import { Button } from "../../../../../components/shared/ui/Button";
import { Input } from "../../../../../components/shared/ui/Input";
import { payrollExecutionApi } from "../../../../../lib/api/payroll-execution/payroll-execution";
import { EmployeeTerminationBenefit, BenefitStatus } from "../../../../../types/payroll-execution";
import Link from "next/link";

export default function TerminationBenefitsPage() {
  const router = useRouter();
  const [benefits, setBenefits] = useState<EmployeeTerminationBenefit[]>([]);
  const [filteredBenefits, setFilteredBenefits] = useState<EmployeeTerminationBenefit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<BenefitStatus | "ALL">("ALL");

  useEffect(() => {
    fetchTerminationBenefits();
  }, []);

  useEffect(() => {
    filterBenefits();
  }, [benefits, searchTerm, statusFilter]);

  const fetchTerminationBenefits = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await payrollExecutionApi.getTerminationBenefits();
      setBenefits(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error("Error fetching termination benefits:", err);
      setError(err.message || "Failed to fetch termination benefits");
      setBenefits([]);
    } finally {
      setLoading(false);
    }
  };

  const filterBenefits = () => {
    let filtered = [...benefits];

    // Filter by status
    if (statusFilter !== "ALL") {
      filtered = filtered.filter((benefit) => benefit.status === statusFilter);
    }

    // Filter by search term
    if (searchTerm && searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter((benefit) => {
        try {
          // Safely extract employee information
          let employeeName = "";
          let employeeId = "";
          
          if (benefit && benefit.employeeId) {
            if (typeof benefit.employeeId === "object" && benefit.employeeId !== null) {
              // Populated employee object
              const firstName = (benefit.employeeId as any).firstName || "";
              const lastName = (benefit.employeeId as any).lastName || "";
              employeeName = `${firstName} ${lastName}`.trim().toLowerCase();
              
              // Check employeeNumber (HR/Payroll number)
              const empNumber = (benefit.employeeId as any).employeeNumber || "";
              // Check employee _id (ObjectId)
              const empId = (benefit.employeeId as any)._id ? String((benefit.employeeId as any)._id).toLowerCase() : "";
              // Combine both for search
              employeeId = empNumber ? String(empNumber).toLowerCase() : empId;
            } else if (typeof benefit.employeeId === "string") {
              // Just an ID string - search by ObjectId
              employeeId = benefit.employeeId.toLowerCase();
            }
          }
          
          // Also check the benefit ID itself
          const benefitId = benefit._id ? String(benefit._id).toLowerCase() : "";
          
          return (
            (employeeName && employeeName.includes(searchLower)) ||
            (employeeId && employeeId.includes(searchLower)) ||
            (benefitId && benefitId.includes(searchLower))
          );
        } catch (error) {
          // If there's any error filtering, exclude this item from results
          console.warn("Error filtering benefit:", error, benefit);
          return false;
        }
      });
    }

    setFilteredBenefits(filtered);
  };

  const getStatusBadgeColor = (status: BenefitStatus) => {
    switch (status) {
      case BenefitStatus.APPROVED:
        return "bg-green-100 text-green-800";
      case BenefitStatus.REJECTED:
        return "bg-red-100 text-red-800";
      case BenefitStatus.PAID:
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const getBenefitType = (benefit: EmployeeTerminationBenefit) => {
    if (benefit.terminationId && typeof benefit.terminationId === "object" && benefit.terminationId !== null) {
      return benefit.terminationId.type;
    }
    return "Unknown";
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Termination Benefits Review</h1>
            <p className="text-gray-600">
              Review and approve pending termination/resignation benefits
            </p>
          </div>
          <Link href="/dashboard/payroll-execution/pre-initiation">
            <Button className="bg-gray-500 hover:bg-gray-600">Back</Button>
          </Link>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Filters */}
      <Card className="p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Search</label>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Search by employee name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    filterBenefits();
                  }
                }}
                className="flex-1"
              />
              <Button
                onClick={filterBenefits}
                className="bg-blue-600 hover:bg-blue-700 whitespace-nowrap"
              >
                Search
              </Button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Status Filter</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as BenefitStatus | "ALL")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Statuses</option>
              <option value={BenefitStatus.PENDING}>Pending</option>
              <option value={BenefitStatus.APPROVED}>Approved</option>
              <option value={BenefitStatus.REJECTED}>Rejected</option>
              <option value={BenefitStatus.PAID}>Paid</option>
            </select>
          </div>
          <div className="flex items-end">
            <Button
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("ALL");
              }}
              className="w-full bg-gray-500 hover:bg-gray-600"
            >
              Clear Filters
            </Button>
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card className="p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Benefit Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Given Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBenefits.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    No termination benefits found
                  </td>
                </tr>
              ) : (
                filteredBenefits.map((benefit) => (
                  <tr key={benefit._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {benefit.employeeId && typeof benefit.employeeId === "object" && benefit.employeeId !== null
                        ? `${benefit.employeeId.firstName || ""} ${benefit.employeeId.lastName || ""}`.trim() || "N/A"
                        : typeof benefit.employeeId === "string"
                        ? `Employee ID: ${benefit.employeeId}`
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {benefit.employeeId && typeof benefit.employeeId === "object" && benefit.employeeId !== null
                        ? benefit.employeeId.employeeNumber || (benefit.employeeId._id ? String(benefit.employeeId._id) : "N/A")
                        : typeof benefit.employeeId === "string"
                        ? benefit.employeeId
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getBenefitType(benefit)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      ${benefit.givenAmount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(
                          benefit.status
                        )}`}
                      >
                        {benefit.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <Link
                          href={`/dashboard/payroll-execution/pre-initiation/termination-benefits/review/${benefit._id}`}
                        >
                          <Button className="bg-blue-600 hover:bg-blue-700 text-sm">
                            Review
                          </Button>
                        </Link>
                        <Link
                          href={`/dashboard/payroll-execution/pre-initiation/termination-benefits/edit/${benefit._id}`}
                        >
                          <Button className="bg-yellow-600 hover:bg-yellow-700 text-sm">
                            Edit
                          </Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

