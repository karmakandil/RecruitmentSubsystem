"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/hooks/use-auth";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/shared/ui/Card";
import { Button } from "@/components/shared/ui/Button";
import { recruitmentApi } from "@/lib/api/recruitment/recruitment";
import { JobRequisition } from "@/types/recruitment";
import { StatusBadge } from "@/components/recruitment/StatusBadge";
import { Toast, useToast } from "@/components/leaves/Toast";
import { SystemRole } from "@/types";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { isHRStaff } from "@/lib/utils/role-utils";

export default function RecruitmentPage() {
  const { user } = useAuth();
  const { toast, showToast, hideToast } = useToast();
  const [jobRequisitions, setJobRequisitions] = useState<JobRequisition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadJobRequisitions();
  }, []);

  const loadJobRequisitions = async () => {
    try {
      setLoading(true);
      const jobs = await recruitmentApi.getJobRequisitions();
      // CHANGED - Filter using publishStatus === 'published' instead of job.published
      const publishedJobs = jobs.filter((job) => job.publishStatus === 'published');
      setJobRequisitions(publishedJobs);
    } catch (error: any) {
      showToast(error.message || "Failed to load job openings", "error");
    } finally {
      setLoading(false);
    }
  };

  const isCandidate = user?.userType === "candidate" || user?.roles?.includes(SystemRole.JOB_CANDIDATE);
  const isEmployee = user?.userType === "employee";
  const isDepartmentHead = user?.roles?.includes(SystemRole.DEPARTMENT_HEAD);
  const isHR = isHRStaff(user);
  const isHRManager = user?.roles?.includes(SystemRole.HR_MANAGER);
  const isHREmployee = user?.roles?.includes(SystemRole.HR_EMPLOYEE);
  const isRecruiter = user?.roles?.includes(SystemRole.RECRUITER);
  // CHANGED - Added System Admin role check
  const isSystemAdmin = user?.roles?.includes(SystemRole.SYSTEM_ADMIN);

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-6 py-8">
        <Toast
          message={toast.message}
          type={toast.type}
          isVisible={toast.isVisible}
          onClose={hideToast}
        />

        <div className="mb-8">
          <Link href="/dashboard" className="text-blue-600 hover:underline mb-4 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Recruitment</h1>
          <p className="text-gray-600 mt-1">Welcome, {user?.fullName}</p>
        </div>

        {/* Candidate View */}
        {isCandidate && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>My Applications</CardTitle>
                  <CardDescription>Track your application status</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/dashboard/recruitment/my-applications">
                    <Button className="w-full">View Applications</Button>
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Interviews</CardTitle>
                  <CardDescription>View scheduled interviews</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/dashboard/recruitment/interviews">
                    <Button className="w-full">View Interviews</Button>
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Job Offers</CardTitle>
                  <CardDescription>Respond to offers and upload documents</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/dashboard/recruitment/offers">
                    <Button className="w-full">View Offers</Button>
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Onboarding</CardTitle>
                  <CardDescription>Complete onboarding tasks</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/dashboard/recruitment/onboarding">
                    <Button className="w-full">View Onboarding</Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

            <div className="mt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Available Job Openings</h2>
              
              {loading ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">Loading job openings...</p>
                </div>
              ) : jobRequisitions.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <p className="text-gray-500">No job openings available at this time.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {jobRequisitions.map((job) => (
                    <Card key={job._id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-xl">
                              {job.template?.title || "Job Opening"}
                            </CardTitle>
                            <CardDescription className="mt-1">
                              {job.template?.department || "Department"} • {job.location || "Location TBD"}
                            </CardDescription>
                          </div>
                          <StatusBadge status={job.status} type="application" />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                          {job.template?.description || "No description available"}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">
                            {job.openings} {job.openings === 1 ? "opening" : "openings"}
                          </span>
                          <Link href={`/dashboard/recruitment/jobs/${job._id}`}>
                            <Button size="sm">View Details</Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* Employee View */}
        {isEmployee && !isCandidate && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>My Referrals</CardTitle>
                <CardDescription>Track candidates you've referred</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/dashboard/recruitment/referrals">
                  <Button className="w-full">View Referrals</Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resignation</CardTitle>
                <CardDescription>Submit and track resignation requests</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/dashboard/recruitment/resignation">
                  <Button className="w-full">Manage Resignation</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Department Head View */}
        {isDepartmentHead && !isHR && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Department Interviews</CardTitle>
                <CardDescription>View and manage department interviews</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/dashboard/recruitment/department-interviews">
                  <Button className="w-full">View Interviews</Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Clearance Checklists</CardTitle>
                <CardDescription>Update clearance items for your department</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/dashboard/recruitment/clearance">
                  <Button className="w-full">Manage Clearance</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        )}

        {/* HR Manager/Employee/Recruiter View */}
        {isHR && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {(isHRManager || isSystemAdmin) && (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle>Job Templates</CardTitle>
                      <CardDescription>Create and manage job description templates</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Link href="/dashboard/recruitment/job-templates">
                        <Button className="w-full">Manage Templates</Button>
                      </Link>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Job Requisitions</CardTitle>
                      <CardDescription>Create and manage job postings</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Link href="/dashboard/recruitment/job-requisitions">
                        <Button className="w-full">Manage Jobs</Button>
                      </Link>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Recruitment Progress</CardTitle>
                      <CardDescription>Monitor progress across all open positions</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Link href="/dashboard/recruitment/recruitment-progress">
                        <Button className="w-full">View Progress</Button>
                      </Link>
                    </CardContent>
                  </Card>
                </>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>Applications</CardTitle>
                  <CardDescription>Review and manage candidate applications</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/dashboard/recruitment/applications">
                    <Button className="w-full">View Applications</Button>
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Interviews</CardTitle>
                  <CardDescription>Schedule and manage interviews</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/dashboard/recruitment/hr-interviews">
                    <Button className="w-full">Manage Interviews</Button>
                  </Link>
                </CardContent>
              </Card>

              {(isHRManager || isSystemAdmin) && (
                <Card>
                  <CardHeader>
                    <CardTitle>Offers</CardTitle>
                    <CardDescription>Create and manage job offers</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link href="/dashboard/recruitment/hr-offers">
                      <Button className="w-full">Manage Offers</Button>
                    </Link>
                  </CardContent>
                </Card>
              )}

              {(isHRManager || isHREmployee) && (
                <Card>
                  <CardHeader>
                    <CardTitle>Onboarding</CardTitle>
                    <CardDescription>Manage new hire onboarding</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link href="/dashboard/recruitment/hr-onboarding">
                      <Button className="w-full">Manage Onboarding</Button>
                    </Link>
                  </CardContent>
                </Card>
              )}

              {(isHREmployee || isHRManager) && (
                <Card>
                  <CardHeader>
                    <CardTitle>Referrals</CardTitle>
                    <CardDescription>Tag and track candidate referrals</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link href="/dashboard/recruitment/referrals">
                      <Button className="w-full">Manage Referrals</Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </div>
          </>
        )}

        {/* CHANGED - System Admin View (ONB-009, ONB-013, OFF-007) */}
        {isSystemAdmin && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">System Administration</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Access Management</CardTitle>
                  <CardDescription>
                    Provision or revoke system access for employees (ONB-009, OFF-007)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/dashboard/recruitment/access-management">
                    <Button className="w-full">Manage Access</Button>
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Onboarding</CardTitle>
                  <CardDescription>
                    View and manage new hire onboarding tasks
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/dashboard/recruitment/hr-onboarding">
                    <Button className="w-full">View Onboarding</Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}

