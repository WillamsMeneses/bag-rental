import type { BagListing } from './listing.types';

export interface ToggleFavoriteResponse {
  isFavorited: boolean;
}

export interface FavoriteIdsResponse {
  favoriteIds: string[];
}

export interface FavoritesResponse {
  success: boolean;
  message: string;
  data: BagListing[];
}