import { z } from 'zod';

export const FLEX_OPTIONS = ['ladies', 'senior', 'regular', 'stiff', 'x_stiff', 'xx_stiff'] as const;
export const SHAFT_OPTIONS = ['steel', 'graphite'] as const;

// ─── Listing Details ──────────────────────────────────────────────────────────

//TODO: ver errores con el enums
export const listingDetailsSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title too long'),
  description: z.string().optional(),
  pricePerDay: z
    .string()
    .min(1, 'Price is required')
    .refine((v) => !isNaN(Number(v)) && Number(v) > 0, 'Price must be greater than 0'),
  gender: z.enum(['male', 'female'], { required_error: 'Gender is required' }),
  hand: z.enum(['left_handed', 'right_handed'], { required_error: 'Hand preference is required' }),
  street: z.string().optional(),
  zipCode: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
});

export type ListingDetailsFormData = z.infer<typeof listingDetailsSchema>;

// ─── Base club fields ─────────────────────────────────────────────────────────

const baseClubSchema = z.object({
  brand: z.string().min(1, 'Brand is required').max(100),
  model: z.string().min(1, 'Model is required').max(100),
  flex: z.enum(FLEX_OPTIONS, { required_error: 'Flex is required' }),
  loft: z
    .string()
    .min(1, 'Loft is required')
    .refine((v) => !isNaN(Number(v)) && Number(v) >= 0, 'Invalid loft value'),
});

// ─── Driver schemas ───────────────────────────────────────────────────────────

export const driverClubSchema = baseClubSchema;
export type DriverClubFormData = z.infer<typeof driverClubSchema>;

// ─── Wood schemas ─────────────────────────────────────────────────────────────

export const woodClubSchema = baseClubSchema.extend({
  shaftType: z.enum(SHAFT_OPTIONS).optional(),
});
export type WoodClubFormData = z.infer<typeof woodClubSchema>;

// ─── Hybrid schemas ───────────────────────────────────────────────────────────

export const hybridClubSchema = baseClubSchema.extend({
  shaftType: z.enum(SHAFT_OPTIONS).optional(),
});
export type HybridClubFormData = z.infer<typeof hybridClubSchema>;

// ─── Iron schemas ─────────────────────────────────────────────────────────────

export const ironClubSchema = baseClubSchema.extend({
  shaftType: z.enum(SHAFT_OPTIONS).optional(),
});
export type IronClubFormData = z.infer<typeof ironClubSchema>;

// ─── Wedge schemas ────────────────────────────────────────────────────────────

export const wedgeClubSchema = baseClubSchema.extend({
  shaftType: z.enum(SHAFT_OPTIONS).optional(),
});
export type WedgeClubFormData = z.infer<typeof wedgeClubSchema>;

// ─── Putter schemas ───────────────────────────────────────────────────────────

export const putterClubSchema = baseClubSchema.extend({
  putterType: z.string().min(1, 'Putter type is required'),
});
export type PutterClubFormData = z.infer<typeof putterClubSchema>;