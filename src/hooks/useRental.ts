// import { loadStripe } from '@stripe/stripe-js';
import { useState, useEffect, useCallback } from 'react';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { useToastStore } from '@/stores/toastStore';
import { rentalService } from '@/services/rental.service';

// const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);


export const useRental = (pricePerDay: number, listingId: string) => {
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [blockedDates, setBlockedDates] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingDates, setIsLoadingDates] = useState(true);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { error } = useToastStore();

  const totalDays = startDate && endDate ? endDate.diff(startDate, 'day') : 0;
  const totalPrice = totalDays * pricePerDay;

  useEffect(() => {
    const load = async () => {
      setIsLoadingDates(true);
      try {
        const dates = await rentalService.getBlockedDates(listingId);
        setBlockedDates(dates);
      } catch {
        // Non-critical
      } finally {
        setIsLoadingDates(false);
      }
    };
    load();
  }, [listingId]);

  const handleDateChange = useCallback(
    (start: Dayjs | null, end: Dayjs | null) => {
      // Si solo se seleccionó una fecha (start == end o end es null)
      // resetear para evitar que persista el rango anterior
      if (!start || !end || start.isSame(end, 'day')) {
        setStartDate(start);
        setEndDate(null);
        return;
      }

      // Verificar si hay alguna fecha bloqueada dentro del rango
      const hasBlockedDateInRange = blockedDates.some((blocked) => {
        const blockedDay = dayjs(blocked);
        return blockedDay.isAfter(start, 'day') && blockedDay.isBefore(end, 'day');
      });

      if (hasBlockedDateInRange) {
        // Resetear — mismo comportamiento que Airbnb
        setStartDate(null);
        setEndDate(null);
        return;
      }

      setStartDate(start);
      setEndDate(end);
    },
    [blockedDates],
  );

  const isDateBlocked = useCallback(
    (date: Date): boolean => blockedDates.includes(dayjs(date).format('YYYY-MM-DD')),
    [blockedDates],
  );

  // Abre el confirm dialog — valida auth antes
  const handleRentClick = () => {
    if (!isAuthenticated) {
      error('Please log in to rent this listing');
      return;
    }
    if (!startDate || !endDate || totalDays <= 0) return;
    setShowConfirmDialog(true);
  };

  // Confirma la renta 
  const handleConfirmRent = async () => {
    if (!startDate || !endDate) return;
    setIsSubmitting(true);
    try {
      const rental = await rentalService.createRental({
        listingId,
        startDate: startDate.format('YYYY-MM-DD'),
        endDate: endDate.format('YYYY-MM-DD'),
      });
      const { url } = await rentalService.createCheckoutSession(rental.id);
      sessionStorage.setItem('payment_return_url', window.location.pathname);
      window.location.href = url; // redirect a Stripe hosted page
    } catch (err: unknown) {
      const message =
        err instanceof Error && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;
      error(message || 'Failed to initiate payment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessDialog(false);
    navigate('/my-rentals');
  };

  const handleKeepLooking = () => {
    setShowSuccessDialog(false);
    navigate('/');
  };

  return {
    startDate,
    endDate,
    totalDays,
    totalPrice,
    blockedDates,
    isSubmitting,
    isLoadingDates,
    showConfirmDialog,
    showSuccessDialog,
    handleDateChange,
    handleRentClick,
    handleConfirmRent,
    handleSuccessClose,
    handleKeepLooking,
    isDateBlocked,
    setShowConfirmDialog,
  };
};