import type {
  BagListing,
  BagListingApiResponse,
  ClubApiResponse,
  Club,
  CreateListingDto,
  ListingResponse,
  ListingsResponse,
} from '@/types/listing.types';
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
 * TypeORM returns DECIMAL fields as strings to avoid precision loss
 * We convert them to numbers for frontend use
 */
export const transformListing = (listing: BagListingApiResponse): BagListing => {
  return {
    ...listing,
    pricePerDay: Number(listing.pricePerDay),
    clubs: listing.clubs?.map(transformClub) || [],
  };
};

/**
 * Backend response wrapper type
 */
interface BackendResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
  path: string;
}

export const listingService = {
  /**
   * Create a new bag listing
   */
  createListing: async (data: CreateListingDto): Promise<ListingResponse> => {
    const response = await api.post<BagListingApiResponse>('/listings', data);
    return {
      success: true,
      message: 'Listing created successfully',
      data: transformListing(response.data),
    };
  },

  /**
   * Get all published listings (for dashboard)
   */
  getAllListings: async (): Promise<ListingsResponse> => {
    const response = await api.get<BackendResponse<BagListingApiResponse[]>>('/listings');
    return {
      success: true,
      message: 'All listings retrieved successfully',
      data: response.data.data.map(transformListing),
    };
  },

  /**
   * Get all listings for the current user
   */
  getMyListings: async (): Promise<ListingsResponse> => {
    const response = await api.get<BackendResponse<BagListingApiResponse[]>>('/listings/my-listings');
    return {
      success: true,
      message: 'Listings retrieved successfully',
      data: response.data.data.map(transformListing),
    };
  },

  /**
   * Get a single listing by ID
   */
  getListingById: async (id: string): Promise<ListingResponse> => {
    const response = await api.get<BagListingApiResponse>(`/listings/${id}`);
    return {
      success: true,
      message: 'Listing retrieved successfully',
      data: transformListing(response.data),
    };
  },

  /**
   * Update a listing (placeholder for future implementation)
   */
  updateListing: async (
    id: string,
    data: Partial<CreateListingDto>
  ): Promise<ListingResponse> => {
    const response = await api.patch<BagListingApiResponse>(`/listings/${id}`, data);
    return {
      success: true,
      message: 'Listing updated successfully',
      data: transformListing(response.data),
    };
  },

  /**
   * Delete a listing (placeholder for future implementation)
   */
  deleteListing: async (id: string): Promise<{ success: boolean; message: string }> => {
    await api.delete(`/listings/${id}`);
    return {
      success: true,
      message: 'Listing deleted successfully',
    };
  },

  /**
   * Pause/unpause a listing (placeholder for future implementation)
   */
  toggleListingStatus: async (id: string): Promise<ListingResponse> => {
    const response = await api.patch<BagListingApiResponse>(`/listings/${id}/toggle-status`);
    return {
      success: true,
      message: 'Listing status updated successfully',
      data: transformListing(response.data),
    };
  },
};