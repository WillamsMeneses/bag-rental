import HoverLink from '@/components/ui/HoverLink';
import { useAuth } from '@/hooks/useAuth';
import { registerSchema, type RegisterFormData } from '@/schemas/authSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Checkbox, TextField, Typography } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';

const AuthRegisterForm = () => {
  const { handleRegister, isLoading } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      password: '',
    },
  });

  return (
    <>
      <Typography variant="h1" sx={{ mb: '8px' }}>
        LOOKS LIKE YOU'RE <br></br> NEW!
      </Typography>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }}>
        <Typography variant="subtitle2">
          Please create an account.
        </Typography>
        <form id="auth-form" onSubmit={handleSubmit(handleRegister)}>
          <Box>
            <Typography variant="h6" sx={{ mb: 0.5, fontWeight: 500 }}>
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
            <Typography variant='caption' sx={{
              mt: '4px'
            }}>At least 8 characters with at least one uppercase, one lowercase, one special character, and one number.</Typography>
          </Box>
        </form>
        <Box sx={{
          display: 'flex'
        }}>

          <Checkbox sx={{
            ml: '-2px',
            mb: '8px',
            mr: '8px'
          }}/>

          < Box sx={{
            display: 'block',
          }}>
            <Typography variant='body2' component="span">I have read and accepted the</Typography>
            {' '}
            <HoverLink to={"/dashboard"} underlineColor='#595959' alwaysUnderline>
              <Typography variant='body2' component="span" sx={{
                color: '#595959',
                fontWeight: '700',
              }}>Terms and Conditions</Typography>
            </HoverLink>
            {' '}
            <Typography variant='body2' component="span"> of Bag Chatter's </Typography>
            {' '}
            <HoverLink to={"/dashboard"} underlineColor='#595959' alwaysUnderline>
              <Typography variant='body2' component="span" sx={{
                color: '#595959',
                fontWeight: '700',
              }}>Privacy Policy.</Typography>
            </HoverLink>
          </Box>
        </Box>
      </Box>

    </>
  );
};

export default AuthRegisterForm;