"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/hooks/use-auth";
import { useRequireAuth } from "@/lib/hooks/use-auth";
import { SystemRole } from "@/types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/shared/ui/Card";
import {
  FileText,
  DollarSign,
  Briefcase,
  Gift,
  Users,
  Shield,
  FileCheck,
  AlertCircle,
  BarChart3,
  TrendingUp,
  Calculator,
  Calendar,
  Eye,
  Send,
  Flag,
  Lock,
  Settings,
  Database,
  CheckCircle,
  Edit,
  RefreshCw,
  Receipt,
  Zap,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function PayrollSpecialistDashboardPage() {
  const { user } = useAuth();
  useRequireAuth(SystemRole.PAYROLL_SPECIALIST);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -right-40 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-16 space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-sm border border-blue-300/30 shadow-lg">
            <Zap className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Payroll Configuration</span>
          </div>

          {/* Main Title with Gradient */}
          <div className="space-y-4">
            <h1 className="text-6xl md:text-7xl font-extrabold mb-2">
              <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
                Payroll Specialist
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Dashboard
              </span>
            </h1>
          </div>

          {/* Welcome Message */}
          <div className="space-y-3 pt-4">
            <p className="text-2xl font-semibold text-gray-800">
              {mounted ? `Welcome back, ${user?.fullName || "Specialist"}!` : 'Welcome back!'}
            </p>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Create and manage payroll configurations (all in draft status requiring manager approval). Process payroll, review disputes and claims, and generate reports.
            </p>
          </div>

          {/* Gradient Line Separator */}
          <div className="flex items-center justify-center gap-4 pt-6">
            <div className="h-1 w-32 bg-gradient-to-r from-transparent via-blue-400 to-purple-400 rounded-full"></div>
            <Sparkles className="w-5 h-5 text-purple-500" />
            <div className="h-1 w-32 bg-gradient-to-l from-transparent via-pink-400 to-purple-400 rounded-full"></div>
          </div>
        </div>

        {/* ========== PAYROLL CONFIGURATION SECTION ========== */}
        <div className="mb-16">
          {/* Section Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                Configuration Management
              </h2>
            </div>
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="h-1 w-24 bg-gradient-to-r from-transparent via-blue-400 to-purple-400 rounded-full"></div>
              <Sparkles className="w-5 h-5 text-purple-500" />
              <div className="h-1 w-24 bg-gradient-to-l from-transparent via-pink-400 to-purple-400 rounded-full"></div>
            </div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Configure company-level payroll policies, pay grades, allowances, tax rules, and benefits. All configurations are created in draft status and require Payroll Manager approval before publishing. Editing is only allowed for draft status configurations.
            </p>
          </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* REQ-PY-1: Payroll Policies */}
          <div className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 rounded-3xl blur-lg opacity-30 group-hover:opacity-50 transition duration-500"></div>
            <Card className="relative h-full bg-white/90 backdrop-blur-xl border-2 border-blue-100 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full -mr-16 -mt-16"></div>
              <CardHeader className="text-center pb-4 pt-8 relative z-10">
                <div className="flex justify-center mb-6">
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-xl shadow-blue-500/30 transform group-hover:scale-110 transition-transform duration-300">
                    <FileText className="w-10 h-10 text-white" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900 mb-3">Payroll Policies</CardTitle>
                <CardDescription className="text-gray-600 text-sm leading-relaxed">
                  Configure company-level payroll policies (Create, Edit, View) - Status: Draft (requires manager approval)
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0 pb-6 relative z-10">
                <Link
                  href="/dashboard/payroll-configuration/policies"
                  className="block w-full text-center bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white py-3.5 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/50 flex items-center justify-center gap-2"
                >
                  Manage Policies
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* REQ-PY-2: Pay Grades */}
          <div className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 rounded-3xl blur-lg opacity-30 group-hover:opacity-50 transition duration-500"></div>
            <Card className="relative h-full bg-white/90 backdrop-blur-xl border-2 border-purple-100 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full -mr-16 -mt-16"></div>
              <CardHeader className="text-center pb-4 pt-8 relative z-10">
                <div className="flex justify-center mb-6">
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-xl shadow-purple-500/30 transform group-hover:scale-110 transition-transform duration-300">
                    <DollarSign className="w-10 h-10 text-white" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900 mb-3">Pay Grades</CardTitle>
                <CardDescription className="text-gray-600 text-sm leading-relaxed">
                  Define pay grades (Position, Gross Salary = Base Pay + Allowances) - Create, Edit, View - Status: Draft
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0 pb-6 relative z-10">
                <Link
                  href="/dashboard/payroll-configuration/pay-grades"
                  className="block w-full text-center bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3.5 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/50 flex items-center justify-center gap-2"
                >
                  Manage Pay Grades
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* REQ-PY-5: Pay Types */}
          <div className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-500 rounded-3xl blur-lg opacity-30 group-hover:opacity-50 transition duration-500"></div>
            <Card className="relative h-full bg-white/90 backdrop-blur-xl border-2 border-indigo-100 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-400/20 to-blue-400/20 rounded-full -mr-16 -mt-16"></div>
              <CardHeader className="text-center pb-4 pt-8 relative z-10">
                <div className="flex justify-center mb-6">
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-500 shadow-xl shadow-indigo-500/30 transform group-hover:scale-110 transition-transform duration-300">
                    <Briefcase className="w-10 h-10 text-white" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900 mb-3">Pay Types</CardTitle>
                <CardDescription className="text-gray-600 text-sm leading-relaxed">
                  Define employee pay types (hourly, daily, weekly, monthly, contract-based) - Create, Edit, View - Status: Draft
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0 pb-6 relative z-10">
                <Link
                  href="/dashboard/payroll-configuration/pay-types"
                  className="block w-full text-center bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white py-3.5 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-indigo-500/50 flex items-center justify-center gap-2"
                >
                  Manage Pay Types
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* REQ-PY-7: Allowances */}
          <div className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 rounded-3xl blur-lg opacity-30 group-hover:opacity-50 transition duration-500"></div>
            <Card className="relative h-full bg-white/90 backdrop-blur-xl border-2 border-emerald-100 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-400/20 to-green-400/20 rounded-full -mr-16 -mt-16"></div>
              <CardHeader className="text-center pb-4 pt-8 relative z-10">
                <div className="flex justify-center mb-6">
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-500 shadow-xl shadow-emerald-500/30 transform group-hover:scale-110 transition-transform duration-300">
                    <Gift className="w-10 h-10 text-white" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900 mb-3">Allowances</CardTitle>
                <CardDescription className="text-gray-600 text-sm leading-relaxed">
                  Set allowances (transportation, housing, etc.) - Create, Edit, View - Status: Draft
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0 pb-6 relative z-10">
                <Link
                  href="/dashboard/payroll-configuration/allowances"
                  className="block w-full text-center bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white py-3.5 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-emerald-500/50 flex items-center justify-center gap-2"
                >
                  Manage Allowances
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* REQ-PY-10: Tax Rules */}
          <div className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-red-500 via-rose-500 to-pink-500 rounded-3xl blur-lg opacity-30 group-hover:opacity-50 transition duration-500"></div>
            <Card className="relative h-full bg-white/90 backdrop-blur-xl border-2 border-red-100 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-400/20 to-rose-400/20 rounded-full -mr-16 -mt-16"></div>
              <CardHeader className="text-center pb-4 pt-8 relative z-10">
                <div className="flex justify-center mb-6">
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-red-500 to-rose-500 shadow-xl shadow-red-500/30 transform group-hover:scale-110 transition-transform duration-300">
                    <Shield className="w-10 h-10 text-white" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900 mb-3">Tax Rules</CardTitle>
                <CardDescription className="text-gray-600 text-sm leading-relaxed">
                  Define tax rules and laws (progressive rates, exemptions, thresholds) - Create, View - Status: Draft (Legal & Policy Admin can edit when laws change)
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0 pb-6 relative z-10">
                <Link
                  href="/dashboard/payroll-configuration/tax-rules"
                  className="block w-full text-center bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white py-3.5 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-red-500/50 flex items-center justify-center gap-2"
                >
                  Manage Tax Rules
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* REQ-PY-19: Signing Bonuses */}
          <div className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 rounded-3xl blur-lg opacity-30 group-hover:opacity-50 transition duration-500"></div>
            <Card className="relative h-full bg-white/90 backdrop-blur-xl border-2 border-amber-100 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-400/20 to-yellow-400/20 rounded-full -mr-16 -mt-16"></div>
              <CardHeader className="text-center pb-4 pt-8 relative z-10">
                <div className="flex justify-center mb-6">
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-500 shadow-xl shadow-amber-500/30 transform group-hover:scale-110 transition-transform duration-300">
                    <Users className="w-10 h-10 text-white" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900 mb-3">Signing Bonuses</CardTitle>
                <CardDescription className="text-gray-600 text-sm leading-relaxed">
                  Configure policies for signing bonuses - Create, Edit, View - Status: Draft
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0 pb-6 relative z-10">
                <Link
                  href="/dashboard/payroll-configuration/signing-bonuses"
                  className="block w-full text-center bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white py-3.5 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-amber-500/50 flex items-center justify-center gap-2"
                >
                  Manage Signing Bonuses
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* REQ-PY-20: Termination Benefits */}
          <div className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 via-red-500 to-rose-500 rounded-3xl blur-lg opacity-30 group-hover:opacity-50 transition duration-500"></div>
            <Card className="relative h-full bg-white/90 backdrop-blur-xl border-2 border-orange-100 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-400/20 to-red-400/20 rounded-full -mr-16 -mt-16"></div>
              <CardHeader className="text-center pb-4 pt-8 relative z-10">
                <div className="flex justify-center mb-6">
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 shadow-xl shadow-orange-500/30 transform group-hover:scale-110 transition-transform duration-300">
                    <Shield className="w-10 h-10 text-white" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900 mb-3">Termination Benefits</CardTitle>
                <CardDescription className="text-gray-600 text-sm leading-relaxed">
                  Configure resignation and termination benefits and their terms - Create, Edit, View - Status: Draft
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0 pb-6 relative z-10">
                <Link
                  href="/dashboard/payroll-configuration/termination-benefits"
                  className="block w-full text-center bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white py-3.5 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-orange-500/50 flex items-center justify-center gap-2"
                >
                  Manage Termination Benefits
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* REQ-PY-21: Insurance Brackets */}
          <div className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 rounded-3xl blur-lg opacity-30 group-hover:opacity-50 transition duration-500"></div>
            <Card className="relative h-full bg-white/90 backdrop-blur-xl border-2 border-teal-100 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-teal-400/20 to-cyan-400/20 rounded-full -mr-16 -mt-16"></div>
              <CardHeader className="text-center pb-4 pt-8 relative z-10">
                <div className="flex justify-center mb-6">
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-500 shadow-xl shadow-teal-500/30 transform group-hover:scale-110 transition-transform duration-300">
                    <Shield className="w-10 h-10 text-white" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900 mb-3">Insurance Brackets</CardTitle>
                <CardDescription className="text-gray-600 text-sm leading-relaxed">
                  Configure insurance brackets with defined salary ranges and contribution percentages (employer & employee) - Create, Edit, View - Status: Draft (requires HR Manager approval)
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0 pb-6 relative z-10">
                <Link
                  href="/dashboard/payroll-configuration/insurance-brackets"
                  className="block w-full text-center bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white py-3.5 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-teal-500/50 flex items-center justify-center gap-2"
                >
                  Manage Insurance Brackets
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* ========== PAYROLL PROCESSING & EXECUTION SECTION ========== */}
      <div className="mb-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg">
              <Calculator className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-purple-800 to-pink-800 bg-clip-text text-transparent">
              Payroll Processing & Execution
            </h2>
          </div>
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-1 w-24 bg-gradient-to-r from-transparent via-purple-400 to-pink-400 rounded-full"></div>
            <Sparkles className="w-5 h-5 text-purple-500" />
            <div className="h-1 w-24 bg-gradient-to-l from-transparent via-pink-400 to-purple-400 rounded-full"></div>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Process payroll, calculate salaries, generate drafts, review, and send for approval with powerful automation tools
          </p>
        </div>

        {/* Pre-Initiation Phase */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
            Pre-Initiation
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-white/80 backdrop-blur-sm border-2 border-blue-100 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Pre-Initiation Dashboard</CardTitle>
                <CardDescription className="text-gray-600">Review signing bonuses, termination benefits, and payroll period</CardDescription>
              </CardHeader>
              <CardContent>
                <Link
                  href="/dashboard/payroll-execution/pre-initiation"
                  className="block w-full text-center bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Open Dashboard →
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-2 border-amber-100 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Process Signing Bonuses</CardTitle>
                <CardDescription className="text-gray-600"> Automatically process signing bonuses</CardDescription>
              </CardHeader>
              <CardContent>
                <Link
                  href="/dashboard/payroll-execution/process-signing-bonuses"
                  className="block w-full text-center bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Process Bonuses →
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-2 border-orange-100 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Process Termination Benefits</CardTitle>
                <CardDescription className="text-gray-600"> Automatically process benefits upon resignation/termination</CardDescription>
              </CardHeader>
              <CardContent>
                <Link
                  href="/dashboard/payroll-execution/process-termination-benefits"
                  className="block w-full text-center bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Process Benefits →
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-2 border-purple-100 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Review Signing Bonuses</CardTitle>
                <CardDescription className="text-gray-600">Review and approve processed signing bonuses</CardDescription>
              </CardHeader>
              <CardContent>
                <Link
                  href="/dashboard/payroll-execution/pre-initiation/signing-bonuses"
                  className="block w-full text-center bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Review Bonuses →
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-2 border-red-100 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Review Termination Benefits</CardTitle>
                <CardDescription className="text-gray-600"> Review and approve processed benefits upon resignation</CardDescription>
              </CardHeader>
              <CardContent>
                <Link
                  href="/dashboard/payroll-execution/pre-initiation/termination-benefits"
                  className="block w-full text-center bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Review Benefits →
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-2 border-yellow-100 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Edit Signing Bonuses</CardTitle>
                <CardDescription className="text-gray-600"> Manually edit signing bonuses when needed</CardDescription>
              </CardHeader>
              <CardContent>
                <Link
                  href="/dashboard/payroll-execution/pre-initiation/signing-bonuses"
                  className="block w-full text-center bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Edit Bonuses →
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-2 border-pink-100 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Edit Termination Benefits</CardTitle>
                <CardDescription className="text-gray-600"> Manually edit benefits upon resignation when needed</CardDescription>
              </CardHeader>
              <CardContent>
                <Link
                  href="/dashboard/payroll-execution/pre-initiation/termination-benefits"
                  className="block w-full text-center bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Edit Benefits →
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Initiation Phase */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <div className="w-1 h-6 bg-gradient-to-b from-green-500 to-emerald-500 rounded-full"></div>
            Payroll Initiation
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-white/80 backdrop-blur-sm border-2 border-green-100 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Process Initiation</CardTitle>
                <CardDescription className="text-gray-600"> Automatically process payroll initiation</CardDescription>
              </CardHeader>
              <CardContent>
                <Link
                  href="/dashboard/payroll-execution/process-initiation"
                  className="block w-full text-center bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Process Initiation →
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-2 border-blue-100 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Review Initiation</CardTitle>
                <CardDescription className="text-gray-600"> Review and approve processed payroll initiation</CardDescription>
              </CardHeader>
              <CardContent>
                <Link
                  href="/dashboard/payroll-execution/review-initiation"
                  className="block w-full text-center bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Review Initiation →
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-2 border-yellow-100 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Edit Initiation</CardTitle>
                <CardDescription className="text-gray-600"> Manually edit payroll initiation when needed</CardDescription>
              </CardHeader>
              <CardContent>
                <Link
                  href="/dashboard/payroll-execution/review-initiation"
                  className="block w-full text-center bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Edit Initiation →
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Calculation & Draft Generation */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <div className="w-1 h-6 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full"></div>
            Calculation & Draft Generation
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-white/80 backdrop-blur-sm border-2 border-green-100 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Calculate Payroll</CardTitle>
                <CardDescription className="text-gray-600"> Automatically calculate salaries, allowances, deductions, and contributions</CardDescription>
              </CardHeader>
              <CardContent>
                <Link
                  href="/dashboard/payroll-execution/calculate-payroll"
                  className="block w-full text-center bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Calculate →
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-2 border-purple-100 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Prorated Salary</CardTitle>
                <CardDescription className="text-gray-600"> Calculate prorated salaries for mid-month hires/terminations</CardDescription>
              </CardHeader>
              <CardContent>
                <Link
                  href="/dashboard/payroll-execution/prorated-salary"
                  className="block w-full text-center bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Calculate Prorated →
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-2 border-indigo-100 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Apply Statutory Rules</CardTitle>
                <CardDescription className="text-gray-600"> Auto-apply tax, pension, insurance, and labor law deductions</CardDescription>
              </CardHeader>
              <CardContent>
                <Link
                  href="/dashboard/payroll-execution/apply-statutory-rules"
                  className="block w-full text-center bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Apply Rules →
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-2 border-orange-100 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Generate Draft</CardTitle>
                <CardDescription className="text-gray-600"> Automatically generate draft payroll runs at end of each cycle</CardDescription>
              </CardHeader>
              <CardContent>
                <Link
                  href="/dashboard/payroll-execution/generate-draft"
                  className="block w-full text-center bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Generate Draft →
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Review & Approval */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
            Review & Approval
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-white/80 backdrop-blur-sm border-2 border-purple-100 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Preview Dashboard</CardTitle>
                <CardDescription className="text-gray-600"> Review system-generated payroll results in preview dashboard</CardDescription>
              </CardHeader>
              <CardContent>
                <Link
                  href="/dashboard/payroll-execution/preview"
                  className="block w-full text-center bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  View Preview →
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-2 border-red-100 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Flag Irregularities</CardTitle>
                <CardDescription className="text-gray-600"> Flag irregularities (salary spikes, missing bank accounts, negative net pay)</CardDescription>
              </CardHeader>
              <CardContent>
                <Link
                  href="/dashboard/payroll-execution/flag-irregularities"
                  className="block w-full text-center bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Flag Irregularities →
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-2 border-cyan-100 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Send for Approval</CardTitle>
                <CardDescription className="text-gray-600"> Send payroll run for Manager and Finance approval before finalization</CardDescription>
              </CardHeader>
              <CardContent>
                <Link
                  href="/dashboard/payroll-execution/send-for-approval"
                  className="block w-full text-center bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Send for Approval →
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Payslip Generation */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <div className="w-1 h-6 bg-gradient-to-b from-indigo-500 to-blue-500 rounded-full"></div>
            Payslip Generation
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-white/80 backdrop-blur-sm border-2 border-indigo-100 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Generate Payslips</CardTitle>
                <CardDescription className="text-gray-600">Automatically generate and distribute payslips (PDF, email, portal)</CardDescription>
              </CardHeader>
              <CardContent>
                <Link
                  href="/dashboard/payroll-execution/payslips/generate"
                  className="block w-full text-center bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Generate Payslips →
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-2 border-teal-100 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">View Payslips</CardTitle>
                <CardDescription className="text-gray-600">View and manage all generated employee payslips</CardDescription>
              </CardHeader>
              <CardContent>
                <Link
                  href="/dashboard/payroll-execution/payslips"
                  className="block w-full text-center bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  View Payslips →
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* ========== PAYROLL TRACKING SECTION ========== */}
      <div className="mb-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 shadow-lg">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-indigo-800 to-purple-800 bg-clip-text text-transparent">
              Payroll Tracking
            </h2>
          </div>
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-1 w-24 bg-gradient-to-r from-transparent via-indigo-400 to-purple-400 rounded-full"></div>
            <Sparkles className="w-5 h-5 text-purple-500" />
            <div className="h-1 w-24 bg-gradient-to-l from-transparent via-purple-400 to-indigo-400 rounded-full"></div>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Approve/reject disputes and expense claims (approved items escalate to Payroll Manager for confirmation). Generate department reports and track status of claims, disputes, and refunds.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-red-500 to-rose-500 rounded-3xl blur-lg opacity-30 group-hover:opacity-50 transition duration-500"></div>
            <Card className="relative bg-white/90 backdrop-blur-xl border-2 border-red-100 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-400/20 to-rose-400/20 rounded-full -mr-16 -mt-16"></div>
              <CardHeader className="relative z-10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-red-500 to-rose-500 shadow-lg">
                    <AlertCircle className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900">Pending Disputes</CardTitle>
                </div>
                <CardDescription className="text-gray-600"> Approve/reject disputes (escalate to manager if approved)</CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
                <Link
                  href="/dashboard/payroll-tracking/pending-disputes"
                  className="block w-full text-center bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  Review Disputes
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </CardContent>
            </Card>
          </div>

          <div className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-amber-500 rounded-3xl blur-lg opacity-30 group-hover:opacity-50 transition duration-500"></div>
            <Card className="relative bg-white/90 backdrop-blur-xl border-2 border-orange-100 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-400/20 to-amber-400/20 rounded-full -mr-16 -mt-16"></div>
              <CardHeader className="relative z-10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 shadow-lg">
                    <FileCheck className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900">Pending Claims</CardTitle>
                </div>
                <CardDescription className="text-gray-600"> Approve/reject expense claims (escalate to manager if approved)</CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
                <Link
                  href="/dashboard/payroll-tracking/pending-claims"
                  className="block w-full text-center bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  Review Claims
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </CardContent>
            </Card>
          </div>

          <div className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-3xl blur-lg opacity-30 group-hover:opacity-50 transition duration-500"></div>
            <Card className="relative bg-white/90 backdrop-blur-xl border-2 border-blue-100 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full -mr-16 -mt-16"></div>
              <CardHeader className="relative z-10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 shadow-lg">
                    <BarChart3 className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900">Department Reports</CardTitle>
                </div>
                <CardDescription className="text-gray-600"> Generate payroll reports by department</CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
                <Link
                  href="/dashboard/payroll-tracking/department-reports"
                  className="block w-full text-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  View Reports
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </CardContent>
            </Card>
          </div>

          <div className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl blur-lg opacity-30 group-hover:opacity-50 transition duration-500"></div>
            <Card className="relative bg-white/90 backdrop-blur-xl border-2 border-green-100 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-full -mr-16 -mt-16"></div>
              <CardHeader className="relative z-10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 shadow-lg">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900">Track Status</CardTitle>
                </div>
                <CardDescription className="text-gray-600">Track claims, disputes, and refunds status</CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
                <Link
                  href="/dashboard/payroll-tracking/tracking"
                  className="block w-full text-center bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  Track Status
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      </div>

      {/* Add custom animations */}
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
