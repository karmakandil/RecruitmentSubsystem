"use client";

import Link from "next/link";
import { useAuth } from "@/lib/hooks/use-auth";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/shared/ui/Card";
import { useRequireAuth } from "@/lib/hooks/use-auth";
import { SystemRole } from "@/types";

export default function LeavesPage() {
  const { user } = useAuth();
  useRequireAuth(SystemRole.HR_ADMIN);

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Leaves Management</h1>
        <p className="text-gray-600 mt-1">Configure and manage leave policies, types, and entitlements</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Leave Types</CardTitle>
            <CardDescription>Manage leave types (Annual, Sick, etc.)</CardDescription>
          </CardHeader>
          <CardContent>
            <Link 
              href="/dashboard/leaves/types" 
              className="text-blue-600 hover:underline font-medium"
            >
              Manage Leave Types →
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Leave Categories</CardTitle>
            <CardDescription>Organize leave types into categories</CardDescription>
          </CardHeader>
          <CardContent>
            <Link 
              href="/dashboard/leaves/categories" 
              className="text-blue-600 hover:underline font-medium"
            >
              Manage Categories →
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Leave Policies</CardTitle>
            <CardDescription>Configure accrual rates, carry-over, and eligibility rules</CardDescription>
          </CardHeader>
          <CardContent>
            <Link 
              href="/dashboard/leaves/policies" 
              className="text-blue-600 hover:underline font-medium"
            >
              Manage Policies →
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Leave Entitlements</CardTitle>
            <CardDescription>Assign and manage employee leave entitlements</CardDescription>
          </CardHeader>
          <CardContent>
            <Link 
              href="/dashboard/leaves/entitlements" 
              className="text-blue-600 hover:underline font-medium"
            >
              Manage Entitlements →
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Leave Adjustments</CardTitle>
            <CardDescription>Manually adjust employee leave balances</CardDescription>
          </CardHeader>
          <CardContent>
            <Link 
              href="/dashboard/leaves/adjustments" 
              className="text-blue-600 hover:underline font-medium"
            >
              Manage Adjustments →
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Calendar & Blocked Days</CardTitle>
            <CardDescription>Configure holidays and blocked periods</CardDescription>
          </CardHeader>
          <CardContent>
            <Link 
              href="/dashboard/leaves/calendar" 
              className="text-blue-600 hover:underline font-medium"
            >
              Manage Calendar →
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reset Leave Balances</CardTitle>
            <CardDescription>Reset leave balances for the new year</CardDescription>
          </CardHeader>
          <CardContent>
            <Link 
              href="/dashboard/leaves/reset" 
              className="text-blue-600 hover:underline font-medium"
            >
              Reset Balances →
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

