"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useRequireAuth } from "@/lib/hooks/use-auth";
import { SystemRole } from "@/types";
import { Card } from "../../../../../components/shared/ui/Card";
import { Button } from "../../../../../components/shared/ui/Button";
import { Input } from "../../../../../components/shared/ui/Input";
import { payrollExecutionApi } from "../../../../../lib/api/payroll-execution/payroll-execution";
import { EmployeeSigningBonus, BonusStatus } from "../../../../../types/payroll-execution";
import Link from "next/link";

export default function SigningBonusesPage() {
  const router = useRouter();
  // Only Payroll Specialist can review and approve signing bonuses
  useRequireAuth(SystemRole.PAYROLL_SPECIALIST);
  const [signingBonuses, setSigningBonuses] = useState<EmployeeSigningBonus[]>([]);
  const [filteredBonuses, setFilteredBonuses] = useState<EmployeeSigningBonus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<BonusStatus | "ALL">("ALL");

  useEffect(() => {
    fetchSigningBonuses();
  }, []);

  useEffect(() => {
    filterBonuses();
  }, [signingBonuses, searchTerm, statusFilter]);

  const fetchSigningBonuses = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await payrollExecutionApi.getSigningBonuses();
      setSigningBonuses(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error("Error fetching signing bonuses:", err);
      setError(err.message || "Failed to fetch signing bonuses");
      setSigningBonuses([]);
    } finally {
      setLoading(false);
    }
  };

  const filterBonuses = () => {
    let filtered = [...signingBonuses];

    // Filter by status
    if (statusFilter !== "ALL") {
      filtered = filtered.filter((bonus) => bonus.status === statusFilter);
    }

    // Filter by search term
    if (searchTerm && searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter((bonus) => {
        try {
          // Safely extract employee information
          let employeeName = "";
          let employeeId = "";
          
          if (bonus && bonus.employeeId) {
            if (typeof bonus.employeeId === "object" && bonus.employeeId !== null) {
              // Populated employee object
              const firstName = (bonus.employeeId as any).firstName || "";
              const lastName = (bonus.employeeId as any).lastName || "";
              employeeName = `${firstName} ${lastName}`.trim().toLowerCase();
              
              // Check employeeNumber (HR/Payroll number)
              const empNumber = (bonus.employeeId as any).employeeNumber || "";
              // Check employee _id (ObjectId)
              const empId = (bonus.employeeId as any)._id ? String((bonus.employeeId as any)._id).toLowerCase() : "";
              // Combine both for search
              employeeId = empNumber ? String(empNumber).toLowerCase() : empId;
            } else if (typeof bonus.employeeId === "string") {
              // Just an ID string - search by ObjectId
              employeeId = bonus.employeeId.toLowerCase();
            }
          }
          
          // Also check the bonus ID itself
          const bonusId = bonus._id ? String(bonus._id).toLowerCase() : "";
          
          return (
            (employeeName && employeeName.includes(searchLower)) ||
            (employeeId && employeeId.includes(searchLower)) ||
            (bonusId && bonusId.includes(searchLower))
          );
        } catch (error) {
          // If there's any error filtering, exclude this item from results
          console.warn("Error filtering bonus:", error, bonus);
          return false;
        }
      });
    }

    setFilteredBonuses(filtered);
  };

  const getStatusBadgeColor = (status: BonusStatus) => {
    switch (status) {
      case BonusStatus.APPROVED:
        return "bg-green-100 text-green-800";
      case BonusStatus.REJECTED:
        return "bg-red-100 text-red-800";
      case BonusStatus.PAID:
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
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
            <h1 className="text-3xl font-bold mb-2">Signing Bonuses Review</h1>
            <p className="text-gray-600">
              As a Payroll Specialist, review and approve processed signing bonuses. Approve or reject signing bonuses based on eligibility and compliance.
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
                    filterBonuses();
                  }
                }}
                className="flex-1"
              />
              <Button
                onClick={filterBonuses}
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
              onChange={(e) => setStatusFilter(e.target.value as BonusStatus | "ALL")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Statuses</option>
              <option value={BonusStatus.PENDING}>Pending</option>
              <option value={BonusStatus.APPROVED}>Approved</option>
              <option value={BonusStatus.REJECTED}>Rejected</option>
              <option value={BonusStatus.PAID}>Paid</option>
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
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> Only signing bonuses with <span className="font-semibold">PENDING</span> status can be reviewed and approved/rejected. 
            Approved, rejected, or paid signing bonuses are read-only.
          </p>
        </div>
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
              {filteredBonuses.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    No signing bonuses found
                  </td>
                </tr>
              ) : (
                filteredBonuses.map((bonus) => (
                  <tr key={bonus._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {bonus.employeeId && typeof bonus.employeeId === "object" && bonus.employeeId !== null
                        ? `${bonus.employeeId.firstName || ""} ${bonus.employeeId.lastName || ""}`.trim() || "N/A"
                        : typeof bonus.employeeId === "string"
                        ? `Employee ID: ${bonus.employeeId}`
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {bonus.employeeId && typeof bonus.employeeId === "object" && bonus.employeeId !== null
                        ? bonus.employeeId.employeeNumber || (bonus.employeeId._id ? String(bonus.employeeId._id) : "N/A")
                        : typeof bonus.employeeId === "string"
                        ? bonus.employeeId
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      ${bonus.givenAmount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(
                          bonus.status
                        )}`}
                      >
                        {bonus.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        {bonus.status === BonusStatus.PENDING && (
                          <Link
                            href={`/dashboard/payroll-execution/pre-initiation/signing-bonuses/review/${bonus._id}`}
                          >
                            <Button className="bg-blue-600 hover:bg-blue-700 text-sm">
                              Review & Approve/Reject
                            </Button>
                          </Link>
                        )}
                        {bonus.status === BonusStatus.PENDING && (
                          <Link
                            href={`/dashboard/payroll-execution/pre-initiation/signing-bonuses/edit/${bonus._id}`}
                          >
                            <Button className="bg-yellow-600 hover:bg-yellow-700 text-sm">
                              Edit
                            </Button>
                          </Link>
                        )}
                        {bonus.status !== BonusStatus.PENDING && (
                          <span className="text-gray-500 text-xs">
                            {bonus.status === BonusStatus.APPROVED ? 'Approved' : 
                             bonus.status === BonusStatus.REJECTED ? 'Rejected' : 
                             bonus.status === BonusStatus.PAID ? 'Paid' : 'N/A'}
                          </span>
                        )}
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

