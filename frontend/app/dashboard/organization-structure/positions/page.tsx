"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { SystemRole } from "@/types";
import { Button } from "@/components/shared/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shared/ui/Card";
import { useOrganizationStructure } from "@/lib/hooks/use-organization-structure";
import { PositionResponseDto } from "@/types/organization-structure";

export default function PositionsPage() {
  const router = useRouter();
  const { getPositions, deactivatePosition, loading, error } = useOrganizationStructure();
  const [positions, setPositions] = useState<PositionResponseDto[]>([]);
  const [filterActive, setFilterActive] = useState<boolean>(true);
  const [departmentFilter, setDepartmentFilter] = useState<string>("");

  useEffect(() => {
    fetchPositions();
  }, [filterActive, departmentFilter]);

  const fetchPositions = async () => {
    try {
      const params = {
        isActive: filterActive,
        ...(departmentFilter && { departmentId: departmentFilter })
      };
      const data = await getPositions(params);
      setPositions(data);
    } catch (err) {
      console.error("Failed to fetch positions:", err);
    }
  };

  const handleDeactivate = async (id: string) => {
    if (!confirm("Are you sure you want to deactivate this position? This will mark it as inactive.")) {
      return;
    }

    try {
      await deactivatePosition(id);
      fetchPositions(); // Refresh the list
    } catch (err) {
      console.error("Failed to deactivate position:", err);
    }
  };

  // Extract unique departments for filter
  const departments = Array.from(
    new Set(positions.map(pos => pos.departmentId))
  );

  return (
    <ProtectedRoute allowedRoles={[SystemRole.SYSTEM_ADMIN, SystemRole.HR_ADMIN]}>
      <div className="container mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Positions</h1>
              <p className="text-gray-600 mt-1">
                Manage job positions and organizational roles
              </p>
            </div>
            <Button
              onClick={() => router.push("/dashboard/organization-structure/positions/new")}
              variant="primary"
            >
              Create New Position
            </Button>
          </div>
          
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="activeFilter"
                  checked={filterActive}
                  onChange={(e) => setFilterActive(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <label htmlFor="activeFilter" className="text-sm text-gray-700">
                  Show active positions only
                </label>
              </div>
              
              {departments.length > 0 && (
                <div className="flex items-center gap-2">
                  <select
                    value={departmentFilter}
                    onChange={(e) => setDepartmentFilter(e.target.value)}
                    className="rounded border-gray-300 text-sm"
                  >
                    <option value="">All Departments</option>
                    {departments.map(deptId => (
                      <option key={deptId} value={deptId}>
                        Department: {deptId.substring(0, 8)}...
                      </option>
                    ))}
                  </select>
                </div>
              )}
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

        {/* Positions Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : positions.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500 text-lg">No positions found</p>
              <p className="text-gray-400 mt-2">
                {filterActive
                  ? "No active positions. Try showing inactive positions or create a new one."
                  : "No positions found with the current filter."}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {positions.map((position) => (
              <Card
                key={position._id}
                className={`hover:shadow-lg transition-shadow ${!position.isActive ? "opacity-75 bg-gray-50" : ""}`}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{position.title}</CardTitle>
                      <p className="text-sm text-gray-500 font-mono mt-1">{position.code}</p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        position.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {position.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  {position.description && (
                    <p className="text-gray-600 mb-4 line-clamp-2">{position.description}</p>
                  )}
                  
                  <div className="text-sm text-gray-500 mb-4">
                    <p>Department ID: {position.departmentId.substring(0, 8)}...</p>
                    {position.reportsToPositionId && (
                      <p className="mt-1">Reports to: {position.reportsToPositionId.substring(0, 8)}...</p>
                    )}
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <Button
                      onClick={() => router.push(`/dashboard/organization-structure/positions/${position._id}`)}
                      variant="outline"
                      size="sm"
                    >
                      View Details
                    </Button>
                    
                    {position.isActive && (
                      <div className="flex gap-2">
                        <Button
                          onClick={() => router.push(`/dashboard/organization-structure/positions/${position._id}/edit`)}
                          variant="ghost"
                          size="sm"
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDeactivate(position._id)}
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
              Showing {positions.length} position{positions.length !== 1 ? "s" : ""}
              {filterActive ? " (active only)" : " (all)"}
              {departmentFilter && " (filtered by department)"}
            </p>
            <div className="flex gap-4">
              <Link
                href="/dashboard/organization-structure/positions/hierarchy"
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
              >
                View Position Hierarchy →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}