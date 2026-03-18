import { useState } from 'react';
import type { AxiosError } from 'axios';
import { useToastStore } from '@/stores/toastStore';
import { favoriteService } from '@/services/favorite.service';
import type { BagListing } from '@/types/listing.types';
import { usePagination } from './usePagination';

interface ErrorResponse {
  success: boolean;
  message: string;
  timestamp: string;
  path: string;
}

export const useFavorites = () => {
  const { success, error } = useToastStore();
  const [favorites, setFavorites] = useState<BagListing[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const pagination = usePagination({ initialLimit: 12 });

  /**
   * Fetch favorites with pagination
   */
  const fetchFavorites = async (page?: number) => {
    setIsLoading(true);
    try {
      const response = await favoriteService.getUserFavorites({
        page: page || pagination.page,
        limit: pagination.limit,
      });

      setFavorites(response.data);
      pagination.updatePagination(response.pagination);
    } catch (err) {
      const axiosError = err as AxiosError<ErrorResponse>;
      error(axiosError.response?.data?.message || 'Failed to load favorites');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Toggle favorite
   */
  const toggleFavorite = async (listingId: string) => {
    try {
      const response = await favoriteService.toggleFavorite(listingId);

      if (response.isFavorited) {
        success('Added to favorites');
      } else {
        success('Removed from favorites');
      }

      return response.isFavorited;
    } catch (err) {
      const axiosError = err as AxiosError<ErrorResponse>;
      error(axiosError.response?.data?.message || 'Failed to toggle favorite');
      return null;
    }
  };

  return {
    // State
    favorites,
    isLoading,
    pagination,

    // Actions
    fetchFavorites,
    toggleFavorite,
  };
};