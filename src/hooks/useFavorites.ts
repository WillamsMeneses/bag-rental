import { useState, useEffect } from 'react';
import type { AxiosError } from 'axios';
import { useToastStore } from '@/stores/toastStore';
import { favoriteService } from '@/services/favorite.service';
import type { BagListing } from '@/types/listing.types';

interface ErrorResponse {
  success: boolean;
  message: string;
  timestamp: string;
  path: string;
}

export const useFavorites = () => {
  const { success, error } = useToastStore();
  const [favorites, setFavorites] = useState<BagListing[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Fetch favorite IDs
   */
  const fetchFavoriteIds = async () => {
    try {
      const ids = await favoriteService.getFavoriteIds();
      setFavoriteIds(new Set(ids));
    } catch (err) {
      const axiosError = err as AxiosError<ErrorResponse>;
      console.error('Failed to load favorites:', axiosError);
    }
  };

  /**
   * Fetch all favorites
   */
  const fetchFavorites = async () => {
    setIsLoading(true);
    try {
      const response = await favoriteService.getUserFavorites();
      setFavorites(response.data);
      
      // También actualizar los IDs
      const ids = response.data.map((listing) => listing.id);
      setFavoriteIds(new Set(ids));
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
      
      // Actualizar el Set de IDs
      const newFavoriteIds = new Set(favoriteIds);
      if (response.isFavorited) {
        newFavoriteIds.add(listingId);
        success('Added to favorites');
      } else {
        newFavoriteIds.delete(listingId);
        success('Removed from favorites');
      }
      setFavoriteIds(newFavoriteIds);

      return response.isFavorited;
    } catch (err) {
      const axiosError = err as AxiosError<ErrorResponse>;
      error(axiosError.response?.data?.message || 'Failed to toggle favorite');
      return null;
    }
  };

  /**
   * Check if a listing is favorited
   */
  const isFavorited = (listingId: string): boolean => {
    return favoriteIds.has(listingId);
  };

  /**
   * Auto-fetch favorite IDs on mount
   */
  useEffect(() => {
    fetchFavoriteIds();
  }, []);

  return {
    // State
    favorites,
    favoriteIds,
    isLoading,

    // Actions
    fetchFavorites,
    fetchFavoriteIds,
    toggleFavorite,
    isFavorited,
  };
};