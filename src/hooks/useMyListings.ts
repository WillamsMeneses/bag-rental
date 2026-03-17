import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { AxiosError } from 'axios';
import { useToastStore } from '@/stores/toastStore';
import type { BagListing, CreateListingDto, ListingStatus } from '@/types/listing.types';
import { listingService } from '@/services/listing.service';
import { usePagination } from './usePagination';

interface ErrorResponse {
  success: boolean;
  message: string;
  timestamp: string;
  path: string;
}

export const useMyListings = () => {
  const navigate = useNavigate();
  const { success, error } = useToastStore();
  const [listings, setListings] = useState<BagListing[]>([]);
  const [currentListing, setCurrentListing] = useState<BagListing | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isTabLoading, setIsTabLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Paginación
  const pagination = usePagination({ initialLimit: 12 });

  /**
   * Fetch my listings with pagination
   */
  const fetchMyListings = async (page?: number, status?: ListingStatus) => {
    setIsLoading(true);
    try {
      const response = await listingService.getMyListings({
        page: page || pagination.page,
        limit: pagination.limit,
        status,
      });
      setListings(response.data);
      pagination.updatePagination(response.pagination);
    } catch (err) {
      const axiosError = err as AxiosError<ErrorResponse>;
      error(axiosError.response?.data?.message || 'Failed to load listings');
    } finally {
      setIsLoading(false);
    }
  };

  /**
  * Fetch my listings with tab
  */
  const fetchMyListingsByTab = async (page?: number, status?: ListingStatus) => {
    setIsTabLoading(true);
    try {
      const response = await listingService.getMyListings({
        page: page || pagination.page,
        limit: pagination.limit,
        status,
      });
      setListings(response.data);
      pagination.updatePagination(response.pagination);
    } catch (err) {
      const axiosError = err as AxiosError<ErrorResponse>;
      error(axiosError.response?.data?.message || 'Failed to load listings');
    } finally {
      setIsTabLoading(false);
    }
  };

  /**
   * Fetch a single listing by ID
   */
  const fetchListingById = async (id: string) => {
    setIsLoading(true);
    try {
      const listing = await listingService.getListingById(id);
      setCurrentListing(listing);
      return listing;
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
      const listing = await listingService.createListing(data);
      success('Listing created successfully!');

      // Refresh listings list
      await fetchMyListings(1);

      return listing;
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
    navigate(`/edit-listing/${id}`);
  };

  /**
   * Pause a listing (toggle status)
   */
  const handlePauseListing = async (id: string) => {
    try {
      await listingService.toggleListingStatus(id);
      success('Listing status updated');

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
      await listingService.deleteListing(id);
      success('Listing deleted successfully');

      // Remove from local state
      setListings((prev) => prev.filter((listing) => listing.id !== id));
    } catch (err) {
      const axiosError = err as AxiosError<ErrorResponse>;
      error(axiosError.response?.data?.message || 'Failed to delete listing');
    }
  };

  /**
   * Load more (for infinite scroll)
   */
  const loadMore = async () => {
    if (!pagination.hasMore || isLoading) return;

    setIsLoading(true);
    try {
      const response = await listingService.getMyListings({
        page: pagination.page + 1,
        limit: pagination.limit,
      });

      // Append new listings
      setListings((prev) => [...prev, ...response.data]);
      pagination.updatePagination(response.pagination);
    } catch (err) {
      const axiosError = err as AxiosError<ErrorResponse>;
      error(axiosError.response?.data?.message || 'Failed to load more listings');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Auto-fetch listings on mount
   */
  useEffect(() => {
    fetchMyListings();
  }, []);

  /**
   * Auto-fetch when page changes (for pagination component)
   */
  useEffect(() => {
    if (pagination.page > 1) {
      fetchMyListings();
    }
  }, [pagination.page]);

  return {
    // State
    listings,
    currentListing,
    isLoading,
    isCreating,
    pagination,
    isTabLoading,

    // Actions
    fetchMyListings,
    fetchListingById,
    createListing,
    handleEditListing,
    handlePauseListing,
    handleDeleteListing,
    loadMore,
    fetchMyListingsByTab
  };
};