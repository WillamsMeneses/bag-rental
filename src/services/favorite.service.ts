import type {
  BagListingApiResponse,
} from '@/types/listing.types';
import type {
  ToggleFavoriteResponse,
  FavoriteIdsResponse,
  FavoritesResponse,
} from '@/types/favorite.types';
import { api } from './api';

// Reutilizar la función transformListing de listing.service
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
   * Get all user favorites
   */
  getUserFavorites: async (): Promise<FavoritesResponse> => {
    const response = await api.get<BagListingApiResponse[]>('/favorites');
    return {
      success: true,
      message: 'Favorites retrieved successfully',
      data: response.data.map(transformListing),
    };
  },

  /**
   * Get favorite listing IDs
   */
  getFavoriteIds: async (): Promise<string[]> => {
    const response = await api.get<FavoriteIdsResponse>('/favorites/ids');
    return response.data.favoriteIds;
  },
};