import { useNavigate } from 'react-router-dom';
import { useToastStore } from '@/stores/toastStore';
import { listingService } from '@/services/listing.service';
import {
  useCreateListingStore,
  type WizardStep,
  type DriverClubForm,
  type WoodClubForm,
  type HybridClubForm,
  type IronClubForm,
  type WedgeClubForm,
  type PutterClubForm,
  type ListingWizardState,
} from '@/stores/createListingStore';
import { useState } from 'react';
import type { CreateListingDto, BagListing, ClubFlex, ShaftType, ClubCategory } from '@/types/listing.types';

// ─── Helper: ordered steps based on quantities ────────────────────────────────

export const buildStepOrder = (quantities: {
  driver: number;
  wood: number;
  hybrid_rescue: number;
  iron: number;
  wedge: number;
  putter: number;
}): WizardStep[] => {
  const steps: WizardStep[] = ['club-quantities'];  // ← 1. Cantidades primero

  // 2. Steps dinámicos según cantidades
  if (quantities.driver > 0) steps.push('driver-details');
  if (quantities.wood > 0) steps.push('wood-details');
  if (quantities.hybrid_rescue > 0) steps.push('hybrid-details');
  if (quantities.iron > 0) steps.push('iron-details');
  if (quantities.wedge > 0) steps.push('wedge-details');
  if (quantities.putter > 0) steps.push('putter-details');

  // 3. Listing details después de los detalles de palos
  steps.push('listing-details');

  // 4. Overview al final
  steps.push('overview');

  return steps;
};

// ─── Helper: build CreateListingDto from store state ─────────────────────────

const buildCreateListingDto = (store: ReturnType<typeof useCreateListingStore.getState>): CreateListingDto => {
  const { listingDetails, quantities, drivers, wood, hybrid, irons, wedges, putters } = store;
  const clubs: CreateListingDto['clubs'] = [];

  // Drivers
  drivers.forEach((d) => {
    clubs.push({
      category: 'driver' as ClubCategory,
      brand: d.brand,
      model: d.model,
      flex: d.flex as ClubFlex,
      loft: Number(d.loft),
    });
  });

  // Wood
  if (wood && quantities.wood > 0) {
    wood.woodEntries.forEach((entry) => {
      clubs.push({
        category: 'wood' as ClubCategory,
        brand: wood.brand,
        model: wood.model,
        flex: wood.flex as ClubFlex,
        loft: Number(wood.loft),
        ...(wood.shaftType && { shaftType: wood.shaftType as ShaftType }),
        woodDetail: {
          woodType: entry.woodType,
          quantity: entry.quantity,
        },
      });
    });
  }

  // Hybrid
  if (hybrid && quantities.hybrid_rescue > 0) {
    hybrid.hybridEntries.forEach((entry) => {
      clubs.push({
        category: 'hybrid_rescue' as ClubCategory,
        brand: hybrid.brand,
        model: hybrid.model,
        flex: hybrid.flex as ClubFlex,
        loft: Number(hybrid.loft),
        ...(hybrid.shaftType && { shaftType: hybrid.shaftType as ShaftType }),
        hybridDetail: {
          hybridNumber: entry.hybridNumber,
          quantity: entry.quantity,
        },
      });
    });
  }

  // Irons
  if (irons && quantities.iron > 0) {
    irons.ironEntries.forEach((entry) => {
      clubs.push({
        category: 'iron' as ClubCategory,
        brand: irons.brand,
        model: irons.model,
        flex: irons.flex as ClubFlex,
        loft: Number(irons.loft),
        ...(irons.shaftType && { shaftType: irons.shaftType as ShaftType }),
        ironDetail: {
          ironNumber: entry.ironNumber,
          quantity: entry.quantity,
        },
      });
    });
  }

  // Wedges
  if (wedges && quantities.wedge > 0) {
    wedges.wedgeEntries.forEach((entry) => {
      clubs.push({
        category: 'wedge' as ClubCategory,
        brand: wedges.brand,
        model: wedges.model,
        flex: wedges.flex as ClubFlex,
        loft: Number(wedges.loft),
        ...(wedges.shaftType && { shaftType: wedges.shaftType as ShaftType }),
        wedgeDetail: {
          wedgeType: entry.wedgeType,
          quantity: entry.quantity,
        },
      });
    });
  }

  // Putter
  putters.forEach((p) => {
    clubs.push({
      category: 'putter' as ClubCategory,
      brand: p.brand,
      model: p.model,
      flex: p.flex as ClubFlex,
      loft: Number(p.loft),
      putterDetail: { putterType: p.putterType },
    });
  });

  return {
    title: listingDetails.title,
    description: listingDetails.description || undefined,
    pricePerDay: Number(listingDetails.pricePerDay),
    gender: listingDetails.gender as CreateListingDto['gender'],
    hand: listingDetails.hand as CreateListingDto['hand'],
    street: listingDetails.street || undefined,
    zipCode: listingDetails.zipCode || undefined,
    state: listingDetails.state || undefined,
    city: listingDetails.city || undefined,
    photos: [],
    clubs,
  };
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

interface UseCreateListingOptions {
  editId?: string; // if provided, switches to edit mode (PATCH)
}

export const useCreateListing = (options: UseCreateListingOptions = {}) => {
  const { editId } = options;
  const isEditMode = !!editId;
  const navigate = useNavigate();
  const { error, success } = useToastStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const store = useCreateListingStore();
  const {
    currentStep,
    quantities,
    setCurrentStep,
    setListingDetails,
    setQuantities,
    setDrivers,
    setWood,
    setHybrid,
    setIrons,
    setWedges,
    setPutters,
    reset,
  } = store;

  const stepOrder = buildStepOrder(quantities);
  const currentIndex = stepOrder.indexOf(currentStep);

  const goNext = () => {
    const next = stepOrder[currentIndex + 1];
    if (next) setCurrentStep(next);
  };

  const goBack = () => {
    const prev = stepOrder[currentIndex - 1];
    if (prev) setCurrentStep(prev);
    else navigate('/my-listings');
  };

  const goToStep = (step: WizardStep) => {
    setCurrentStep(step);
  };

  const handleSubmit = async (): Promise<BagListing | null> => {
    setIsSubmitting(true);
    try {
      const dto = buildCreateListingDto(useCreateListingStore.getState());
      let result: BagListing;

      if (isEditMode && editId) {
        result = await listingService.updateListing(editId, dto);
        success('Listing updated successfully!'); // ← Toast de éxito
      } else {
        result = await listingService.createListing(dto);
        success('Listing created successfully!'); // ← Toast de éxito
      }

      reset();
      return result;
    } catch {
      error(isEditMode ? 'Failed to update listing.' : 'Failed to create listing.');
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  const saveListingDetails = (data: Parameters<typeof setListingDetails>[0]) => {
    setListingDetails(data);
    goNext();
  };

  const saveQuantities = () => {
    const total = Object.values(quantities).reduce((a, b) => a + b, 0);
    if (total === 0) {
      error('Please add at least one club');
      return;
    }

    const newOrder = buildStepOrder(quantities);
    // Después de quantities, vamos al primer paso de detalles (índice 1)
    const nextStep = newOrder[1] ?? 'overview';
    setCurrentStep(nextStep);
  };

  const saveDrivers = (drivers: DriverClubForm[]) => {
    setDrivers(drivers);
    goNext();
  };

  const saveWood = (wood: WoodClubForm) => {
    setWood(wood);
    goNext();
  };

  const saveHybrid = (hybrid: HybridClubForm) => {
    setHybrid(hybrid);
    goNext();
  };

  const saveIrons = (irons: IronClubForm) => {
    setIrons(irons);
    goNext();
  };

  const saveWedges = (wedges: WedgeClubForm) => {
    setWedges(wedges);
    goNext();
  };

  const savePutters = (putters: PutterClubForm[]) => {
    setPutters(putters);
    goNext();
  };

  return {
    // State
    currentStep,
    quantities,
    stepOrder,
    currentIndex,
    isSubmitting,
    isEditMode,
    store: store as ListingWizardState,

    // Navigation
    goNext,
    goBack,
    goToStep,

    // Save actions
    saveListingDetails,
    saveQuantities,
    saveDrivers,
    saveWood,
    saveHybrid,
    saveIrons,
    saveWedges,
    savePutters,
    setQuantities,

    // Submit
    handleSubmit,
  };
};