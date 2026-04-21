import type { BlockedDatesResponse, CheckAvailabilityDto, CheckAvailabilityResponse, CreateRentalDto, PaginatedRentals, Rental } from '@/types/rental.types';
import { api } from './api';
import type { RentalRequestDetail, RentalStatusResponse } from '@/types/rental-request.types';

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

  // getRentalById: async (rentalId: string): Promise<Rental> => {
  //   const response = await api.get<BackendResponse<Rental>>(`/rentals/${rentalId}`);
  //   return response.data.data;
  // },

  getRentalStatus: async (rentalId: string): Promise<RentalStatusResponse> => {
    const response = await api.get<BackendResponse<RentalStatusResponse>>(
      `/rentals/${rentalId}/status`
    );
    return response.data.data;
  },

  // ✅ NUEVO: Para el detalle del rental request (owner view)
  getRentalRequestById: async (rentalId: string): Promise<RentalRequestDetail> => {
    const response = await api.get<BackendResponse<RentalRequestDetail>>(
      `/rentals/requests/${rentalId}`
    );
    return response.data.data;
  },

  getMyRentals: async (page = 1, limit = 10): Promise<PaginatedRentals> => {
    const response = await api.get<{ success: boolean; data: PaginatedRentals }>(
      '/rentals/my-rentals',
      { params: { page, limit } },
    );
    return response.data.data;
  },
};