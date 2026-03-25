import { useState, useRef } from 'react';
import { Box, Typography, Stack, Tooltip } from '@mui/material';

interface DetailRowProps {
  label: string;
  value: React.ReactNode;
}

export const DetailRow: React.FC<DetailRowProps> = ({ label, value }) => {
  const [isOverflowing, setIsOverflowing] = useState(false);
  const textRef = useRef<HTMLSpanElement>(null);

  const isString = typeof value === 'string';

  const handleMouseEnter = () => {
    if (textRef.current) {
      setIsOverflowing(textRef.current.scrollWidth > textRef.current.clientWidth);
    }
  };

  return (
    <>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ py: 2 }}
      >
        <Typography variant="body2" color="text.secondary" sx={{ flexShrink: 0 }}>
          {label}
        </Typography>
        <Box sx={{ maxWidth: '60%' }}>
          <Tooltip
            title={isOverflowing && isString ? value : ''}
            placement="top"
            disableHoverListener={!isOverflowing}
          >
            <Typography
              ref={textRef}
              variant="body2"
              fontWeight={600}
              onMouseEnter={handleMouseEnter}
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {value}
            </Typography>
          </Tooltip>
        </Box>
      </Stack>
      <Box sx={{ borderBottom: '0.5px solid', borderColor: 'grey.200' }} />
    </>
  );
};