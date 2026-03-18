"use client";

import { useState, useCallback } from "react";
import { useActiveClient } from "@/store/clientStore";
import uploadService from "@/services/upload.service";
import type { Pagination } from "@/types/api";
import type { Upload } from "@/types/upload";

export function useUpload() {
  const activeClient = useActiveClient();
  const [uploads, setUploads] = useState<Upload[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = useCallback(
    async (file: File, onProgress?: (pct: number) => void): Promise<Upload | null> => {
      if (!activeClient?.id) {
        setError("No active client selected.");
        return null;
      }
      setIsUploading(true);
      setError(null);
      try {
        const res = await uploadService.uploadFile(file, activeClient.id, onProgress);
        return res.data;
      } catch {
        setError("Upload failed.");
        return null;
      } finally {
        setIsUploading(false);
      }
    },
    [activeClient?.id]
  );

  const fetchUploads = useCallback(
    async (name?: string, page = 1, limit = 15): Promise<void> => {
      if (!activeClient?.id) {
        setError("No active client selected.");
        return;
      }
      setIsFetching(true);
      setError(null);
      try {
        const res = await uploadService.getUploads({ client_id: activeClient.id, name, page, limit });
        if (page === 1) {
          setUploads(res.data);
        } else {
          setUploads((prev) => [...prev, ...res.data]);
        }
        setPagination(res.pagination);
      } catch {
        setError("Failed to fetch uploads.");
      } finally {
        setIsFetching(false);
      }
    },
    [activeClient?.id]
  );

  const loadMore = useCallback(
    (name?: string) => {
      if (!pagination?.has_next || isFetching) return;
      fetchUploads(name, pagination.page + 1);
    },
    [pagination, isFetching, fetchUploads]
  );

  return { uploads, pagination, isUploading, isFetching, error, uploadFile, fetchUploads, loadMore };
}
