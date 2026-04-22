import { useEffect, useState, useCallback } from 'react';
import { rentalService } from '@/services/rental.service';
import type { RentalRequestDetail } from '@/types/rental-request.types';

interface UseRentalRequestDetailReturn {
  rentalRequest: RentalRequestDetail | null;
  loading: boolean;
  error: string | null;
  isDenying: boolean;
  refetch: () => void;
  denyRental: (reason?: string) => Promise<void>;
}

export const useRentalRequestDetail = (id?: string): UseRentalRequestDetailReturn => {
  const [rentalRequest, setRentalRequest] = useState<RentalRequestDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDenying, setIsDenying] = useState(false);
  const [tick, setTick] = useState(0);

  const refetch = () => setTick((t) => t + 1);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetch = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await rentalService.getRentalRequestById(id);
        setRentalRequest(data);
      } catch {
        setError('Failed to load rental request');
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [id, tick]);

  const denyRental = useCallback(async (reason?: string) => {
    if (!id) return;
    try {
      setIsDenying(true);
      await rentalService.cancelByOwner(id, reason);
      refetch();
    } catch {
      setError('Failed to deny rental request');
    } finally {
      setIsDenying(false);
    }
  }, [id]);

  return { rentalRequest, loading, error, isDenying, refetch, denyRental };
};