import { useAuth } from '@/hooks/useAuth';
import { authSchema, type AuthFormData } from '@/schemas/authSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, Divider, TextField, Typography } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { useEffect } from 'react';
import GoogleIcon from '@assets/svg/google-icon.svg'
import FacebookIcon from '@assets/svg/facebook-icon.svg'
import { buildGoogleAuthUrl } from '@/config/oauth.config';

interface AuthEmailFormProps {
    onValidityChange?: (isValid: boolean) => void;
}

const AuthEmailForm = ({ onValidityChange }: AuthEmailFormProps) => {
    const { handleCheckEmail, isLoading } = useAuth();

    const {
        control,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<AuthFormData>({
        resolver: zodResolver(authSchema),
        mode: 'onChange',
        defaultValues: {
            email: '',
        },
    });

    const handleGoogleLogin = () => {
        const googleAuthUrl = buildGoogleAuthUrl();
        window.location.href = googleAuthUrl;
    };

    useEffect(() => {
        onValidityChange?.(isValid);
    }, [isValid, onValidityChange]);

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
                        <Typography variant="h6" sx={{ mb: '5px' }}>
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
                <Divider sx={{
                    px: '24px',
                    py: '8px'
                }}>
                    <Typography variant='caption'>Or continue with</Typography>
                </Divider>
                <Button variant='outlined' sx={{
                    color: '#595959',
                }} onClick={handleGoogleLogin}>
                    <img src={GoogleIcon} style={{
                        marginRight: '10px'
                    }}></img>
                    Continue with Google
                </Button>
                <Button variant='outlined' sx={{
                    color: '#595959'
                }}>
                    <img src={FacebookIcon} style={{
                        marginRight: '10px'
                    }}></img>
                    Continue with Facebook
                </Button>
            </Box>
        </>
    );
};

export default AuthEmailForm;