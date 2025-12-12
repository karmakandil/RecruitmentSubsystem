"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/hooks/use-auth';
import { useRequireAuth } from '@/lib/hooks/use-auth';
import { SystemRole } from '@/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/shared/ui/Card';
import { Button } from '@/components/shared/ui/Button';
import { statsApi, ConfigurationStats } from '@/lib/api/payroll-configuration';
import Link from 'next/link';

export default function StatsPage() {
  const { user } = useAuth();
  // Allow Payroll Manager, System Admin, HR Manager, HR Admin, Employee (view-only), and Department Head (view-only)
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
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Configuration Statistics
            </h1>
            <p className="text-gray-600 mt-1">
              Overview of all payroll configuration statuses
            </p>
          </div>
          <Button variant="outline" onClick={loadStats}>
            Refresh
          </Button>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-300 bg-red-50 p-4 text-red-800">
          {error}
        </div>
      )}

      {/* Overview Cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Configurations"
          value={stats?.total || 0}
          description="All configurations"
          color="blue"
        />
        <StatCard
          title="Pending Approvals"
          value={stats?.pending || 0}
          description="Awaiting review"
          color="yellow"
        />
        <StatCard
          title="Approved"
          value={stats?.approved || 0}
          description="Active configurations"
          color="green"
        />
        <StatCard
          title="Rejected"
          value={stats?.rejected || 0}
          description="Rejected configurations"
          color="red"
        />
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
      <div className="mb-8">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">
          Statistics by Configuration Type
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {stats?.payGrades && (
            <TypeStatsCard title="Pay Grades" stats={stats.payGrades} />
          )}
          {stats?.allowances && (
            <TypeStatsCard title="Allowances" stats={stats.allowances} />
          )}
          {stats?.payTypes && (
            <TypeStatsCard title="Pay Types" stats={stats.payTypes} />
          )}
          {stats?.taxRules && (
            <TypeStatsCard title="Tax Rules" stats={stats.taxRules} />
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

      {/* Empty State */}
      {stats && stats.total === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">
              No configuration data available yet.
            </p>
            <p className="mt-2 text-sm text-gray-400">
              Statistics will appear here once configurations are created.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

