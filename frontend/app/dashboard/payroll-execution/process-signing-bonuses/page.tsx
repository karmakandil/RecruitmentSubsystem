"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/use-auth";
import { useRequireAuth } from "@/lib/hooks/use-auth";
import { SystemRole } from "@/types";
import { payrollExecutionApi } from "@/lib/api/payroll-execution/payroll-execution";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/shared/ui/Card";
import { Button } from "@/components/shared/ui/Button";
import {
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Gift,
  Users,
  DollarSign,
  ArrowRight,
} from "lucide-react";

export default function ProcessSigningBonusesPage() {
  const router = useRouter();
  const { user } = useAuth();
  useRequireAuth(SystemRole.PAYROLL_SPECIALIST);

  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [result, setResult] = useState<any[] | null>(null);

  const handleProcess = async () => {
    setProcessing(true);
    setError(null);
    setSuccess(null);
    setResult(null);

    try {
      const bonuses = await payrollExecutionApi.processSigningBonuses();
      
      setResult(Array.isArray(bonuses) ? bonuses : []);
      setSuccess(
        `Successfully processed ${Array.isArray(bonuses) ? bonuses.length : 0} signing bonus(es)!`
      );
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to process signing bonuses";
      setError(errorMessage);
      console.error("Error processing signing bonuses:", err);
    } finally {
      setProcessing(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount || 0);
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Process Signing Bonuses
        </h1>
        <p className="text-gray-600 mt-1">
          Automatically process signing bonuses for eligible employees (new hires within the last 30 days with matching position configurations)
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <p className="text-green-700">{success}</p>
        </div>
      )}

      <Card className="max-w-3xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-6 w-6 text-purple-600" />
            Automatic Signing Bonus Processing
          </CardTitle>
          <CardDescription>
            The system will automatically:
            <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
              <li>Find all employees hired within the last 30 days</li>
              <li>Match them with approved signing bonus configurations by position</li>
              <li>Check if they are eligible according to their employment contract</li>
              <li>Create employee signing bonus records with PENDING status</li>
            </ul>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> After processing, signing bonuses will be
              created in PENDING status. You will need to review and approve
              them before they can be included in payroll runs.
            </p>
          </div>

          <Button
            onClick={handleProcess}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-6 text-lg"
            disabled={processing}
          >
            {processing ? (
              <>
                <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                Processing Signing Bonuses...
              </>
            ) : (
              <>
                <Gift className="h-5 w-5 mr-2" />
                Process Signing Bonuses
              </>
            )}
          </Button>

          {result && result.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Users className="h-5 w-5 text-gray-600" />
                Processed Signing Bonuses ({result.length})
              </h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {result.map((bonus: any, index: number) => (
                  <Card key={bonus._id || index} className="border border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">
                            {bonus.employeeId && typeof bonus.employeeId === "object"
                              ? `${bonus.employeeId.firstName || ""} ${bonus.employeeId.lastName || ""}`.trim() || "Unknown Employee"
                              : `Employee ID: ${bonus.employeeId || "N/A"}`}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            {bonus.signingBonusId && typeof bonus.signingBonusId === "object"
                              ? `Bonus: ${bonus.signingBonusId.positionName || bonus.signingBonusId.name || "N/A"}`
                              : "Signing Bonus"}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="font-semibold text-gray-900 flex items-center gap-1">
                              <DollarSign className="h-4 w-4" />
                              {formatCurrency(bonus.givenAmount || 0)}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              Status: <span className="font-semibold text-yellow-600">{bonus.status || "PENDING"}</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {result && result.length === 0 && (
            <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-md text-center">
              <p className="text-gray-600">
                No signing bonuses were processed. This could mean:
              </p>
              <ul className="list-disc list-inside mt-2 text-sm text-gray-600 space-y-1">
                <li>No employees were hired within the last 30 days</li>
                <li>No matching signing bonus configurations exist for their positions</li>
                <li>Employees are not eligible according to their contracts</li>
              </ul>
            </div>
          )}

          {result && (
            <div className="pt-4 border-t">
              <Button
                onClick={() => router.push("/dashboard/payroll-execution/pre-initiation/signing-bonuses")}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                Review Signing Bonuses
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="mt-8">
        <Button
          onClick={() => router.push("/dashboard/payroll-execution/pre-initiation")}
          variant="outline"
        >
          ← Back to Pre-Initiation
        </Button>
      </div>
    </div>
  );
}

