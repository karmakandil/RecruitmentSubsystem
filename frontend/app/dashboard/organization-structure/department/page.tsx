"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { SystemRole } from "@/types";
import { Button } from "@/components/shared/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shared/ui/Card";
import { useOrganizationStructure } from "@/lib/hooks/use-organization-structure";
import { DepartmentResponseDto } from "@/types/organization-structure";

export default function DepartmentsPage() {
  const router = useRouter();
  const { getDepartments, deactivateDepartment, loading, error } = useOrganizationStructure();
  const [departments, setDepartments] = useState<DepartmentResponseDto[]>([]);
  const [filterActive, setFilterActive] = useState<boolean>(true);

  useEffect(() => {
    fetchDepartments();
  }, [filterActive]);

  const fetchDepartments = async () => {
    try {
      const data = await getDepartments({ isActive: filterActive });
      setDepartments(data);
    } catch (err) {
      console.error("Failed to fetch departments:", err);
    }
  };

  const handleDeactivate = async (id: string) => {
    if (!confirm("Are you sure you want to deactivate this department? This will mark it as inactive.")) {
      return;
    }

    try {
      await deactivateDepartment(id);
      fetchDepartments(); // Refresh the list
    } catch (err) {
      console.error("Failed to deactivate department:", err);
    }
  };

  return (
    <ProtectedRoute allowedRoles={[SystemRole.SYSTEM_ADMIN, SystemRole.HR_ADMIN]}>
      <div className="container mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Departments</h1>
              <p className="text-gray-600 mt-1">
                Manage organizational departments and structure
              </p>
            </div>
            <Button
              onClick={() => router.push("/dashboard/organization-structure/departments/new")}
              variant="primary"
            >
              Create New Department
            </Button>
          </div>
          
          <div className="mt-4 flex items-center gap-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="activeFilter"
                checked={filterActive}
                onChange={(e) => setFilterActive(e.target.checked)}
                className="rounded border-gray-300"
              />
              <label htmlFor="activeFilter" className="text-sm text-gray-700">
                Show active departments only
              </label>
            </div>
            <Link
              href="/dashboard/organization-structure"
              className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
            >
              ← Back to Organization Structure
            </Link>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Departments Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : departments.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500 text-lg">No departments found</p>
              <p className="text-gray-400 mt-2">
                {filterActive
                  ? "No active departments. Try showing inactive departments or create a new one."
                  : "No departments found with the current filter."}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments.map((dept) => (
              <Card
                key={dept._id}
                className={`hover:shadow-lg transition-shadow ${!dept.isActive ? "opacity-75 bg-gray-50" : ""}`}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{dept.name}</CardTitle>
                      <p className="text-sm text-gray-500 font-mono mt-1">{dept.code}</p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        dept.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {dept.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  {dept.description && (
                    <p className="text-gray-600 mb-4">{dept.description}</p>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <Button
                      onClick={() => router.push(`/dashboard/organization-structure/departments/${dept._id}`)}
                      variant="outline"
                      size="sm"
                    >
                      View Details
                    </Button>
                    
                    {dept.isActive && (
                      <div className="flex gap-2">
                        <Button
                          onClick={() => router.push(`/dashboard/organization-structure/departments/${dept._id}/edit`)}
                          variant="ghost"
                          size="sm"
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDeactivate(dept._id)}
                          variant="danger"
                          size="sm"
                        >
                          Deactivate
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Stats Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Showing {departments.length} department{departments.length !== 1 ? "s" : ""}
              {filterActive ? " (active only)" : " (all)"}
            </p>
            <Link
              href="/dashboard/organization-structure/departments/hierarchy"
              className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
            >
              View Department Hierarchy →
            </Link>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}