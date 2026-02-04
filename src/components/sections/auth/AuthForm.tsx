import { useAuth } from "@/hooks/useAuth";
import { authSchema, type AuthFormData } from "@/schemas/authSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, TextField, Typography } from "@mui/material";
import { Controller, useForm } from "react-hook-form";

const AuthForm = () => {
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
      <Typography variant="h1">WELCOME!</Typography>
      <Typography variant="subtitle2">Ready to Rent or Lend Clubs?</Typography>
      <Typography variant="h5" sx={{ fontSize: '16px', fontWeight: 600 }}>
        Register or log in now, it's free.
      </Typography>
      
      <form onSubmit={handleSubmit(handleCheckEmail)}>
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

        <Button 
          type="submit" 
          variant="contained" 
          color="primary"
          disabled={isLoading}
        >
          {isLoading ? 'Checking...' : 'Continue'}
        </Button>
      </form>
    </>
  );
};

export default AuthForm;