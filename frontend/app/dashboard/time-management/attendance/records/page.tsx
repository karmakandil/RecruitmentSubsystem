"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/hooks/use-auth";
import Link from "next/link";
import { AttendanceRecordTable } from "@/components/time-management/AttendanceRecordTable";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/shared/ui/Card";
import { timeManagementApi } from "@/lib/api/time-management/time-management.api";

export default function AttendanceRecordsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
  });

  // Fetch records
  useEffect(() => {
    if (!user?.id) return;

    const fetchRecords = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await timeManagementApi.getAttendanceRecords(user.id, {
          startDate: filters.startDate || undefined,
          endDate: filters.endDate || undefined,
        });
        
        // Handle different response formats
        const records = response?.records || response?.attendanceRecords || response || [];
        setRecords(Array.isArray(records) ? records : []);
      } catch (err: any) {
        console.error("Failed to fetch records:", err);
        setError(err?.message || "Failed to load attendance records");
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, [user?.id, filters]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Attendance Records</h1>
          <p className="text-gray-600 mt-1">View all your attendance and clock in/out records</p>
        </div>
        <Link
          href="/dashboard/time-management/attendance"
          className="text-blue-600 hover:underline font-medium"
        >
          ← Back to Attendance
        </Link>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filter Records</CardTitle>
          <CardDescription>Filter by date range</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <input
                type="date"
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <input
                type="date"
                name="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Records Table */}
      <Card>
        <CardHeader>
          <CardTitle>Records</CardTitle>
          <CardDescription>
            {loading ? "Loading..." : `${records.length} records found`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Loading attendance records...</p>
            </div>
          ) : (
            <AttendanceRecordTable records={records} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
