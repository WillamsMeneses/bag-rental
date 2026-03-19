import { useState } from 'react';
import dayjs, { type Dayjs } from 'dayjs';

export const useRental = (pricePerDay: number) => {
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalDays = startDate && endDate
    ? endDate.diff(startDate, 'day')
    : 0;

  const totalPrice = totalDays * pricePerDay;

  const handleDateChange = (start: Dayjs | null, end: Dayjs | null) => {
    setStartDate(start);
    setEndDate(end);
  };

  // Rental submit — to be implemented in second iteration
  const handleRent = async () => {
    if (!startDate || !endDate) return;
    setIsSubmitting(true);
    // TODO: call rental service
    setIsSubmitting(false);
  };

  return {
    startDate,
    endDate,
    totalDays,
    totalPrice,
    isSubmitting,
    handleDateChange,
    handleRent,
  };
};