import type { Club } from "./listing.types";

// src/types/rental-request.types.ts
export interface RentalStatusResponse {
  id: string;
  status: string;
}

export interface RentalStatusResponse {
  id: string;
  status: string;
}

export interface RentalRequestDetail {
  id: string;
  status: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  totalAmount: number;
  commissionFee: number;
  commissionFeePercent: number;
  totalYouReceive: number;
  canDeny: boolean;
  canAccept: boolean;
  listing: {
    id: string;
    title: string;
    description: string | null;
    photos: string[];
    hand: string;
    gender: string;
    city: string | null;
    state: string | null;
    pricePerDay: number;
    clubs: Club[]; // 👈
  };
  renter: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string;
    avatarUrl: string | null;
    location: string | null;
  };
}