export interface UserProfile {
  id: string;
  email: string;
  authProvider: string;
  firstName: string | null;
  lastName: string | null;
  birthday: string | null;
  phone: string | null;
  country: string | null;
  avatarUrl: string | null;
  stripeAccountId: string | null;
  emailVerified: boolean;
  createdAt: string;
}

export interface UpdateProfileDto {
  firstName?: string;
  lastName?: string;
  birthday?: string;
  phone?: string;
  country?: string;
  avatarUrl?: string;
}