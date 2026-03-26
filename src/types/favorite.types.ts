import type { BagListingApiResponse } from './listing.types';

export interface ToggleFavoriteResponse {
  isFavorited: boolean;
}

export interface FavoritePaginatedResponse {
  success: boolean;
  data: {
    data: BagListingApiResponse[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasMore: boolean;
    };
  };
}