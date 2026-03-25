import { Drawer, Box, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface GenericDrawerProps {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  actions?: React.ReactNode;
  width?: number | string;
  headerSx?: object;
}

export const GenericDrawer = ({
  open,
  onClose,
  title,
  children,
  actions,
  width = 420,
  headerSx
}: GenericDrawerProps) => {
  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width, display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 3, pt: 3, pb: 2, ...headerSx  }}>
          {title ? (
            typeof title === 'string'
              ? <Typography variant="h3" fontWeight={600}>{title}</Typography>
              : title
          ) : <Box />}
          <IconButton onClick={onClose} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Content */}
        <Box sx={{ flex: 1, overflowY: 'auto', px: 3, pb: 2 }}>
          {children}
        </Box>

        {/* Actions */}
        {actions && (
          <Box sx={{ px: 3, pb: 3, pt: 1 }}>
            {actions}
          </Box>
        )}
      </Box>
    </Drawer>
  );
};