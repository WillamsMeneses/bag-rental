import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import type { BagListing } from '@/types/listing.types';
import { listingService } from '@/services/listing.service';

export const useListingDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [listing, setListing] = useState<BagListing | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      setIsLoading(true);
      try {
        const data = await listingService.getListingById(id);
        setListing(data);
      } catch {
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [id]);

  return { listing, isLoading, error };
};