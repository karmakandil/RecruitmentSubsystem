"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { SystemRole } from "@/types";
import { Button } from "@/components/shared/ui/Button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/shared/ui/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/shared/ui/Tabs";
import { Input } from "@/components/shared/ui/Input";
import { useOrganizationStructure } from "@/lib/hooks/use-organization-structure";
import { DepartmentResponseDto, PositionResponseDto } from "@/types/organization-structure";

// Mock data for visualization (replace with API calls)
const mockHierarchyData = {
  departments: [
    {
      id: "1",
      name: "Executive",
      code: "EXEC",
      positions: [
        { id: "p1", title: "CEO", employee: "John Smith" },
        { id: "p2", title: "CFO", employee: "Sarah Johnson" },
        { id: "p3", title: "CTO", employee: "Michael Chen" }
      ]
    },
    {
      id: "2",
      name: "Human Resources",
      code: "HR",
      positions: [
        { id: "p4", title: "HR Director", employee: "Emma Wilson" },
        { id: "p5", title: "Recruitment Manager", employee: "David Lee" },
        { id: "p6", title: "Training Specialist", employee: "Lisa Garcia" }
      ]
    },
    {
      id: "3",
      name: "Engineering",
      code: "ENG",
      positions: [
        { id: "p7", title: "Engineering Director", employee: "Robert Kim" },
        { id: "p8", title: "Senior Developer", employee: "Alex Wong" },
        { id: "p9", title: "QA Engineer", employee: "Maria Rodriguez" }
      ]
    }
  ]
};

export default function HierarchyDashboardPage() {
  const router = useRouter();
  const { getDepartmentHierarchy, getPositions, loading, error } = useOrganizationStructure();
  
  const [viewType, setViewType] = useState<"chart" | "list" | "tree">("chart");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [hierarchyData, setHierarchyData] = useState<any>(null);
  const [positions, setPositions] = useState<PositionResponseDto[]>([]);

  useEffect(() => {
    // TODO: Replace with actual API calls
    // fetchHierarchyData();
    // fetchPositions();
    
    // Using mock data for now
    setHierarchyData(mockHierarchyData);
    
    // Simulate API loading
    const timer = setTimeout(() => {
      // Mock positions data
      setPositions([
        { _id: "p1", code: "CEO-001", title: "CEO", departmentId: "1", isActive: true, createdAt: new Date(), updatedAt: new Date() },
        { _id: "p2", code: "CFO-001", title: "CFO", departmentId: "1", isActive: true, createdAt: new Date(), updatedAt: new Date() },
        { _id: "p4", code: "HRD-001", title: "HR Director", departmentId: "2", isActive: true, createdAt: new Date(), updatedAt: new Date() },
        { _id: "p7", code: "ENGD-001", title: "Engineering Director", departmentId: "3", isActive: true, createdAt: new Date(), updatedAt: new Date() },
      ]);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const fetchHierarchyData = async () => {
    try {
      const data = await getDepartmentHierarchy();
      setHierarchyData(data);
    } catch (err) {
      console.error("Failed to fetch hierarchy:", err);
    }
  };

  const fetchPositions = async () => {
    try {
      const data = await getPositions({ isActive: true });
      setPositions(data);
    } catch (err) {
      console.error("Failed to fetch positions:", err);
    }
  };

  const filteredDepartments = hierarchyData?.departments?.filter((dept: any) =>
    dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dept.code.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <ProtectedRoute
      allowedRoles={[
        SystemRole.SYSTEM_ADMIN,
        SystemRole.HR_ADMIN,
        SystemRole.HR_MANAGER,
        SystemRole.DEPARTMENT_HEAD,
        SystemRole.DEPARTMENT_EMPLOYEE,
      ]}
    >
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Organization Chart</h1>
              <p className="text-gray-600 mt-1">
                Visualize your organizational structure and reporting lines
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => router.push("/dashboard/organization-structure/departments")}
              >
                Manage Departments
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push("/dashboard/organization-structure/positions")}
              >
                Manage Positions
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center text-sm text-gray-600 mb-6">
            <Link href="/dashboard" className="hover:text-blue-600">
              Dashboard
            </Link>
            <span className="mx-2">/</span>
            <Link href="/dashboard/organization-structure" className="hover:text-blue-600">
              Organization Structure
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">Organization Chart</span>
          </div>
        </div>

        {/* Controls */}
        <div className="mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Search */}
                <div className="flex-1 max-w-md">
                  <Input
                    type="text"
                    placeholder="Search departments or positions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full"
                  />
                </div>

                {/* View Toggle */}
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-700">View:</span>
                  <Tabs defaultValue="chart" className="w-[400px]" onValueChange={(value) => setViewType(value as any)}>
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="chart">Chart View</TabsTrigger>
                      <TabsTrigger value="list">List View</TabsTrigger>
                      <TabsTrigger value="tree">Tree View</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Loading organization chart...</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Chart View */}
            {viewType === "chart" && (
              <Card>
                <CardHeader>
                  <CardTitle>Organization Chart</CardTitle>
                  <CardDescription>
                    Interactive visualization of departments and positions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Executive Level */}
                  <div className="mb-12">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">Executive Leadership</h3>
                    <div className="flex flex-wrap justify-center gap-6">
                      {filteredDepartments
                        .filter((dept: any) => dept.code === "EXEC")
                        .map((dept: any) => (
                          <div key={dept.id} className="text-center">
                            <div className="inline-block p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl shadow-sm">
                              <div className="text-sm font-medium text-blue-800 mb-1">{dept.code}</div>
                              <div className="text-xl font-bold text-gray-900 mb-3">{dept.name}</div>
                              <div className="space-y-3">
                                {dept.positions.map((pos: any) => (
                                  <div key={pos.id} className="p-3 bg-white rounded-lg border border-gray-200">
                                    <div className="font-medium text-gray-900">{pos.title}</div>
                                    <div className="text-sm text-gray-600">{pos.employee}</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Department Levels */}
                  <div className="space-y-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Departments</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredDepartments
                        .filter((dept: any) => dept.code !== "EXEC")
                        .map((dept: any) => (
                          <Card key={dept.id} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                              <div className="flex items-center justify-between">
                                <div>
                                  <CardTitle>{dept.name}</CardTitle>
                                  <CardDescription className="font-mono">{dept.code}</CardDescription>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setSelectedDepartment(
                                    selectedDepartment === dept.id ? null : dept.id
                                  )}
                                >
                                  {selectedDepartment === dept.id ? "Hide" : "Show"} Positions
                                </Button>
                              </div>
                            </CardHeader>
                            <CardContent>
                              {selectedDepartment === dept.id && (
                                <div className="space-y-3 mt-4">
                                  {dept.positions.map((pos: any) => (
                                    <div key={pos.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                                      <div className="font-medium text-gray-900">{pos.title}</div>
                                      <div className="text-sm text-gray-600">{pos.employee}</div>
                                    </div>
                                  ))}
                                </div>
                              )}
                              <div className="mt-4 pt-4 border-t border-gray-200">
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-600">
                                    {dept.positions.length} position{dept.positions.length !== 1 ? "s" : ""}
                                  </span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => router.push(`/dashboard/organization-structure/departments`)}
                                  >
                                    View Details →
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* List View */}
            {viewType === "list" && (
              <Card>
                <CardHeader>
                  <CardTitle>Department List</CardTitle>
                  <CardDescription>
                    Detailed list of all departments and their positions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Department
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Code
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Positions
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredDepartments.map((dept: any) => (
                          <tr key={dept.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="font-medium text-gray-900">{dept.name}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <code className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                                {dept.code}
                              </code>
                            </td>
                            <td className="px-6 py-4">
                              <div className="space-y-2">
                                {dept.positions.map((pos: any) => (
                                  <div key={pos.id} className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                    <span className="text-sm text-gray-700">{pos.title}</span>
                                    <span className="text-xs text-gray-500">({pos.employee})</span>
                                  </div>
                                ))}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => router.push(`/dashboard/organization-structure/departments`)}
                              >
                                View
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Tree View */}
            {viewType === "tree" && (
              <Card>
                <CardHeader>
                  <CardTitle>Reporting Structure Tree</CardTitle>
                  <CardDescription>
                    Hierarchical view of reporting lines and management structure
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    {/* CEO Level */}
                    <div className="flex justify-center mb-12">
                      <div className="text-center">
                        <div className="inline-block p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-300 rounded-xl shadow-lg">
                          <div className="text-2xl font-bold text-gray-900">CEO</div>
                          <div className="text-sm text-gray-600 mt-1">John Smith</div>
                          <div className="text-xs text-purple-600 mt-2">Executive Department</div>
                        </div>
                      </div>
                    </div>

                    {/* Connector Lines */}
                    <div className="absolute top-32 left-1/2 transform -translate-x-1/2 w-1 h-16 bg-gray-300"></div>

                    {/* Department Heads Level */}
                    <div className="flex justify-center gap-8 mb-8">
                      {["CFO", "CTO", "HR Director"].map((title, index) => (
                        <div key={index} className="text-center">
                          <div className="mb-2">
                            <div className="inline-block p-4 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg">
                              <div className="font-bold text-gray-900">{title}</div>
                              <div className="text-xs text-gray-600 mt-1">
                                {title === "CFO" ? "Sarah Johnson" : 
                                 title === "CTO" ? "Michael Chen" : "Emma Wilson"}
                              </div>
                            </div>
                          </div>
                          <div className="text-xs text-gray-500">Reports to CEO</div>
                        </div>
                      ))}
                    </div>

                    {/* Team Members Level */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {["Engineering", "Finance", "HR"].map((dept, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-4">
                          <h4 className="font-semibold text-gray-900 mb-3">{dept} Team</h4>
                          <div className="space-y-2">
                            {dept === "Engineering" && ["Senior Developer", "QA Engineer", "DevOps"].map((role, i) => (
                              <div key={i} className="flex items-center gap-2 p-2 bg-white rounded border">
                                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                <span className="text-sm">{role}</span>
                              </div>
                            ))}
                            {dept === "Finance" && ["Accountant", "Financial Analyst"].map((role, i) => (
                              <div key={i} className="flex items-center gap-2 p-2 bg-white rounded border">
                                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                <span className="text-sm">{role}</span>
                              </div>
                            ))}
                            {dept === "HR" && ["Recruiter", "Training Specialist"].map((role, i) => (
                              <div key={i} className="flex items-center gap-2 p-2 bg-white rounded border">
                                <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                                <span className="text-sm">{role}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Stats Summary */}
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">
                      {hierarchyData?.departments?.length || 0}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">Total Departments</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">
                      {hierarchyData?.departments?.reduce((acc: number, dept: any) => acc + dept.positions.length, 0) || 0}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">Total Positions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">
                      {positions.filter(p => p.isActive).length}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">Active Positions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-amber-600">1</div>
                    <div className="text-sm text-gray-600 mt-1">Organization Levels</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Export Options */}
            <Card>
              <CardHeader>
                <CardTitle>Export & Reports</CardTitle>
                <CardDescription>
                  Generate reports or export the organization chart
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  <Button variant="outline">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Export as PDF
                  </Button>
                  <Button variant="outline">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Export as Image
                  </Button>
                  <Button variant="outline">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Print Chart
                  </Button>
                  <Button variant="outline">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Generate Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Footer Navigation */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <Link
              href="/dashboard/organization-structure"
              className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
            >
              ← Back to Organization Structure
            </Link>
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => router.push("/dashboard/employee-profile/team")}
              >
                View My Team Structure
              </Button>
              <Button
                variant="primary"
                onClick={() => router.push("/dashboard/organization-structure/change-requests/new")}
              >
                Request Structure Change
              </Button>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}