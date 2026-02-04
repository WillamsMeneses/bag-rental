import { useAuth } from '@/hooks/useAuth';
import { authSchema, type AuthFormData } from '@/schemas/authSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, TextField, Typography } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';

const AuthEmailForm = () => {
  const { handleCheckEmail, isLoading } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: '',
    },
  });

  return (
    <>
      <Typography variant="h1" sx={{ mb: '8px' }}>
        WELCOME!
      </Typography>
      <Typography variant="subtitle2" sx={{ marginBottom: '24px' }}>
        Ready to Rent or Lend Clubs?
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Typography variant="h5" sx={{ fontSize: '16px', fontWeight: 600 }}>
          Register or log in now, it's free.
        </Typography>

        <form id="auth-form" onSubmit={handleSubmit(handleCheckEmail)}>
          <Box>
            <Typography variant="h6" sx={{ mb: 0.5, fontWeight: 500 }}>
              Email
            </Typography>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="email"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  fullWidth
                  disabled={isLoading}
                />
              )}
            />
          </Box>
        </form>
      </Box>
    </>
  );
};

export default AuthEmailForm;