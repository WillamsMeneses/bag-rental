import { useAuth } from '@/hooks/useAuth';
import { loginSchema, type LoginFormData } from '@/schemas/authSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, TextField, Typography } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';

interface AuthLoginFormProps {
  onSuccess?: () => void;
}

const AuthLoginForm = ({ onSuccess }: AuthLoginFormProps) => {
  const { handleLogin, isLoading } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      password: '',
    },
  });

  return (
    <>
      <Typography variant="h1" sx={{ mb: '8px' }}>
        GOOD TO SEE YOU <br></br>AGAIN!
      </Typography>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }}>
        <Typography variant="subtitle2">
          Please log in.
        </Typography>

        <form id="auth-form" onSubmit={handleSubmit((data) => handleLogin(data, onSuccess))}>
          <Box>
            <Typography variant="h6" sx={{
              mb: '5px'
            }}>
              Password
            </Typography>
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="password"
                  error={!!errors.password}
                  helperText={errors.password?.message}
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

export default AuthLoginForm;