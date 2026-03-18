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
  populateStoreFromListing,
} from '@/stores/createListingStore';
import { useState, useEffect } from 'react';
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
  const steps: WizardStep[] = ['club-quantities'];

  if (quantities.driver > 0) steps.push('driver-details');
  if (quantities.wood > 0) steps.push('wood-details');
  if (quantities.hybrid_rescue > 0) steps.push('hybrid-details');
  if (quantities.iron > 0) steps.push('iron-details');
  if (quantities.wedge > 0) steps.push('wedge-details');
  if (quantities.putter > 0) steps.push('putter-details');

  steps.push('listing-details');
  steps.push('overview');

  return steps;
};

// ─── Helper: build CreateListingDto from store state ─────────────────────────

const buildCreateListingDto = (store: ReturnType<typeof useCreateListingStore.getState>): CreateListingDto => {
  const { listingDetails, quantities, drivers, wood, hybrid, irons, wedges, putters } = store;
  const clubs: CreateListingDto['clubs'] = [];

  drivers.forEach((d) => {
    clubs.push({
      category: 'driver' as ClubCategory,
      brand: d.brand,
      model: d.model,
      flex: d.flex as ClubFlex,
      loft: Number(d.loft),
    });
  });

  if (wood && quantities.wood > 0) {
    wood.woodEntries.forEach((entry) => {
      clubs.push({
        category: 'wood' as ClubCategory,
        brand: wood.brand,
        model: wood.model,
        flex: wood.flex as ClubFlex,
        loft: Number(wood.loft),
        ...(wood.shaftType && { shaftType: wood.shaftType as ShaftType }),
        woodDetail: { woodType: entry.woodType, quantity: entry.quantity },
      });
    });
  }

  if (hybrid && quantities.hybrid_rescue > 0) {
    hybrid.hybridEntries.forEach((entry) => {
      clubs.push({
        category: 'hybrid_rescue' as ClubCategory,
        brand: hybrid.brand,
        model: hybrid.model,
        flex: hybrid.flex as ClubFlex,
        loft: Number(hybrid.loft),
        ...(hybrid.shaftType && { shaftType: hybrid.shaftType as ShaftType }),
        hybridDetail: { hybridNumber: entry.hybridNumber, quantity: entry.quantity },
      });
    });
  }

  if (irons && quantities.iron > 0) {
    irons.ironEntries.forEach((entry) => {
      clubs.push({
        category: 'iron' as ClubCategory,
        brand: irons.brand,
        model: irons.model,
        flex: irons.flex as ClubFlex,
        loft: Number(irons.loft),
        ...(irons.shaftType && { shaftType: irons.shaftType as ShaftType }),
        ironDetail: { ironNumber: entry.ironNumber, quantity: entry.quantity },
      });
    });
  }

  if (wedges && quantities.wedge > 0) {
    wedges.wedgeEntries.forEach((entry) => {
      clubs.push({
        category: 'wedge' as ClubCategory,
        brand: wedges.brand,
        model: wedges.model,
        flex: wedges.flex as ClubFlex,
        loft: Number(wedges.loft),
        ...(wedges.shaftType && { shaftType: wedges.shaftType as ShaftType }),
        wedgeDetail: { wedgeType: entry.wedgeType, quantity: entry.quantity },
      });
    });
  }

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

interface UseListingWizardOptions {
  editId?: string;
}

export const useListingWizard = (options: UseListingWizardOptions = {}) => {
  const { editId } = options;
  const isEditMode = !!editId;
  const navigate = useNavigate();
  const { error, success } = useToastStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // In edit mode, we need to fetch the listing before the wizard is usable.
  // isReady gates the wizard render — create mode starts ready, edit waits for fetch.
  const [isReady, setIsReady] = useState(!isEditMode);
  const [fetchError, setFetchError] = useState(false);
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);

  useEffect(() => {
    if (!isEditMode || !editId) return;

    useCreateListingStore.getState().reset();

    const load = async () => {
      try {
        const listing = await listingService.getListingById(editId);
        populateStoreFromListing(listing);
        setPhotoUrls(listing.photos ?? []);
        // Set step explicitly after populate so buildStepOrder reads correct quantities
        useCreateListingStore.getState().setCurrentStep('club-quantities');
        setIsReady(true);
      } catch {
        setFetchError(true);
      }
    };

    load();

    return () => { useCreateListingStore.getState().reset(); };
  }, [editId, isEditMode]);

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
        success('Listing updated successfully!');
      } else {
        result = await listingService.createListing(dto);
        success('Listing created successfully!');
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

  // const saveQuantities = () => {
  //   const total = Object.values(quantities).reduce((a, b) => a + b, 0);
  //   if (total === 0) {
  //     error('Please add at least one club');
  //     return;
  //   }
  //   const newOrder = buildStepOrder(quantities);
  //   const nextStep = newOrder[1] ?? 'overview';
  //   setCurrentStep(nextStep);
  // };
  const saveQuantities = () => {
    // Lee quantities fresh del store en el momento del click,
    // no del closure que puede estar desactualizado tras reset+populate
    const currentQuantities = useCreateListingStore.getState().quantities;

    const total = Object.values(currentQuantities).reduce((a, b) => a + b, 0);
    if (total === 0) {
      error('Please add at least one club');
      return;
    }
    const newOrder = buildStepOrder(currentQuantities);
    const nextStep = newOrder[1] ?? 'overview';
    setCurrentStep(nextStep);
  };

  const saveDrivers = (drivers: DriverClubForm[]) => { setDrivers(drivers); goNext(); };
  const saveWood = (wood: WoodClubForm) => { setWood(wood); goNext(); };
  const saveHybrid = (hybrid: HybridClubForm) => { setHybrid(hybrid); goNext(); };
  const saveIrons = (irons: IronClubForm) => { setIrons(irons); goNext(); };
  const saveWedges = (wedges: WedgeClubForm) => { setWedges(wedges); goNext(); };
  const savePutters = (putters: PutterClubForm[]) => { setPutters(putters); goNext(); };

  return {
    // State
    currentStep,
    quantities,
    stepOrder,
    currentIndex,
    isSubmitting,
    isEditMode,
    isReady,
    fetchError,
    photoUrls,
    setPhotoUrls,
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