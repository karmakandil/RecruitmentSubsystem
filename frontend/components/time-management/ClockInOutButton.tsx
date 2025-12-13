"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/lib/hooks/use-auth";
import { timeManagementApi } from "@/lib/api/time-management/time-management.api";

export function ClockInOutButton() {
    const { user } = useAuth();
    const [isClockedIn, setIsClockedIn] = useState(false);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [clockInTime, setClockInTime] = useState<Date | null>(null);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [isHydrated, setIsHydrated] = useState(false);
    const fetchStatusRef = useRef(false); // Prevent double fetching
    const clockInTimeRef = useRef<Date | null>(null); // Store original clock in time to prevent reference changes
    const isClockedInRef = useRef(false); // Keep latest clocked-in state for async calls

    const updateClockedInState = (value: boolean) => {
        setIsClockedIn(value);
        isClockedInRef.current = value;
    };

    // Fetch current attendance status - Only run once when component mounts
    useEffect(() => {
        if (!user?.id || fetchStatusRef.current) return;
        
        fetchStatusRef.current = true;

        // First, restore from localStorage if available
        const savedState = localStorage.getItem(`clockInState_${user.id}`);
        if (savedState) {
            try {
                const { isClockedIn: savedClockedIn, clockInTime: savedClockInTime } = JSON.parse(savedState);
                updateClockedInState(savedClockedIn);
                if (savedClockInTime) {
                    const clockIn = new Date(savedClockInTime);
                    setClockInTime(clockIn);
                    clockInTimeRef.current = clockIn;
                    const elapsed = Math.floor((Date.now() - clockIn.getTime()) / 1000);
                    setElapsedTime(elapsed > 0 ? elapsed : 0);
                }
                setIsHydrated(true);
                setLoading(false);
                // Still fetch from backend in background to sync
                fetchStatusFromBackend();
                return;
            } catch (e) {
                // Parsing failed, continue with fetch
            }
        }

        // If no saved state, fetch from backend
        fetchStatusFromBackend();

        async function fetchStatusFromBackend() {
            if (!user?.id) return;
            try {
                setLoading(true);
                const status = await timeManagementApi.getAttendanceStatus(user.id);
                const backendClockedIn = !!status.isClockedIn;
                let nextClockedIn = backendClockedIn;
                let nextClockInTime: Date | null = null;

                if (backendClockedIn && status.lastPunchTime) {
                    nextClockInTime = new Date(status.lastPunchTime);
                }

                // If backend says "out" but we have a local running session, keep it optimistic
                if (!backendClockedIn && isClockedInRef.current && clockInTimeRef.current) {
                    nextClockedIn = true;
                    nextClockInTime = clockInTimeRef.current;
                }

                updateClockedInState(nextClockedIn);

                if (nextClockInTime) {
                    setClockInTime(nextClockInTime);
                    clockInTimeRef.current = nextClockInTime;
                    const elapsed = Math.floor((Date.now() - nextClockInTime.getTime()) / 1000);
                    setElapsedTime(elapsed > 0 ? elapsed : 0);
                } else {
                    setClockInTime(null);
                    clockInTimeRef.current = null;
                    setElapsedTime(0);
                }

                // Save to localStorage only when backend confirms or we are not overriding optimistically
                if (backendClockedIn) {
                    localStorage.setItem(
                        `clockInState_${user.id}`,
                        JSON.stringify({
                            isClockedIn: true,
                            clockInTime: status.lastPunchTime,
                        })
                    );
                } else if (!nextClockedIn) {
                    // Persist a clean clock-out when both backend and state agree
                    localStorage.setItem(
                        `clockInState_${user.id}`,
                        JSON.stringify({
                            isClockedIn: false,
                            clockInTime: null,
                        })
                    );
                }
            } catch (err: any) {
                console.error("Failed to fetch attendance status:", err);
                setError(err.message || "Failed to load status");
            } finally {
                setLoading(false);
                setIsHydrated(true);
            }
        }

        // Listen for visibility changes and refetch when page becomes visible
        const handleVisibilityChange = () => {
            if (!document.hidden) {
                fetchStatusFromBackend();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [user?.id]);

    // Update elapsed time every second when clocked in
    useEffect(() => {
        if (!isClockedIn || !clockInTimeRef.current) return;

        const interval = setInterval(() => {
            const now = new Date();
            const elapsed = Math.floor((now.getTime() - clockInTimeRef.current!.getTime()) / 1000);
            setElapsedTime(elapsed);
        }, 1000);

        return () => clearInterval(interval);
    }, [isClockedIn]);

    const handleClockIn = async () => {
        if (!user?.id) return;

        try {
            setActionLoading(true);
            setError(null);
            await timeManagementApi.clockIn(user.id);
            const clockInDateTime = new Date();
            setIsClockedIn(true);
            setClockInTime(clockInDateTime);
            clockInTimeRef.current = clockInDateTime;
            setElapsedTime(0);
            // Save to localStorage immediately
            localStorage.setItem(
                `clockInState_${user.id}`,
                JSON.stringify({
                    isClockedIn: true,
                    clockInTime: clockInDateTime.toISOString(),
                })
            );
            // Dispatch custom event to notify other components
            window.dispatchEvent(new CustomEvent('attendanceUpdated', { detail: { clockedIn: true } }));
        } catch (err: any) {
            setError(err.message || "Failed to clock in");
        } finally {
            setActionLoading(false);
        }
    };

    const handleClockOut = async () => {
        if (!user?.id) return;

        try {
            setActionLoading(true);
            setError(null);
            await timeManagementApi.clockOut(user.id);
            setIsClockedIn(false);
            setClockInTime(null);
            clockInTimeRef.current = null;
            setElapsedTime(0);
            // Save to localStorage immediately
            localStorage.setItem(
                `clockInState_${user.id}`,
                JSON.stringify({
                    isClockedIn: false,
                    clockInTime: null,
                })
            );
            // Dispatch custom event to notify other components
            window.dispatchEvent(new CustomEvent('attendanceUpdated', { detail: { clockedIn: false } }));
        } catch (err: any) {
            setError(err.message || "Failed to clock out");
        } finally {
            setActionLoading(false);
        }
    };

    const formatElapsedTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow p-6">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-32 mb-4"></div>
                    <div className="h-12 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Clock In/Out</h3>

            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                    {error}
                </div>
            )}

            <div className="space-y-4">
                {isClockedIn && (
                    <div className="bg-green-50 border border-green-200 rounded p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-green-700 font-medium">Currently Clocked In</p>
                                <p className="text-xs text-green-600 mt-1">
                                    Since {clockInTime?.toLocaleTimeString()}
                                </p>
                            </div>
                            <div className="text-2xl font-mono font-bold text-green-700">
                                {formatElapsedTime(elapsedTime)}
                            </div>
                        </div>
                    </div>
                )}

                <button
                    onClick={isClockedIn ? handleClockOut : handleClockIn}
                    disabled={actionLoading}
                    className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors ${isClockedIn
                            ? "bg-red-600 hover:bg-red-700 disabled:bg-red-400"
                            : "bg-green-600 hover:bg-green-700 disabled:bg-green-400"
                        }`}
                >
                    {actionLoading ? (
                        <span className="flex items-center justify-center">
                            <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    fill="none"
                                />
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                />
                            </svg>
                            Processing...
                        </span>
                    ) : isClockedIn ? (
                        "Clock Out"
                    ) : (
                        "Clock In"
                    )}
                </button>
            </div>
        </div>
    );
}
