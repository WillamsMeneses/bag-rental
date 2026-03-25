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

// Tipo limpio para uso interno en el frontend
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

// Shape real del listing embebido en el response de rentals
export interface RentalListingApiResponse {
  id: string;
  userId: string;
  title: string;
  pricePerDay: string; // DECIMAL from DB
  gender: 'male' | 'female';
  hand: 'left_handed' | 'right_handed';
  street: string | null;
  zipCode: string | null;
  state: string | null;
  city: string | null;
  photos: string[];
  isActive: boolean;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

// Shape real del rental que devuelve la API (strings en campos DECIMAL)
export interface RentalApiResponse {
  id: string;
  listingId: string;
  listing: RentalListingApiResponse;
  renterId: string;
  ownerId: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  pricePerDay: string; // DECIMAL from DB
  totalAmount: string; // DECIMAL from DB
  paymentStatus: string;
  paymentIntentId: string | null;
  paymentMethod: string | null;
  paidAt: string | null;
  refundAmount: string | null;
  refundedAt: string | null;
  status: RentalStatus;
  cancelledAt: string | null;
  cancelledBy: string | null;
  cancellationReason: string | null;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedRentals {
  data: RentalApiResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
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