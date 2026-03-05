//TODO: Revisar esto porque no lo estoy usando en una vista
import type { BagListing, BagListingApiResponse } from '@/types/listing.types';
import type { PaginationParams } from '@/types/pagination.types';
import type { ToggleFavoriteResponse } from '@/types/favorite.types';
import { api } from './api';
import { transformListing } from './listing.service';

export const favoriteService = {
  /**
   * Toggle favorite on a listing
   */
  toggleFavorite: async (
    listingId: string,
  ): Promise<ToggleFavoriteResponse> => {
    const response = await api.post<ToggleFavoriteResponse>(
      `/favorites/${listingId}`,
    );
    return response.data;
  },

  /**
   * Get user favorites WITH PAGINATION
   */
  getUserFavorites: async (
    params?: PaginationParams,
  ): Promise<{
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
    const response = await api.get<{
      data: BagListingApiResponse[];
      pagination: any;
    }>(url);

    return {
      data: response.data.data.map(transformListing),
      pagination: response.data.pagination,
    };
  },

  // ELIMINAR getFavoriteIds() porque ya no es necesario
};