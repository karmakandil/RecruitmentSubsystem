"use client";

import React, { useState, useEffect } from 'react';
import { useRequireAuth } from '@/lib/hooks/use-auth';
import { SystemRole } from '@/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/shared/ui/Card';
import { Button } from '@/components/shared/ui/Button';
import { statsApi, ConfigurationStats } from '@/lib/api/payroll-configuration';
import Link from 'next/link';

export default function StatsPage() {
  // Allow Payroll Manager, System Admin, HR Manager, HR Admin, Employee (view-only), and Department Head (view-only)
  // Note: Backend currently only allows PAYROLL_MANAGER - backend needs to be updated to include other roles
  useRequireAuth(
    [
      SystemRole.PAYROLL_MANAGER,
      SystemRole.SYSTEM_ADMIN,
      SystemRole.HR_MANAGER,
      SystemRole.HR_ADMIN,
      SystemRole.DEPARTMENT_EMPLOYEE,
      SystemRole.DEPARTMENT_HEAD,
    ],
    '/dashboard'
  );

  const [stats, setStats] = useState<ConfigurationStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await statsApi.getStats();
      setStats(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load statistics');
      // Use empty stats when backend is not ready
      setStats({
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const StatCard = ({
    title,
    value,
    description,
    color = 'blue',
  }: {
    title: string;
    value: number | string;
    description?: string;
    color?: 'blue' | 'green' | 'yellow' | 'red';
  }) => {
    const colorClasses = {
      blue: 'bg-blue-50 border-blue-200 text-blue-900',
      green: 'bg-green-50 border-green-200 text-green-900',
      yellow: 'bg-yellow-50 border-yellow-200 text-yellow-900',
      red: 'bg-red-50 border-red-200 text-red-900',
    };

    return (
      <Card className={colorClasses[color]}>
        <CardContent className="pt-6">
          <div className="text-3xl font-bold">{value}</div>
          <div className="mt-2 text-sm font-medium">{title}</div>
          {description && (
            <div className="mt-1 text-xs opacity-75">{description}</div>
          )}
        </CardContent>
      </Card>
    );
  };

  const TypeStatsCard = ({
    title,
    stats: typeStats,
  }: {
    title: string;
    stats?: {
      total: number;
      pending: number;
      approved: number;
      rejected: number;
    };
  }) => {
    if (!typeStats) return null;

    // Ensure all values are numbers (handle undefined/null)
    const total = typeStats.total ?? 0;
    const pending = typeStats.pending ?? 0;
    const approved = typeStats.approved ?? 0;
    const rejected = typeStats.rejected ?? 0;

    // Calculate pending if it's missing but we have other values
    const calculatedPending = pending === 0 && total > 0 
      ? Math.max(0, total - approved - rejected)
      : pending;

    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {total}
              </div>
              <div className="text-xs text-gray-500">Total</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-600">
                {calculatedPending}
              </div>
              <div className="text-xs text-gray-500">Pending</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {approved}
              </div>
              <div className="text-xs text-gray-500">Approved</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">
                {rejected}
              </div>
              <div className="text-xs text-gray-500">Rejected</div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading statistics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Configuration Statistics
                </h1>
                <p className="text-gray-600 mt-1 text-sm">
                  Overview of all payroll configuration statuses
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={loadStats}
            className="px-4 py-2 border-2 border-indigo-200 rounded-lg text-sm font-semibold text-indigo-700 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 flex items-center hover:border-indigo-300"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border-2 border-red-300 bg-red-50 p-4 shadow-lg">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="text-red-800 font-semibold">{error}</p>
          </div>
        </div>
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-indigo-100 hover:shadow-xl transition-shadow duration-200 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-100 rounded-full -mr-16 -mt-16 opacity-50"></div>
          <div className="relative">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-500">Total</p>
            </div>
            <p className="text-4xl font-bold text-gray-900">{stats?.total || 0}</p>
            <p className="text-xs text-gray-500 mt-1">All configurations</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-amber-100 hover:shadow-xl transition-shadow duration-200 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-100 rounded-full -mr-16 -mt-16 opacity-50"></div>
          <div className="relative">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-500">Pending</p>
            </div>
            <p className="text-4xl font-bold text-gray-900">{stats?.pending || 0}</p>
            <p className="text-xs text-gray-500 mt-1">Awaiting review</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-green-100 hover:shadow-xl transition-shadow duration-200 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-100 rounded-full -mr-16 -mt-16 opacity-50"></div>
          <div className="relative">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-500">Approved</p>
            </div>
            <p className="text-4xl font-bold text-gray-900">{stats?.approved || 0}</p>
            <p className="text-xs text-gray-500 mt-1">Active configurations</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-red-100 hover:shadow-xl transition-shadow duration-200 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-100 rounded-full -mr-16 -mt-16 opacity-50"></div>
          <div className="relative">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-500">Rejected</p>
            </div>
            <p className="text-4xl font-bold text-gray-900">{stats?.rejected || 0}</p>
            <p className="text-xs text-gray-500 mt-1">Rejected configurations</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      {stats && stats.pending > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              {stats.pending} configuration(s) pending approval
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/payroll-configuration/approvals">
              <Button variant="primary">
                Review Pending Approvals →
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Detailed Statistics by Type */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {stats?.payGrades && (
          <TypeStatsCard
            title="Pay Grades"
            stats={stats.payGrades}
          />
        )}
        {stats?.allowances && (
          <TypeStatsCard
            title="Allowances"
            stats={stats.allowances}
          />
        )}
        {stats?.payTypes && (
          <TypeStatsCard
            title="Pay Types"
            stats={stats.payTypes}
          />
        )}
        {stats?.taxRules && (
          <TypeStatsCard
            title="Tax Rules"
            stats={stats.taxRules}
          />
        )}
        {stats?.insuranceBrackets && (
          <TypeStatsCard
            title="Insurance Brackets"
            stats={stats.insuranceBrackets}
          />
        )}
        {stats?.signingBonuses && (
          <TypeStatsCard
            title="Signing Bonuses"
            stats={stats.signingBonuses}
          />
        )}
        {stats?.terminationBenefits && (
          <TypeStatsCard
            title="Termination Benefits"
            stats={stats.terminationBenefits}
          />
        )}
        {stats?.payrollPolicies && (
          <TypeStatsCard
            title="Payroll Policies"
            stats={stats.payrollPolicies}
          />
        )}
      </div>
    </div>
  );
}

