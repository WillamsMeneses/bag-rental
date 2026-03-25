import { useState } from 'react';
import type { RentalApiResponse } from '@/types/rental.types';

interface UseRentalDetailReturn {
  selectedRental: RentalApiResponse | null;
  openDetail: (rental: RentalApiResponse) => void;
  closeDetail: () => void;
}

export const useRentalDetail = (): UseRentalDetailReturn => {
  const [selectedRental, setSelectedRental] = useState<RentalApiResponse | null>(null);

  return {
    selectedRental,
    openDetail: (rental) => setSelectedRental(rental),
    closeDetail: () => setSelectedRental(null),
  };
};