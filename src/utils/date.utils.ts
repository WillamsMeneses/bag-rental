import dayjs from 'dayjs';

export const formatRentalDate = (dateStr: string): string =>
  dayjs(dateStr).format('MMMM D [of] YYYY');