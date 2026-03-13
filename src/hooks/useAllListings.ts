import { useState, useEffect } from 'react';
import type { AxiosError } from 'axios';
import { useToastStore } from '@/stores/toastStore';
import type { BagListing } from '@/types/listing.types';
import { listingService } from '@/services/listing.service';
import { usePagination } from './usePagination';

interface ErrorResponse {
  success: boolean;
  message: string;
  timestamp: string;
  path: string;
}

export const useAllListings = () => {
  const { error } = useToastStore();
  const [allListings, setAllListings] = useState<BagListing[]>([]);
  const [isLoadingAll, setIsLoadingAll] = useState(false);

  // Paginación
  const pagination = usePagination({ initialLimit: 12 });

  /**
   * Fetch all published listings with pagination
   */
  const fetchAllListings = async (page?: number) => {
    setIsLoadingAll(true);
    try {
      const response = await listingService.getAllListings({
        page: page || pagination.page,
        limit: pagination.limit,
      });

      setAllListings(response.data);
      pagination.updatePagination(response.pagination);
    } catch (err) {
      const axiosError = err as AxiosError<ErrorResponse>;
      error(axiosError.response?.data?.message || 'Failed to load listings');
    } finally {
      setIsLoadingAll(false);
    }
  };

  /**
   * Load more (for infinite scroll)
   */
  const loadMore = async () => {
    if (!pagination.hasMore || isLoadingAll) return;

    setIsLoadingAll(true);
    try {
      const response = await listingService.getAllListings({
        page: pagination.page + 1,
        limit: pagination.limit,
      });

      // Append new listings
      setAllListings((prev) => [...prev, ...response.data]);
      pagination.updatePagination(response.pagination);
    } catch (err) {
      const axiosError = err as AxiosError<ErrorResponse>;
      error(axiosError.response?.data?.message || 'Failed to load more listings');
    } finally {
      setIsLoadingAll(false);
    }
  };

  /**
   * Refresh listings (reset to page 1)
   */
  const refreshListings = async () => {
    pagination.reset();
    await fetchAllListings(1);
  };

  /**
   * Auto-fetch on mount
   */
  useEffect(() => {
    fetchAllListings();
  }, []);

  /**
   * Auto-fetch when page changes (for pagination component)
   */
  useEffect(() => {
    if (pagination.page > 1) {
      fetchAllListings();
    }
  }, [pagination.page]);

  return {
    // State
    allListings,
    isLoadingAll,
    pagination,

    // Actions
    fetchAllListings,
    loadMore,
    refreshListings,
  };
};