// src/utils/dateFormat.ts
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/en';

dayjs.extend(relativeTime);
dayjs.locale('en');

export const formatNotificationDate = (dateStr: string): string => {
  const date = dayjs(dateStr);
  const now = dayjs();
  
  // Si es hoy
  if (date.isSame(now, 'day')) {
    return `Today at ${date.format('h:mm A')}`;
  }
  
  // Si es ayer
  if (date.isSame(now.subtract(1, 'day'), 'day')) {
    return `Yesterday at ${date.format('h:mm A')}`;
  }
  
  // Si es de esta semana (más de ayer pero menos de 7 días)
  if (now.diff(date, 'day') < 7) {
    return `${date.format('dddd')} at ${date.format('h:mm A')}`;
  }
  
  // Fechas más viejas
  return date.format('MMM D, YYYY [at] h:mm A');
};