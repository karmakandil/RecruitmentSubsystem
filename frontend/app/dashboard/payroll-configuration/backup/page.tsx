"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/hooks/use-auth';
import { useRequireAuth } from '@/lib/hooks/use-auth';
import { SystemRole } from '@/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/shared/ui/Card';
import { Button } from '@/components/shared/ui/Button';
import { backupApi, BackupRecord, BackupSchedule } from '@/lib/api/payroll-configuration/backup';
import { Download, Database, Clock, CheckCircle, XCircle } from 'lucide-react';

export default function BackupPage() {
  const { user } = useAuth();
  useRequireAuth(SystemRole.SYSTEM_ADMIN);

  const [isCreatingBackup, setIsCreatingBackup] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [backupHistory, setBackupHistory] = useState<BackupRecord[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [backupSchedule, setBackupSchedule] = useState<BackupSchedule | null>(null);
  const [isLoadingSchedule, setIsLoadingSchedule] = useState(false);
  const [scheduleForm, setScheduleForm] = useState({
    frequency: 'daily' as 'daily' | 'weekly' | 'monthly',
    time: '02:00',
    enabled: false,
  });

  useEffect(() => {
    loadBackupHistory();
    loadBackupSchedule();
  }, []);

  // Auto-dismiss success message after 5 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const loadBackupHistory = async () => {
    try {
      setIsLoadingHistory(true);
      setError(null);
      // API will return empty array for 404s, so this should never throw for missing endpoints
      const data = await backupApi.getHistory();
      setBackupHistory(data);
    } catch (err: any) {
      // This catch should only trigger for non-404 errors
      // Check multiple error formats
      const status = err?.response?.status || err?.status;
      const message = String(err?.message || '');
      const is404 = status === 404 || 
                    message.includes('404') || 
                    message.includes('Cannot GET') || 
                    message.includes('Not Found') ||
                    message.includes('not found') ||
                    message.includes('not yet implemented');
      
      if (!is404) {
        // Only show real errors (not 404s)
        setError(err.message || 'Failed to load backup history');
      }
      // Always set empty array on error (404s are handled silently by API)
      setBackupHistory([]);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const loadBackupSchedule = async () => {
    try {
      setIsLoadingSchedule(true);
      // API will return null for 404s, so this should never throw for missing endpoints
      const schedule = await backupApi.getSchedule();
      if (schedule) {
        setBackupSchedule(schedule);
        setScheduleForm({
          frequency: schedule.frequency,
          time: schedule.time || '02:00',
          enabled: schedule.enabled,
        });
      }
    } catch (err: any) {
      // This catch should only trigger for non-404 errors
      // Check multiple error formats
      const status = err?.response?.status || err?.status;
      const message = String(err?.message || '');
      const is404 = status === 404 || 
                    message.includes('404') || 
                    message.includes('Cannot GET') || 
                    message.includes('Not Found') ||
                    message.includes('not found') ||
                    message.includes('not yet implemented');
      
      if (!is404) {
        // Only log actual errors, not 404s
        console.error('Error loading backup schedule:', err);
      }
    } finally {
      setIsLoadingSchedule(false);
    }
  };

  const handleCreateBackup = async () => {
    setError(null);
    setSuccess(null);
    setIsCreatingBackup(true);

    try {
      const result = await backupApi.createManualBackup();
      setSuccess(result.message || 'Backup created successfully. The backup is being processed.');
      // Refresh backup history after a short delay
      setTimeout(() => {
        loadBackupHistory();
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to create backup');
    } finally {
      setIsCreatingBackup(false);
    }
  };

  const handleDownloadBackup = async (backupId: string) => {
    try {
      setError(null);
      const blob = await backupApi.downloadBackup(backupId);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `backup-${backupId}.zip` || `backup-${new Date().toISOString()}.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      setSuccess('Backup download started');
    } catch (err: any) {
      setError(err.message || 'Failed to download backup');
    }
  };

  const handleSaveSchedule = async () => {
    try {
      setError(null);
      setSuccess(null);
      const schedule: BackupSchedule = {
        frequency: scheduleForm.frequency,
        time: scheduleForm.time,
        enabled: scheduleForm.enabled,
      };
      await backupApi.updateSchedule(schedule);
      setBackupSchedule(schedule);
      setSuccess('Backup schedule updated successfully');
    } catch (err: any) {
      setError(err.message || 'Failed to update backup schedule');
    }
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Backup Management</h1>
        <p className="text-gray-600 mt-1">
          Back up data regularly so nothing is lost. Create manual backups or configure automatic scheduled backups.
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
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-gray-600" />
              <CardTitle>Create Manual Backup</CardTitle>
            </div>
            <CardDescription>
              Create a backup of all payroll configuration data immediately
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="primary"
              onClick={handleCreateBackup}
              isLoading={isCreatingBackup}
              className="w-full"
            >
              {isCreatingBackup ? 'Creating Backup...' : 'Create Backup Now'}
            </Button>
            <p className="mt-4 text-xs text-gray-500">
              This will create a complete backup of all payroll configuration data including policies, pay grades, allowances, tax rules, and settings.
            </p>
          </CardContent>
        </Card>

        {/* Backup Schedule */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-gray-600" />
              <CardTitle>Backup Schedule</CardTitle>
            </div>
            <CardDescription>
              Configure automatic backup schedule for regular data protection
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="enableSchedule"
                  checked={scheduleForm.enabled}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, enabled: e.target.checked })}
                  className="h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300 rounded"
                />
                <label htmlFor="enableSchedule" className="ml-2 block text-sm text-gray-700">
                  Enable automatic backups
                </label>
              </div>

              {scheduleForm.enabled && (
                <>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Schedule Frequency
                    </label>
                    <select
                      value={scheduleForm.frequency}
                      onChange={(e) => setScheduleForm({ ...scheduleForm, frequency: e.target.value as 'daily' | 'weekly' | 'monthly' })}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500/20"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Backup Time
                    </label>
                    <input
                      type="time"
                      value={scheduleForm.time}
                      onChange={(e) => setScheduleForm({ ...scheduleForm, time: e.target.value })}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500/20"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Time when automatic backups should run (24-hour format)
                    </p>
                  </div>
                </>
              )}

              <Button 
                variant="outline" 
                onClick={handleSaveSchedule}
                className="w-full"
                disabled={!scheduleForm.enabled}
              >
                Save Schedule
              </Button>
              {backupSchedule && (
                <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-xs text-green-800">
                    <strong>Current Schedule:</strong> {backupSchedule.enabled 
                      ? `${backupSchedule.frequency} at ${backupSchedule.time || '02:00'}`
                      : 'Automatic backups are disabled'}
                  </p>
                </div>
              )}
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
          {isLoadingHistory ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
            </div>
          ) : backupHistory.length === 0 ? (
            <div className="text-center py-12">
              <Database className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-2 font-medium">No backups found</p>
              <p className="text-xs text-gray-400">
                Backup history will appear here once backups are created. Click "Create Backup Now" to create your first backup.
              </p>
            </div>
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
                          {backup.status === 'completed' && <CheckCircle className="w-3 h-3 mr-1" />}
                          {backup.status === 'failed' && <XCircle className="w-3 h-3 mr-1" />}
                          {backup.status === 'in-progress' && <Clock className="w-3 h-3 mr-1" />}
                          {backup.status}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                        {backup.status === 'completed' ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownloadBackup(backup.id)}
                            className="flex items-center gap-1"
                          >
                            <Download className="w-4 h-4" />
                            Download
                          </Button>
                        ) : (
                          <span className="text-gray-400 text-xs">Not available</span>
                        )}
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

