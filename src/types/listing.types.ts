export const UserGender = {
  MALE: 'male',
  FEMALE: 'female',
} as const;

export const HandType = {
  LEFT_HANDED: 'left_handed',
  RIGHT_HANDED: 'right_handed',
} as const;

export const ClubCategory = {
  DRIVER: 'driver',
  WOOD: 'wood',
  HYBRID_RESCUE: 'hybrid_rescue',
  IRON: 'iron',
  WEDGE: 'wedge',
  PUTTER: 'putter',
} as const;

export const ClubFlex = {
  LADIES: 'ladies',
  SENIOR: 'senior',
  REGULAR: 'regular',
  STIFF: 'stiff',
  X_STIFF: 'x_stiff',
  XX_STIFF: 'xx_stiff',
} as const;

export const ShaftType = {
  STEEL: 'steel',
  GRAPHITE: 'graphite',
} as const;

// Define los tipos correspondientes
export type UserGender = typeof UserGender[keyof typeof UserGender];
export type HandType = typeof HandType[keyof typeof HandType];
export type ClubCategory = typeof ClubCategory[keyof typeof ClubCategory];
export type ClubFlex = typeof ClubFlex[keyof typeof ClubFlex];
export type ShaftType = typeof ShaftType[keyof typeof ShaftType];
// Detail interfaces
export interface ClubWoodDetail {
  id: string;
  clubId: string;
  woodType: string;
  quantity: number;
  createdAt: string;
}

export interface ClubHybridDetail {
  id: string;
  clubId: string;
  hybridNumber: string;
  quantity: number;
  createdAt: string;
}

export interface ClubIronDetail {
  id: string;
  clubId: string;
  ironNumber: string;
  quantity: number;
  createdAt: string;
}

export interface ClubWedgeDetail {
  id: string;
  clubId: string;
  wedgeType: string;
  quantity: number;
  createdAt: string;
}

export interface ClubPutterDetail {
  id: string;
  clubId: string;
  putterType: string;
  createdAt: string;
}

// Club interface
export interface Club {
  id: string;
  bagListingId: string;
  category: ClubCategory;
  brand: string;
  model: string;
  flex: ClubFlex;
  loft: number;
  shaftType: ShaftType | null;
  displayOrder: number | null;
  woodDetail?: ClubWoodDetail;
  hybridDetail?: ClubHybridDetail;
  ironDetail?: ClubIronDetail;
  wedgeDetail?: ClubWedgeDetail;
  putterDetail?: ClubPutterDetail;
  createdAt: string;
  updatedAt: string;
}

// Main Listing interface
export interface BagListing {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  pricePerDay: number;
  gender: UserGender;
  hand: HandType;
  street: string | null;
  zipCode: string | null;
  state: string | null;
  city: string | null;
  photos: string[];
  isActive: boolean;
  isPublished: boolean;
  clubs: Club[];
  createdAt: string;
  updatedAt: string;
}

// DTOs for creating listings
export interface CreateClubWoodDetailDto {
  woodType: string;
  quantity?: number;
}

export interface CreateClubHybridDetailDto {
  hybridNumber: string;
  quantity?: number;
}

export interface CreateClubIronDetailDto {
  ironNumber: string;
  quantity?: number;
}

export interface CreateClubWedgeDetailDto {
  wedgeType: string;
  quantity?: number;
}

export interface CreateClubPutterDetailDto {
  putterType: string;
}

export interface CreateClubDto {
  category: ClubCategory;
  brand: string;
  model: string;
  flex: ClubFlex;
  loft: number;
  shaftType?: ShaftType;
  woodDetail?: CreateClubWoodDetailDto;
  hybridDetail?: CreateClubHybridDetailDto;
  ironDetail?: CreateClubIronDetailDto;
  wedgeDetail?: CreateClubWedgeDetailDto;
  putterDetail?: CreateClubPutterDetailDto;
}

export interface CreateListingDto {
  title: string;
  description?: string;
  pricePerDay: number;
  gender: UserGender;
  hand: HandType;
  street?: string;
  zipCode?: string;
  state?: string;
  city?: string;
  photos?: string[];
  clubs: CreateClubDto[];
}

// API Response types
export interface ListingResponse {
  success: boolean;
  message: string;
  data: BagListing;
}

export interface ListingsResponse {
  success: boolean;
  message: string;
  data: BagListing[];
}

export interface ClubApiResponse {
  id: string;
  bagListingId: string;
  category: ClubCategory;
  brand: string;
  model: string;
  flex: ClubFlex;
  loft: string; // ← String (DECIMAL from DB)
  shaftType: ShaftType | null;
  displayOrder: number | null;
  createdAt: string;
  updatedAt: string;
  woodDetail?: ClubWoodDetail;
  hybridDetail?: ClubHybridDetail;
  ironDetail?: ClubIronDetail;
  wedgeDetail?: ClubWedgeDetail;
  putterDetail?: ClubPutterDetail;
}

export interface BagListingApiResponse {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  pricePerDay: string; // ← String (DECIMAL from DB)
  gender: UserGender;
  hand: HandType;
  street: string | null;
  zipCode: string | null;
  state: string | null;
  city: string | null;
  photos: string[];
  isActive: boolean;
  isPublished: boolean;
  clubs: ClubApiResponse[];
  createdAt: string;
  updatedAt: string;
}