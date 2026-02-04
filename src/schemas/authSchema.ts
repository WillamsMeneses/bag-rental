import { z } from 'zod';

// Schema para autenticación (solo email)
export const authSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .pipe(z.string().email('Invalid email address')),
});

// Schema para login (solo password)
export const loginSchema = z.object({
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(20, 'Password must be less than 20 characters'),
});

// Schema para register (solo password)
export const registerSchema = z.object({
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(20, 'Password must be less than 20 characters'),
});

// Tipos automáticos
export type AuthFormData = z.infer<typeof authSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;