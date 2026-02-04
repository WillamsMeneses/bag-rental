import { Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Box } from '@mui/material';
import CloseIcon from '../icons/CloseIcon';

interface GenericDialogProps {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  actions?: React.ReactNode;
  showCloseButton?: boolean;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export const GenericDialog = ({
  open,
  onClose,
  title,
  children,
  actions,
  showCloseButton = false,
  maxWidth = 'sm'
}: GenericDialogProps) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth
    >
      {title && (
        <DialogTitle sx={{ p: 0, position: 'relative' }}>
          <Box sx={{ width: '100%' }}>
            {title}
          </Box>
          {showCloseButton && (
            <IconButton 
              onClick={onClose} 
              size="small"
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                '&:hover': {
                  color: 'black'
                },
                width: 32,
                height: 32,
                color: 'white'
              }}
            >
              <CloseIcon />
            </IconButton>
          )}
        </DialogTitle>
      )}
      
      <DialogContent sx={{ p: 3}}>
        {children}
      </DialogContent>

      {actions && (
        <DialogActions sx={{ p: 3, pt: 0 }}>
          {actions}
        </DialogActions>
      )}
    </Dialog>
  );
};