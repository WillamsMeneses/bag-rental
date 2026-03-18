import { useCreateListingStore } from "@/stores/createListingStore";
import type { BagListing } from "@/types/listing.types";
import { Box, CircularProgress, Container, IconButton, LinearProgress, Typography } from "@mui/material";
import { useState } from "react";
import { useParams } from "react-router-dom";
import ListingSuccessPage from "./ListingSuccessPage";
import ListingDetailsStep from "@/components/sections/listing/ListingDetailsStep";
import ClubQuantitiesStep from "@/components/sections/listing/ClubQuantitiesStep";
import DriverDetailsStep from "@/components/sections/listing/DriverDetailsStep";
import WoodDetailsStep from "@/components/sections/listing/WoodDetailsStep";
import { HybridDetailsStep, IronDetailsStep, PutterDetailsStep, WedgeDetailsStep } from "@/components/sections/listing/OtherDetailSteps";
import OverviewStep from "@/components/sections/listing/OverviewStep";
import { useListingWizard } from "@/hooks/useListingWizard";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const STEP_TITLES_CREATE: Record<string, string> = {
  'listing-details': 'New Listing',
  'club-quantities': 'Select Clubs',
  'driver-details': 'Driver Info',
  'wood-details': 'Wood Info',
  'hybrid-details': 'Hybrid Info',
  'iron-details': 'Iron Info',
  'wedge-details': 'Wedge Info',
  'putter-details': 'Putter Info',
  'overview': 'Review',
};

const STEP_TITLES_EDIT: Record<string, string> = {
  ...STEP_TITLES_CREATE,
  'listing-details': 'Edit Listing',
};

interface Props {
  mode: 'create' | 'edit';
}

export const ListingWizardPage: React.FC<Props> = ({ mode }) => {
  const { id } = useParams<{ id: string }>();
  const isEdit = mode === 'edit';
  const [resultListing, setResultListing] = useState<BagListing | null>(null);

  const {
    // fetch state — viene del hook
    isReady,
    fetchError,
    photoUrls,
    setPhotoUrls,
    // wizard state
    currentStep, quantities, stepOrder, currentIndex,
    isSubmitting, goBack, goToStep,
    saveListingDetails, saveQuantities, saveDrivers,
    saveWood, saveHybrid, saveIrons, saveWedges, savePutters,
    setQuantities, handleSubmit,
  } = useListingWizard({ editId: isEdit ? id : undefined });

  const store = useCreateListingStore();
  const stepTitles = isEdit ? STEP_TITLES_EDIT : STEP_TITLES_CREATE;
  const progress = stepOrder.length > 1
    ? Math.round((currentIndex / (stepOrder.length - 1)) * 100)
    : 0;

  const onConfirm = async () => {
    const result = await handleSubmit();
    if (result) setResultListing(result);
  };

  if (fetchError) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          Could not load the listing. Please try again.
        </Typography>
      </Box>
    );
  }

  if (!isReady) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (resultListing) {
    return <ListingSuccessPage listing={resultListing} isEdit={isEdit} />;
  }

  const renderStep = () => {
    switch (currentStep) {
      case 'listing-details':
        return <ListingDetailsStep onNext={(data) => saveListingDetails(data as Parameters<typeof saveListingDetails>[0])} onPhotosChange={setPhotoUrls} initialPhotos={photoUrls} />;
      case 'club-quantities':
        return <ClubQuantitiesStep quantities={quantities} onQuantityChange={(key, value) => setQuantities({ [key]: value })} onContinue={saveQuantities} />;
      case 'driver-details':
        return <DriverDetailsStep count={quantities.driver} initialDrivers={store.drivers} onSave={saveDrivers} />;
      case 'wood-details':
        return <WoodDetailsStep quantity={quantities.wood} initial={store.wood} onSave={saveWood} />;
      case 'hybrid-details':
        return <HybridDetailsStep quantity={quantities.hybrid_rescue} initial={store.hybrid} onSave={saveHybrid} />;
      case 'iron-details':
        return <IronDetailsStep quantity={quantities.iron} initial={store.irons} onSave={saveIrons} />;
      case 'wedge-details':
        return <WedgeDetailsStep quantity={quantities.wedge} initial={store.wedges} onSave={saveWedges} />;
      case 'putter-details':
        return <PutterDetailsStep count={quantities.putter} initialPutters={store.putters} onSave={savePutters} />;
      case 'overview':
        return <OverviewStep store={store} photoUrls={photoUrls} onGoToStep={goToStep} onConfirm={onConfirm} isSubmitting={isSubmitting} isEdit={isEdit} />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Box sx={{ position: 'sticky', top: 0, zIndex: 100, bgcolor: 'background.paper', borderBottom: '0.5px solid', borderColor: 'grey.200' }}>
        <Container maxWidth="md">
          <Box sx={{ display: 'flex', alignItems: 'center', py: 1.5 }}>
            <IconButton onClick={goBack} size="small" sx={{ mr: 1.5, '&:hover': { background: 'transparent' } }} disableRipple>
              <ArrowBackIcon sx={{ color: 'text.primary' }} />
            </IconButton>
            <Typography variant="h4" sx={{ fontWeight: 500, flex: 1 }}>
              {stepTitles[currentStep] ?? ''}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {currentIndex + 1} / {stepOrder.length}
            </Typography>
          </Box>
        </Container>
        <LinearProgress variant="determinate" value={progress} sx={{ height: 2, bgcolor: 'grey.100', '& .MuiLinearProgress-bar': { bgcolor: 'primary.main' } }} />
      </Box>
      <Container maxWidth={currentStep === 'listing-details' ? 'md' : 'sm'}>
        <Box sx={{ py: 4 }}>{renderStep()}</Box>
      </Container>
    </Box>
  );
};