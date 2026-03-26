import type { BagListing } from '@/types/listing.types';
import type { PaginationParams } from '@/types/pagination.types';
import type { ToggleFavoriteResponse, FavoritePaginatedResponse } from '@/types/favorite.types';
import { api } from './api';
import { transformListing } from './listing.service';

export const favoriteService = {
  toggleFavorite: async (listingId: string): Promise<ToggleFavoriteResponse> => {
    const response = await api.post<{ data: ToggleFavoriteResponse }>(`/favorites/${listingId}`);
    return response.data.data;
  },

  getUserFavorites: async (params?: PaginationParams): Promise<{
    data: BagListing[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasMore: boolean;
    };
  }> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const url = `/favorites${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await api.get<FavoritePaginatedResponse>(url);

    return {
      data: response.data.data.data.map(transformListing),
      pagination: response.data.data.pagination,
    };
  },
};