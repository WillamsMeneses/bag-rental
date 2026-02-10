import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { AxiosError } from 'axios';
import { useToastStore } from '@/stores/toastStore';
import type { BagListing, CreateListingDto } from '@/types/listing.types';
import { listingService } from '@/services/listing.service';

interface ErrorResponse {
  success: boolean;
  message: string;
  timestamp: string;
  path: string;
}

export const useListings = () => {
  const navigate = useNavigate();
  const { success, error } = useToastStore();
  const [listings, setListings] = useState<BagListing[]>([]);
  const [currentListing, setCurrentListing] = useState<BagListing | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  /**
   * Fetch all user listings
   */
  const fetchMyListings = async () => {
    setIsLoading(true);
    try {
      const response = await listingService.getMyListings();
      setListings(response.data);
    } catch (err) {
      const axiosError = err as AxiosError<ErrorResponse>;
      error(axiosError.response?.data?.message || 'Failed to load listings');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Fetch a single listing by ID
   */
  const fetchListingById = async (id: string) => {
    setIsLoading(true);
    try {
      const response = await listingService.getListingById(id);
      setCurrentListing(response.data);
      return response.data;
    } catch (err) {
      const axiosError = err as AxiosError<ErrorResponse>;
      error(axiosError.response?.data?.message || 'Failed to load listing');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Create a new listing
   */
  const createListing = async (data: CreateListingDto) => {
    setIsCreating(true);
    try {
      const response = await listingService.createListing(data);
      success(response.message || 'Listing created successfully!');
      
      // Refresh listings list
      await fetchMyListings();
      
      return response.data;
    } catch (err) {
      const axiosError = err as AxiosError<ErrorResponse>;
      error(axiosError.response?.data?.message || 'Failed to create listing');
      return null;
    } finally {
      setIsCreating(false);
    }
  };

  /**
   * Edit a listing (navigate to edit page)
   */
  const handleEditListing = (id: string) => {
    navigate(`/listings/${id}/edit`);
  };

  /**
   * Pause a listing (toggle status)
   */
  const handlePauseListing = async (id: string) => {
    try {
      const response = await listingService.toggleListingStatus(id);
      success(response.message || 'Listing status updated');
      
      // Update local state
      setListings((prev) =>
        prev.map((listing) =>
          listing.id === id ? { ...listing, isActive: !listing.isActive } : listing
        )
      );
    } catch (err) {
      const axiosError = err as AxiosError<ErrorResponse>;
      error(axiosError.response?.data?.message || 'Failed to update listing status');
    }
  };

  /**
   * Delete a listing
   */
  const handleDeleteListing = async (id: string) => {
    try {
      const response = await listingService.deleteListing(id);
      success(response.message || 'Listing deleted successfully');
      
      // Remove from local state
      setListings((prev) => prev.filter((listing) => listing.id !== id));
    } catch (err) {
      const axiosError = err as AxiosError<ErrorResponse>;
      error(axiosError.response?.data?.message || 'Failed to delete listing');
    }
  };

  /**
   * Auto-fetch listings on mount
   */
  useEffect(() => {
    fetchMyListings();
  }, []);

  return {
    // State
    listings,
    currentListing,
    isLoading,
    isCreating,

    // Actions
    fetchMyListings,
    fetchListingById,
    createListing,
    handleEditListing,
    handlePauseListing,
    handleDeleteListing,
  };
};