"use client";

import { useState, useEffect, useCallback } from "react";
import { TranscribeService, type Job } from "@/lib/api-services";

interface UseJobsOptions {
  clientId?: number;
  pollingInterval?: number;
}

interface UseJobsReturn {
  jobs: Job[];
  isLoading: boolean;
  error: string | null;
  fetchJobs: (showLoading?: boolean) => Promise<void>;
  refetch: () => void;
}

export function useJobs({ clientId, pollingInterval = 10000 }: UseJobsOptions): UseJobsReturn {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = useCallback(async (showLoading = true) => {
    if (!clientId) return;

    try {
      if (showLoading) {
        setIsLoading(true);
      }
      setError(null);

      const response = await TranscribeService.getJobs({
        client_id: clientId,
        limit: 10,
        offset: 0,
      });

      if (response.success !== false) {
        if (showLoading) {
          // Full replacement when explicitly fetching (client change or manual refetch)
          const sortedJobs = response.jobs.sort(
            (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
          setJobs(sortedJobs);
        } else {
          // Incremental update for polling (merge new/updated jobs with existing ones)
          setJobs(prevJobs => {
            const existingJobsMap = new Map(prevJobs.map(job => [job.job_id, job]));

            // Update existing jobs or add new ones
            response.jobs.forEach(newJob => {
              existingJobsMap.set(newJob.job_id, newJob);
            });

            // Convert back to array and sort by created_at (newest first)
            return Array.from(existingJobsMap.values()).sort(
              (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            );
          });
        }
      } else {
        if (showLoading) {
          setError(response.message || "Failed to load jobs");
        }
      }
    } catch (error: unknown) {
      if (showLoading) {
        let errorMessage = "Something went wrong";
        if (process.env.NODE_ENV === 'development') {
          console.log("Error details:", error);
        }
        if (error && typeof error === 'object') {
          if ('message' in error && typeof error.message === 'string') {
            errorMessage = error.message;
          } else if ('data' in error && error.data && typeof error.data === 'object' && 'message' in error.data) {
            errorMessage = (error.data as { message: string }).message;
          }
        } else if (error instanceof Error) {
          errorMessage = error.message;
        }
        setError(errorMessage);
      }
    } finally {
      if (showLoading) {
        setIsLoading(false);
      }
    }
  }, [clientId]);

  // Initial fetch when client changes
  useEffect(() => {
    if (clientId) {
      // Clear existing jobs when switching clients
      setJobs([]);
      setError(null);
      fetchJobs(true);
    } else {
      // Clear jobs when no client is selected
      setJobs([]);
      setError(null);
    }
  }, [clientId, fetchJobs]);

  // Auto-refresh jobs to update status (silent incremental update)
  useEffect(() => {
    if (!clientId) return;

    const intervalId = setInterval(() => {
      const hasActiveJobs = jobs.some(
        job => job.status === 'processing' || job.status === 'pending'
      );

      if (hasActiveJobs) {
        fetchJobs(false);
      }
    }, pollingInterval);

    return () => clearInterval(intervalId);
  }, [clientId, jobs, pollingInterval, fetchJobs]);

  const refetch = useCallback(() => {
    fetchJobs(true);
  }, [fetchJobs]);

  return {
    jobs,
    isLoading,
    error,
    fetchJobs,
    refetch,
  };
}
