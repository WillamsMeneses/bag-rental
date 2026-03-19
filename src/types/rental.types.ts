export const RentalStatus = {
  PENDING_PAYMENT: 'pending_payment',
  CONFIRMED: 'confirmed',
  ACTIVE: 'active',
  COMPLETED: 'completed',
  CANCELLED_BY_RENTER: 'cancelled_by_renter',
  CANCELLED_BY_OWNER: 'cancelled_by_owner',
  EXPIRED: 'expired',
} as const;

export type RentalStatus = typeof RentalStatus[keyof typeof RentalStatus];

export interface Rental {
  id: string;
  listingId: string;
  renterId: string;
  ownerId: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  pricePerDay: number;
  totalAmount: number;
  paymentStatus: string;
  paymentIntentId: string | null;
  paymentMethod: string | null;
  paidAt: string | null;
  refundAmount: number | null;
  refundedAt: string | null;
  status: RentalStatus;
  cancelledAt: string | null;
  cancelledBy: string | null;
  cancellationReason: string | null;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRentalDto {
  listingId: string;
  startDate: string; // 'YYYY-MM-DD'
  endDate: string;   // 'YYYY-MM-DD'
}

export interface CheckAvailabilityDto {
  listingId: string;
  startDate: string;
  endDate: string;
}

export interface CheckAvailabilityResponse {
  available: boolean;
  blockedDates?: string[];
}

export interface BlockedDatesResponse {
  blockedDates: string[];
}