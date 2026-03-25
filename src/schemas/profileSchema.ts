import { z } from 'zod';

export const profileSchema = z.object({
  firstName: z.string().max(100).optional(),
  lastName: z.string().max(100).optional(),
  birthday: z.string().optional(),
  phone: z.string().max(30).optional(),
  country: z.string().max(100).optional(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;