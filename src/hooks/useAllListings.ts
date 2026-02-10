import { useState, useEffect } from 'react';
import type { AxiosError } from 'axios';
import { useToastStore } from '@/stores/toastStore';
import type { BagListing } from '@/types/listing.types';
import { listingService } from '@/services/listing.service';

interface ErrorResponse {
  success: boolean;
  message: string;
  timestamp: string;
  path: string;
}

export const useAllListings = () => {
  const { error } = useToastStore();
  const [allListings, setAllListings] = useState<BagListing[]>([]);
  const [isLoadingAll, setIsLoadingAll] = useState(false);

  const fetchAllListings = async () => {
    setIsLoadingAll(true);
    try {
      const response = await listingService.getAllListings();
      setAllListings(response.data);
    } catch (err) {
      const axiosError = err as AxiosError<ErrorResponse>;
      error(axiosError.response?.data?.message || 'Failed to load listings');
    } finally {
      setIsLoadingAll(false);
    }
  };

  useEffect(() => {
    fetchAllListings();
  }, []);

  return {
    allListings,
    isLoadingAll,
    fetchAllListings,
  };
};