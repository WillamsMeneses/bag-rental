import React from 'react';
import { Box, Typography, Button, Divider } from '@mui/material';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import dayjs from 'dayjs';
import { useRental } from '@/hooks/useRental';
import { RentalConfirmDialog } from './RentalConfirmDialog';
import { RentalSuccessDialog } from './RentalSuccessDialog';

interface RentalPanelProps {
  pricePerDay: number;
  listingId: string;
  listing: {
    title: string;
    pricePerDay: number;
    hand: string;
    photos: string[];
  };
}

export const RentalPanel: React.FC<RentalPanelProps> = ({ pricePerDay, listingId, listing }) => {
  const {
    startDate,
    endDate,
    totalDays,
    totalPrice,
    isSubmitting,
    showConfirmDialog,
    showSuccessDialog,
    handleDateChange,
    handleRentClick,
    handleConfirmRent,
    handleSuccessClose,
    handleKeepLooking,
    isDateBlocked,
    setShowConfirmDialog,
  } = useRental(pricePerDay, listingId);

  return (
    <>
      <Box sx={{ border: '0.5px solid', borderColor: 'grey.300', borderRadius: '12px', p: 3 }}>
        <Typography variant="h3" sx={{ mb: 0.5 }}>Select dates</Typography>

        {startDate && endDate && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="h3" sx={{ fontWeight: 700 }}>
              {totalDays} {totalDays === 1 ? 'day' : 'days'}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {startDate.format('MMM D of YYYY')} – {endDate.format('MMM D of YYYY')}
            </Typography>
          </Box>
        )}

        <Box sx={{
          mb: 3,
          '& .react-calendar': { width: '100%', border: 'none', fontFamily: '"Plus Jakarta Sans", sans-serif' },
          '& .react-calendar__navigation': { display: 'flex', alignItems: 'center', marginBottom: '12px' },
          '& .react-calendar__navigation__label': { flex: 1, background: 'none', border: 'none', cursor: 'default', pointerEvents: 'none' },
          '& .react-calendar__navigation__prev-button, & .react-calendar__navigation__next-button': {
            fontSize: '18px', fontWeight: 400, color: '#404040', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px',
            '&:hover': { background: 'rgba(0,0,0,0.04)', borderRadius: '4px' },
            '&:disabled': { opacity: 0.3, cursor: 'default' },
          },
          '& .react-calendar__navigation__prev2-button, & .react-calendar__navigation__next2-button': { display: 'none' },
          '& .react-calendar__month-view__weekdays': { textAlign: 'center', fontSize: '13px', color: '#737373', fontWeight: 600, marginBottom: '4px', '& abbr': { textDecoration: 'none' } },
          '& .react-calendar__tile': {
            padding: '10px 0', fontSize: '14px', border: 'none', background: 'none', cursor: 'pointer', color: '#404040', position: 'relative', zIndex: 1,
            '&:hover': { background: 'rgba(137, 201, 106, 0.2)', borderRadius: '0' },
            '&:disabled': { color: '#ccc', cursor: 'default', background: 'none' },
          },
          '& .react-calendar__tile--now': { background: 'none', '& abbr': { border: '1.5px solid #89C96A', borderRadius: '50%', padding: '3px 7px' } },
          '& .react-calendar__tile--range': { background: '#E8F5E0', borderRadius: '0', borderTop: '1px solid #89C96A', borderBottom: '1px solid #89C96A', '&:hover': { background: '#dff0d4', borderRadius: '0' } },
          '& .react-calendar__tile--rangeStart': { background: '#E8F5E0 !important', borderRadius: '50px 0 0 50px !important', borderTop: '1px solid #89C96A !important', borderBottom: '1px solid #89C96A !important', borderLeft: '1px solid #89C96A !important', '& abbr': { fontWeight: 700 } },
          '& .react-calendar__tile--rangeEnd': { background: '#E8F5E0 !important', borderRadius: '0 50px 50px 0 !important', borderTop: '1px solid #89C96A !important', borderBottom: '1px solid #89C96A !important', borderRight: '1px solid #89C96A !important', '& abbr': { fontWeight: 700 } },
          '& .react-calendar__tile--rangeBothEnds': { background: '#E8F5E0 !important', borderRadius: '50px !important', border: '1px solid #89C96A !important' },
          '& .react-calendar__month-view__days__day--neighboringMonth': { color: '#ccc' },
          '& .react-calendar__month-view__days__day--weekend': { color: '#ef4444' },
        }}>
          <Calendar
            selectRange
            value={startDate && endDate ? [startDate.toDate(), endDate.toDate()] : null}
            onChange={(value) => {
              if (Array.isArray(value)) {
                // value[0] es el start, value[1] es el end (null si aún no seleccionó)
                handleDateChange(
                  value[0] ? dayjs(value[0]) : null,
                  value[1] ? dayjs(value[1]) : null,
                );
              } else if (value) {
                // Single date click — resetear end
                handleDateChange(dayjs(value as Date), null);
              } else {
                handleDateChange(null, null);
              }
            }}
            onClickDay={() => {
              // Cada vez que el usuario hace click en un día,
              // si ya había un rango completo, lo reseteamos
              if (startDate && endDate) {
                handleDateChange(null, null);
              }
            }}
            minDate={new Date()}
            locale="en-US"
            tileDisabled={({ date }) => isDateBlocked(date)}
            prevLabel={<span style={{ fontSize: '18px' }}>‹</span>}
            nextLabel={<span style={{ fontSize: '18px' }}>›</span>}
            prev2Label={null}
            next2Label={null}
            navigationLabel={({ date }) => (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography sx={{ fontWeight: 600, fontSize: '14px', color: '#404040', lineHeight: 1.4 }}>{date.getFullYear()}</Typography>
                <Typography sx={{ fontWeight: 600, fontSize: '14px', color: '#404040', lineHeight: 1.4 }}>{date.toLocaleString('en-US', { month: 'long' })}</Typography>
              </Box>
            )}
          />
        </Box>

        {totalDays > 0 && (
          <>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="body2">${pricePerDay} × {totalDays} {totalDays === 1 ? 'day' : 'days'}</Typography>
              <Typography variant="h3" sx={{ fontWeight: 700 }}>Total $ {totalPrice.toFixed(2)} USD</Typography>
            </Box>
          </>
        )}

        <Button
          variant="contained"
          color="primary"
          fullWidth
          disabled={totalDays === 0}
          onClick={handleRentClick}
          sx={{ py: 1.5 }}
        >
          {totalDays > 0 ? 'Rent now' : 'Select dates'}
        </Button>
      </Box>

      {/* Confirm dialog */}
      {startDate && endDate && (
        <RentalConfirmDialog
          open={showConfirmDialog}
          onClose={() => setShowConfirmDialog(false)}
          onConfirm={handleConfirmRent}
          isSubmitting={isSubmitting}
          listing={listing}
          startDate={startDate}
          endDate={endDate}
          totalDays={totalDays}
          totalPrice={totalPrice}
        />
      )}

      {/* Success dialog */}
      <RentalSuccessDialog
        open={showSuccessDialog}
        onClose={handleSuccessClose}
        onKeepLooking={handleKeepLooking}
      />
    </>
  );
};