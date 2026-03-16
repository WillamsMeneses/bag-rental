import type {
  BagListing,
  BagListingApiResponse,
  ClubApiResponse,
  Club,
  CreateListingDto,
  ListingPaginationParams,
} from '@/types/listing.types';
import type { PaginationParams } from '@/types/pagination.types';
import { api } from './api';

/**
 * Transform club data from API (string decimals to numbers)
 */
const transformClub = (club: ClubApiResponse): Club => {
  return {
    ...club,
    loft: Number(club.loft),
  };
};

/**
 * Transform listing data from API
 */
export const transformListing = (listing: BagListingApiResponse): BagListing => {
  return {
    ...listing,
    pricePerDay: Number(listing.pricePerDay),
    clubs: listing.clubs?.map(transformClub) || [],
    isFavorite: listing.isFavorite || false,
  };
};

/**
 * Backend response wrapper
 */
interface BackendPaginatedResponse {
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
  timestamp: string;
  path: string;
}

export const listingService = {
  /**
   * Get all published listings (PUBLIC - with optional auth)
   */
  getAllListings: async (
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

    const url = `/listings${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await api.get<BackendPaginatedResponse>(url);

    return {
      data: response.data.data.data.map(transformListing),
      pagination: response.data.data.pagination,
    };
  },

  /**
   * Get my listings (PRIVATE)
   */
  getMyListings: async (
    params?: ListingPaginationParams,
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
    if (params?.status) queryParams.append('status', params.status);

    const url = `/listings/my-listings${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await api.get<BackendPaginatedResponse>(url);

    return {
      data: response.data.data.data.map(transformListing),
      pagination: response.data.data.pagination,
    };
  },

  /**
   * Get listing by ID
   */
  getListingById: async (id: string): Promise<BagListing> => {
    const response = await api.get<BagListingApiResponse>(`/listings/${id}`);
    return transformListing(response.data);
  },

  /**
   * Create listing
   */
  createListing: async (data: CreateListingDto): Promise<BagListing> => {
    const response = await api.post<BagListingApiResponse>('/listings', data);
    return transformListing(response.data);
  },

  /**
   * Toggle listing status
   */
  toggleListingStatus: async (id: string): Promise<BagListing> => {
    const response = await api.patch<BagListingApiResponse>(
      `/listings/${id}/toggle-status`,
    );
    return transformListing(response.data);
  },

  /**
   * Delete listing
   */
  deleteListing: async (id: string): Promise<{ success: boolean; message: string }> => {
    await api.delete(`/listings/${id}`);
    return {
      success: true,
      message: 'Listing deleted successfully',
    };
  },

  /**
  * Update listing (PATCH) — used in edit mode
  */
  updateListing: async (id: string, data: CreateListingDto): Promise<BagListing> => {
    const response = await api.patch<BagListingApiResponse>(`/listings/${id}`, data);
    return transformListing(response.data);
  },
};

