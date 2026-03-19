import { create } from 'zustand';
import type { ClubFlex, ShaftType } from '@/types/listing.types';

// ─── Club detail types ──────────────────────────────────────────────────────

export interface WoodDetailEntry {
  woodType: string; // e.g. "3", "5", "9", "Other"
  quantity: number;
}

export interface HybridDetailEntry {
  hybridNumber: string; // e.g. "3", "4", "5"
  quantity: number;
}

export interface IronDetailEntry {
  ironNumber: string; // e.g. "3", "4", "5", "6", "7", "8", "9", "PW"
  quantity: number;
}

export interface WedgeDetailEntry {
  wedgeType: string; // e.g. "pitching", "gap", "sand", "lob"
  quantity: number;
}

export interface PutterDetailEntry {
  putterType: string; // e.g. "blade", "mallet"
}

// ─── Club forms per category ────────────────────────────────────────────────

export interface DriverClubForm {
  brand: string;
  model: string;
  flex: ClubFlex | '';
  loft: string;
}

export interface WoodClubForm {
  brand: string;
  model: string;
  flex: ClubFlex | '';
  loft: string;
  shaftType?: ShaftType | '';
  woodEntries: WoodDetailEntry[];
}

export interface HybridClubForm {
  brand: string;
  model: string;
  flex: ClubFlex | '';
  loft: string;
  shaftType?: ShaftType | '';
  hybridEntries: HybridDetailEntry[];
}

export interface IronClubForm {
  brand: string;
  model: string;
  flex: ClubFlex | '';
  loft: string;
  shaftType?: ShaftType | '';
  ironEntries: IronDetailEntry[];
}

export interface WedgeClubForm {
  brand: string;
  model: string;
  flex: ClubFlex | '';
  loft: string;
  shaftType?: ShaftType | '';
  wedgeEntries: WedgeDetailEntry[];
}

export interface PutterClubForm {
  brand: string;
  model: string;
  putterTypes: string[];
}

// ─── Listing details ─────────────────────────────────────────────────────────

export interface ListingDetailsForm {
  title: string;
  description: string;
  pricePerDay: string;
  gender: 'male' | 'female' | '';
  hand: 'left_handed' | 'right_handed' | '';
  street: string;
  zipCode: string;
  state: string;
  city: string;
}

// ─── Quantities ──────────────────────────────────────────────────────────────

export interface ClubQuantities {
  driver: number;
  wood: number;
  hybrid_rescue: number;
  iron: number;
  wedge: number;
  putter: number;
}

// ─── Store state ─────────────────────────────────────────────────────────────

export type WizardStep =
  | 'listing-details'
  | 'club-quantities'
  | 'driver-details'
  | 'wood-details'
  | 'hybrid-details'
  | 'iron-details'
  | 'wedge-details'
  | 'putter-details'
  | 'overview';

interface CreateListingState {
  currentStep: WizardStep;

  // Step 0 – listing details
  listingDetails: ListingDetailsForm;

  // Step 1 – club quantities
  quantities: ClubQuantities;

  // Step 2+ – club forms
  drivers: DriverClubForm[];
  wood: WoodClubForm | null;
  hybrid: HybridClubForm | null;
  irons: IronClubForm | null;
  wedges: WedgeClubForm | null;
  putters: PutterClubForm[];

  // Actions
  setCurrentStep: (step: WizardStep) => void;
  setListingDetails: (details: Partial<ListingDetailsForm>) => void;
  setQuantities: (quantities: Partial<ClubQuantities>) => void;
  setDrivers: (drivers: DriverClubForm[]) => void;
  setWood: (wood: WoodClubForm | null) => void;
  setHybrid: (hybrid: HybridClubForm | null) => void;
  setIrons: (irons: IronClubForm | null) => void;
  setWedges: (wedges: WedgeClubForm | null) => void;
  setPutters: (putters: PutterClubForm[]) => void;
  reset: () => void;
}

// Export the state shape (without actions) for use as a prop type
export type ListingWizardState = Pick<
  CreateListingState,
  | 'listingDetails'
  | 'quantities'
  | 'drivers'
  | 'wood'
  | 'hybrid'
  | 'irons'
  | 'wedges'
  | 'putters'
>;

// ─── Initial state ────────────────────────────────────────────────────────────

const initialState = {
  currentStep: 'club-quantities' as WizardStep,
  listingDetails: {
    title: '',
    description: '',
    pricePerDay: '',
    gender: '' as const,
    hand: '' as const,
    street: '',
    zipCode: '',
    state: '',
    city: '',
  },
  quantities: {
    driver: 0,
    wood: 0,
    hybrid_rescue: 0,
    iron: 0,
    wedge: 0,
    putter: 0,
  },
  drivers: [] as DriverClubForm[],
  wood: null,
  hybrid: null,
  irons: null,
  wedges: null,
  // putter: null,
  putters: [] as PutterClubForm[],
};

export const useCreateListingStore = create<CreateListingState>((set) => ({
  ...initialState,

  setCurrentStep: (step) => set({ currentStep: step }),
  setListingDetails: (details) =>
    set((state) => ({
      listingDetails: { ...state.listingDetails, ...details },
    })),
  setQuantities: (quantities) =>
    set((state) => ({
      quantities: { ...state.quantities, ...quantities },
    })),
  setDrivers: (drivers) => set({ drivers }),
  setWood: (wood) => set({ wood }),
  setHybrid: (hybrid) => set({ hybrid }),
  setIrons: (irons) => set({ irons }),
  setWedges: (wedges) => set({ wedges }),
  setPutters: (putters) => set({ putters }),
  reset: () => set(initialState),
}));

// ─── Helper: populate store from an existing BagListing (for edit mode) ───────
// Import BagListing type here to avoid circular deps — we keep it inline

export const populateStoreFromListing = (
  listing: import('@/types/listing.types').BagListing
) => {
  const store = useCreateListingStore.getState();

  // 1. Listing details
  store.setListingDetails({
    title: listing.title,
    description: listing.description ?? '',
    pricePerDay: String(listing.pricePerDay),
    gender: (listing.gender as 'male' | 'female') ?? '',
    hand: (listing.hand as 'left_handed' | 'right_handed') ?? '',
    street: listing.street ?? '',
    zipCode: listing.zipCode ?? '',
    state: listing.state ?? '',
    city: listing.city ?? '',
  });

  // 2. Quantities — count clubs per category
  const clubs = listing.clubs ?? [];
  const qty: ClubQuantities = {
    driver: 0, wood: 0, hybrid_rescue: 0, iron: 0, wedge: 0, putter: 0,
  };

  const drivers: DriverClubForm[] = [];
  let woodForm: WoodClubForm | null = null;
  let hybridForm: HybridClubForm | null = null;
  let ironForm: IronClubForm | null = null;
  let wedgeForm: WedgeClubForm | null = null;
  const putters: PutterClubForm[] = [];

  for (const club of clubs) {
    const base = {
      brand: club.brand,
      model: club.model,
      flex: club.flex as ClubFlex | '',
      loft: String(club.loft),
    };

    switch (club.category) {
      case 'driver':
        qty.driver++;
        drivers.push(base);
        break;

      case 'wood':
        qty.wood++;
        if (!woodForm) {
          woodForm = {
            ...base,
            shaftType: (club.shaftType as ShaftType | '') ?? '',
            woodEntries: [],
          };
        }
        if (club.woodDetail) {
          woodForm.woodEntries.push({
            woodType: club.woodDetail.woodType,
            quantity: club.woodDetail.quantity ?? 1,
          });
        }
        break;

      case 'hybrid_rescue':
        qty.hybrid_rescue++;
        if (!hybridForm) {
          hybridForm = {
            ...base,
            shaftType: (club.shaftType as ShaftType | '') ?? '',
            hybridEntries: [],
          };
        }
        if (club.hybridDetail) {
          hybridForm.hybridEntries.push({
            hybridNumber: club.hybridDetail.hybridNumber,
            quantity: club.hybridDetail.quantity ?? 1,
          });
        }
        break;

      case 'iron':
        qty.iron++;
        if (!ironForm) {
          ironForm = {
            ...base,
            shaftType: (club.shaftType as ShaftType | '') ?? '',
            ironEntries: [],
          };
        }
        if (club.ironDetail) {
          ironForm.ironEntries.push({
            ironNumber: club.ironDetail.ironNumber,
            quantity: club.ironDetail.quantity ?? 1,
          });
        }
        break;

      case 'wedge':
        qty.wedge++;
        if (!wedgeForm) {
          wedgeForm = {
            ...base,
            shaftType: (club.shaftType as ShaftType | '') ?? '',
            wedgeEntries: [],
          };
        }
        if (club.wedgeDetail) {
          wedgeForm.wedgeEntries.push({
            wedgeType: club.wedgeDetail.wedgeType,
            quantity: club.wedgeDetail.quantity ?? 1,
          });
        }
        break;

      case 'putter':
        qty.putter++;
        putters.push({
          brand: club.brand,
          model: club.model,
          putterTypes: club.putterDetail?.putterTypes ?? [],
        });
        break;
    }
  }

  // 3. Set everything
  store.setQuantities(qty);
  store.setDrivers(drivers);
  store.setWood(woodForm);
  store.setHybrid(hybridForm);
  store.setIrons(ironForm);
  store.setWedges(wedgeForm);
  store.setPutters(putters);
};