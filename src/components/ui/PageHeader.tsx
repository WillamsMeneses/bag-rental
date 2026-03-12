import { Box, Stack, Typography, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

interface PageHeaderProps {
  title: string;
  showBack?: boolean;
  action?: React.ReactNode; // botón Publish u cualquier otra cosa
}

export default function PageHeader({ title, showBack = true, action }: PageHeaderProps) {
  const navigate = useNavigate();

  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      sx={{ mb: 4 }}
    >
      <Stack direction="row" alignItems="center" spacing={1}>
        {showBack && (
          <IconButton onClick={() => navigate(-1)} size="small">
            <ArrowBackIcon sx={{ width: 24, height: 24, color: 'text.primary' }} />
          </IconButton>
        )}
        <Typography variant="h3" fontWeight={700}>
          {title}
        </Typography>
      </Stack>

      {action && <Box>{action}</Box>}
    </Stack>
  );
}