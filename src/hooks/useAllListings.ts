import { useState, useEffect, useRef } from 'react';
import type { AxiosError } from 'axios';
import { useToastStore } from '@/stores/toastStore';
import type { BagListing } from '@/types/listing.types';
import { listingService } from '@/services/listing.service';
import { usePagination } from './usePagination';
import { useSearchStore } from '@/stores/searchStore';

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
  const pagination = usePagination({ initialLimit: 10 });

  const { appliedCities, appliedGearCategories } = useSearchStore();


  /**
   * Fetch all published listings with pagination
   */
  const fetchAllListings = async (
    page?: number,
    cities = appliedCities,
    gearCategories = appliedGearCategories,
  ) => {
    setIsLoadingAll(true);
    try {
      const response = await listingService.getAllListings({
        page: page || pagination.page,
        limit: pagination.limit,
        ...(cities.length > 0 && { city: cities[0] }),
        ...(gearCategories.length > 0 && gearCategories[0] !== null && {
          clubCategory: gearCategories[0],
        }),
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

  const updateFavorite = (id: string, isFavorited: boolean) => {
    setAllListings((prev) =>
      prev.map((listing) =>
        listing.id === id ? { ...listing, isFavorite: isFavorited } : listing
      )
    );
  };

  // ─── Search change ────────────────────────────────────────────────────────────
  const prevAppliedRef = useRef({ appliedCities, appliedGearCategories });
  useEffect(() => {
    const prev = prevAppliedRef.current;
    const searchChanged =
      prev.appliedCities !== appliedCities ||
      prev.appliedGearCategories !== appliedGearCategories;

    console.log('[useAllListings] search effect fired', {
      prev,
      current: { appliedCities, appliedGearCategories },
      searchChanged,
    });

    prevAppliedRef.current = { appliedCities, appliedGearCategories };

    if (searchChanged) {
      console.log('[useAllListings] search changed → fetching with', { appliedCities, appliedGearCategories });
      pagination.reset();
      fetchAllListings(1, appliedCities, appliedGearCategories);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appliedCities, appliedGearCategories]);

  /**
   * Auto-fetch when page changes (for pagination component)
   */
  useEffect(() => {
    fetchAllListings(pagination.page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    updateFavorite
  };
};