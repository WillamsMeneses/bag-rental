import type { BlockedDatesResponse, CheckAvailabilityDto, CheckAvailabilityResponse, CreateRentalDto, Rental } from '@/types/rental.types';
import { api } from './api';

interface BackendResponse<T> {
  success: boolean;
  data: T;
}

export const rentalService = {
  /**
   * Get blocked dates for a listing (public — no auth needed)
   */
  getBlockedDates: async (listingId: string): Promise<string[]> => {
    const response = await api.get<BackendResponse<BlockedDatesResponse>>(
      `/rentals/listings/${listingId}/blocked-dates`,
    );
    return response.data.data.blockedDates;
  },

  /**
   * Check availability for a date range
   */
  checkAvailability: async (
    dto: CheckAvailabilityDto,
  ): Promise<CheckAvailabilityResponse> => {
    const response = await api.post<BackendResponse<CheckAvailabilityResponse>>(
      '/rentals/check-availability',
      dto,
    );
    return response.data.data;
  },

  /**
   * Create a rental (blocks dates for 15 min)
   */
  createRental: async (dto: CreateRentalDto): Promise<Rental> => {
    const response = await api.post<BackendResponse<Rental>>('/rentals', dto);
    return response.data.data;
  },

  /**
   * Confirm payment (mock — no payment integration yet)
   */
  confirmPayment: async (rentalId: string): Promise<Rental> => {
    const response = await api.patch<BackendResponse<Rental>>(
      `/rentals/${rentalId}/confirm-payment`,
    );
    return response.data.data;
  },
};