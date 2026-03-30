import { useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  Avatar,
  IconButton,
  TextField,
  Button,
  Divider,
  CircularProgress,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import 'react-international-phone/style.css';
import PageHeader from '@/components/ui/PageHeader';
import { LoadingState } from '@/components/ui/LoadingState';
import { useProfile } from '@/hooks/useProfile';
import { profileSchema, type ProfileFormData } from '@/schemas/profileSchema';
import { PhoneInputField } from '@/components/sections/profile/PhoneInputField';

import { useImageUpload } from '@/hooks/useImageUpload';
import { useAuthStore } from '@/stores/authStore';
import { useStripeOnboarding } from '@/hooks/useStripeOnboarding';

const FieldLabel = ({ children }: { children: React.ReactNode }) => (
  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
    {children}
  </Typography>
);

export default function MyProfilePage() {
  const { profile, loading, saving, updateProfile } = useProfile();
  const { isAuthenticated } = useAuthStore();
  const { isConnected, isLoading, isCheckingStatus, handleConnectStripe } = useStripeOnboarding();
  const { fileInputRef, uploading: uploadingAvatar, handleClick: handleAvatarClick, handleChange: handleAvatarChange, previewUrl: avatarPreview, flush: flushAvatar } =
    useImageUpload({ mode: 'pending' });

  const { control, handleSubmit, reset } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      birthday: '',
      phone: '',
      country: '',
    },
  });

  useEffect(() => {
    if (profile) {
      reset({
        firstName: profile.firstName ?? '',
        lastName: profile.lastName ?? '',
        birthday: profile.birthday ?? '',
        phone: profile.phone ?? '',
        country: profile.country ?? '',
      });
    }
  }, [profile, reset]);

  const onSubmit = async (data: ProfileFormData) => {
    const avatarUrl = await flushAvatar();
    await updateProfile({ ...data, ...(avatarUrl ? { avatarUrl } : {}) });
  };

  if (loading) return <LoadingState message="Loading profile..." />;

  return (
    <Box>
      <PageHeader title="My Profile" />

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={6} sx={{ position: 'relative' }}>
          {/* ── Left column ─────────────────────────────────────── */}
          <Grid size={{ xs: 12, md: 6 }}>
            {/* Avatar */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
              <Box sx={{ position: 'relative' }}>
                <Avatar
                  src={avatarPreview ?? profile?.avatarUrl ?? undefined}
                  sx={{ width: 120, height: 120, opacity: uploadingAvatar ? 0.5 : 1 }}
                />
                <IconButton
                  size="small"
                  onClick={handleAvatarClick}
                  disabled={uploadingAvatar}
                  sx={{
                    position: 'absolute',
                    bottom: 4,
                    right: 4,
                    backgroundColor: 'success.main',
                    color: 'white',
                    width: 32,
                    height: 32,
                    '&:hover': { backgroundColor: 'success.dark' },
                  }}
                >
                  {uploadingAvatar
                    ? <CircularProgress size={14} sx={{ color: 'white' }} />
                    : <EditIcon sx={{ fontSize: 16 }} />
                  }
                </IconButton>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleAvatarChange}
                />
              </Box>
            </Box>

            {/* Personal Information */}
            <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
              Personal Information
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <FieldLabel>First Name</FieldLabel>
                <Controller
                  name="firstName"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} fullWidth size="small" />
                  )}
                />
              </Box>

              <Box>
                <FieldLabel>Last Name</FieldLabel>
                <Controller
                  name="lastName"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} fullWidth size="small" />
                  )}
                />
              </Box>

              <Box>
                <FieldLabel>Birthday</FieldLabel>
                <Controller
                  name="birthday"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      size="small"
                      type="date"
                      slotProps={{ inputLabel: { shrink: true } }}
                    />
                  )}
                />
              </Box>

              <Box>
                <FieldLabel>Location</FieldLabel>
                <Controller
                  name="country"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} fullWidth size="small" placeholder="e.g. Los Angeles, CA" />
                  )}
                />
              </Box>
              {isAuthenticated && !isCheckingStatus && (
                <Button
                  variant={isConnected ? 'contained' : 'contained'}
                  color={isConnected ? 'success' : 'primary'}
                  onClick={isConnected ? undefined : handleConnectStripe}
                  disabled={isLoading || isConnected}
                  sx={{ py: 1, px: 2 }}
                >
                  {isLoading ? 'Redirecting to Stripe...' : isConnected ? '✓ Stripe Connected' : 'Connect with Stripe'}
                </Button>
              )}
            </Box>
          </Grid>

          {/* ── Right column ─────────────────────────────────────── */}
          <Grid size={{ xs: 12, md: 6 }}>
            {/* Contact Information */}
            <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
              Contact Information
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4 }}>
              <Box>
                <FieldLabel>Phone number*</FieldLabel>
                <Controller
                  name="phone"
                  control={control}
                  render={({ field }) => (
                    <PhoneInputField
                      value={field.value ?? ''}
                      onChange={field.onChange}
                    />
                  )}
                />
              </Box>

              <Box>
                <FieldLabel>Email</FieldLabel>
                <TextField
                  value={profile?.email ?? ''}
                  fullWidth
                  size="small"
                  disabled
                  sx={{ '& .MuiInputBase-input.Mui-disabled': { color: 'text.primary', WebkitTextFillColor: 'unset' } }}
                />
              </Box>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* Password */}
            <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
              Password
            </Typography>

            <Box>
              <TextField
                value="••••••••"
                fullWidth
                size="small"
                disabled
                type="password"
              />
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{ borderRadius: 2, textTransform: 'none' }}
                >
                  Reset Password
                </Button>
              </Box>
            </Box>
          </Grid>
          {/* ── Divider vertical — centrado entre columnas ── */}
          <Box
            sx={{
              display: { xs: 'none', md: 'block' },
              position: 'absolute',
              left: '50%',
              top: 0,
              bottom: 0,
              width: '1px',
              backgroundColor: 'divider',
            }}
          />
        </Grid>

        {/* Save */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 5 }}>
          <Button
            type="submit"
            variant="contained"
            color="success"
            disabled={saving || uploadingAvatar}
            sx={{ px: 4, py: 1.5, borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
          >
            {saving || uploadingAvatar ? 'Saving...' : 'Save changes'}
          </Button>
        </Box>
      </form>
    </Box>
  );
}