import { useState, useEffect } from 'react';
import { favoriteService } from '@/services/favorite.service';
import { useToastStore } from '@/stores/toastStore';
import type { BagListing } from '@/types/listing.types';
import { useAuthStore } from '@/stores/authStore';

interface UseFavoritesPageReturn {
  favorites: BagListing[];
  loading: boolean;
  pagination: {
    page: number;
    totalPages: number;
    hasMore: boolean;
  };
  setPage: (page: number) => void;
  toggleFavorite: (id: string) => Promise<void>;
}

export const useFavoritesPage = (autoFetch = true): UseFavoritesPageReturn => {
  const [favorites, setFavorites] = useState<BagListing[]>([]);
  const { isAuthenticated } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const { error } = useToastStore();

  const fetchFavorites = async (p: number) => {
    setLoading(true);
    try {
      const response = await favoriteService.getUserFavorites({ page: p, limit: 12 });
      setFavorites(response.data);
      setTotalPages(response.pagination.totalPages);
      setHasMore(response.pagination.hasMore);
    } catch {
      error('Failed to load favorites');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoFetch && isAuthenticated) { // 👈
      fetchFavorites(page);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, isAuthenticated]);

  const toggleFavorite = async (id: string) => {
    // Remove immediately without waiting for response
    setFavorites((prev) => prev.filter((f) => f.id !== id));
    favoriteService.toggleFavorite(id).catch(() => {
      // Revert on failure — refetch
      fetchFavorites(page);
    });
  };

  return {
    favorites,
    loading,
    pagination: { page, totalPages, hasMore },
    setPage,
    toggleFavorite,
  };
};