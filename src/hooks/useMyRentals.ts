import { useEffect, useState } from 'react';
import type { RentalApiResponse } from '@/types/rental.types';
import { rentalService } from '@/services/rental.service';

export interface RentalGroup {
  label: string; // "October 2023"
  rentals: RentalApiResponse[];
}

interface UseMyRentalsReturn {
  groups: RentalGroup[];
  loading: boolean;
  error: string | null;
}

const groupByMonth = (rentals: RentalApiResponse[]): RentalGroup[] => {
  const map = new Map<string, RentalApiResponse[]>();

  for (const rental of rentals) {
    const date = new Date(rental.createdAt);
    const label = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    if (!map.has(label)) map.set(label, []);
    map.get(label)!.push(rental);
  }

  return Array.from(map.entries()).map(([label, rentals]) => ({ label, rentals }));
};

export const useMyRentals = (): UseMyRentalsReturn => {
  const [groups, setGroups] = useState<RentalGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await rentalService.getMyRentals();
        setGroups(groupByMonth(response.data));
      } catch {
        setError('Failed to load rentals');
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, []);

  return { groups, loading, error };
};