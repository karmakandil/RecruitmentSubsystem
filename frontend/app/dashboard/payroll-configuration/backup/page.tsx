"use client";

import React, { useState } from 'react';
import { useAuth } from '@/lib/hooks/use-auth';
import { useRequireAuth } from '@/lib/hooks/use-auth';
import { SystemRole } from '@/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/shared/ui/Card';
import { Button } from '@/components/shared/ui/Button';

interface BackupRecord {
  id: string;
  createdAt: string;
  size: string;
  status: 'completed' | 'failed' | 'in-progress';
  type: 'manual' | 'scheduled';
}

export default function BackupPage() {
  const { user } = useAuth();
  useRequireAuth(SystemRole.SYSTEM_ADMIN);

  const [isCreatingBackup, setIsCreatingBackup] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Mock data - will be replaced with real API calls when backend is ready
  const [backupHistory] = useState<BackupRecord[]>([
    {
      id: '1',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      size: '2.5 MB',
      status: 'completed',
      type: 'manual',
    },
    {
      id: '2',
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      size: '2.4 MB',
      status: 'completed',
      type: 'scheduled',
    },
  ]);

  const handleCreateBackup = async () => {
    setError(null);
    setSuccess(null);
    setIsCreatingBackup(true);

    try {
      // TODO: Replace with actual API call when backend is ready
      // await backupApi.createManualBackup();
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      setSuccess('Backup created successfully');
    } catch (err: any) {
      setError(err.message || 'Failed to create backup');
    } finally {
      setIsCreatingBackup(false);
    }
  };

  const handleDownloadBackup = (backupId: string) => {
    // TODO: Implement download functionality when backend is ready
    alert(`Download backup ${backupId} - Backend API not yet implemented`);
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Backup Management</h1>
        <p className="text-gray-600 mt-1">
          Manage system backups and restore points (System Admin only)
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-300 bg-red-50 p-4 text-red-800">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 rounded-lg border border-green-300 bg-green-50 p-4 text-green-800">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Manual Backup */}
        <Card>
          <CardHeader>
            <CardTitle>Create Manual Backup</CardTitle>
            <CardDescription>
              Create a backup of all payroll configuration data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="primary"
              onClick={handleCreateBackup}
              isLoading={isCreatingBackup}
              className="w-full"
            >
              Create Backup Now
            </Button>
            <p className="mt-4 text-xs text-gray-500">
              Note: Backend API for backup management needs to be implemented.
              This is a UI placeholder.
            </p>
          </CardContent>
        </Card>

        {/* Backup Schedule */}
        <Card>
          <CardHeader>
            <CardTitle>Backup Schedule</CardTitle>
            <CardDescription>
              Configure automatic backup schedule
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Schedule Frequency
                </label>
                <select
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  disabled
                >
                  <option>Daily</option>
                  <option>Weekly</option>
                  <option>Monthly</option>
                </select>
              </div>
              <Button variant="outline" disabled className="w-full">
                Save Schedule
              </Button>
              <p className="text-xs text-gray-500">
                Backup schedule configuration will be available once backend API is implemented.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Backup History */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Backup History</CardTitle>
          <CardDescription>
            View and download previous backups
          </CardDescription>
        </CardHeader>
        <CardContent>
          {backupHistory.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No backups found
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Date & Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Size
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {backupHistory.map((backup) => (
                    <tr key={backup.id} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                        {new Date(backup.createdAt).toLocaleString()}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                        <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                          {backup.type}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                        {backup.size}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            backup.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : backup.status === 'failed'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {backup.status}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadBackup(backup.id)}
                        >
                          Download
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

