import { useState, useEffect } from 'react';
import { userService } from '@/services/user.service';
import { useToastStore } from '@/stores/toastStore';
import type { UserProfile, UpdateProfileDto } from '@/types/user.types';

interface UseProfileReturn {
  profile: UserProfile | null;
  loading: boolean;
  saving: boolean;
  updateProfile: (dto: UpdateProfileDto) => Promise<void>;
}

export const useProfile = (): UseProfileReturn => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { success, error } = useToastStore();

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await userService.getProfile();
        setProfile(data);
      } catch {
        error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const updateProfile = async (dto: UpdateProfileDto) => {
    setSaving(true);
    try {
      const updated = await userService.updateProfile(dto);
      setProfile(updated);
      success('Profile updated successfully');
    } catch {
      error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return { profile, loading, saving, updateProfile };
};