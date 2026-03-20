import type { BlockedDatesResponse, CheckAvailabilityDto, CheckAvailabilityResponse, CreateRentalDto, Rental } from '@/types/rental.types';
import { api } from './api';

interface BackendResponse<T> {
  success: boolean;
  data: T;
}

interface PaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
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

  createPaymentIntent: async (rentalId: string): Promise<PaymentIntentResponse> => {
    const response = await api.post<BackendResponse<PaymentIntentResponse>>(
      `/rentals/${rentalId}/create-payment-intent`,
    );
    return response.data.data;
  },

  createCheckoutSession: async (rentalId: string): Promise<{ url: string }> => {
    const response = await api.post<BackendResponse<{ url: string }>>(
      `/rentals/${rentalId}/create-checkout-session`,
    );
    return response.data.data;
  },

  getRentalById: async (rentalId: string): Promise<Rental> => {
    const response = await api.get<BackendResponse<Rental>>(`/rentals/${rentalId}`);
    return response.data.data;
  },
};