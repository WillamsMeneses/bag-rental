import React, { useState } from 'react';
import { Box, Container, IconButton, LinearProgress, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useCreateListing } from '@/hooks/useCreateListing';
import { useCreateListingStore } from '@/stores/createListingStore';
import ListingSuccessPage from '@/pages/ListingSuccessPage';
import type { BagListing } from '@/types/listing.types';
import ListingDetailsStep from '@/components/sections/listing/ListingDetailsStep';
import ClubQuantitiesStep from '@/components/sections/listing/ClubQuantitiesStep';
import DriverDetailsStep from '@/components/sections/listing/DriverDetailsStep';
import WoodDetailsStep from '@/components/sections/listing/WoodDetailsStep';
import { HybridDetailsStep, IronDetailsStep, PutterDetailsStep, WedgeDetailsStep } from '@/components/sections/listing/OtherDetailSteps';
import OverviewStep from '@/components/sections/listing/OverviewStep';

const STEP_TITLES: Record<string, string> = {
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

export const CreateListingPage: React.FC = () => {
  const store = useCreateListingStore();

  // photoUrls live here (not in Zustand) since they're blob URLs, only needed for this session
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);

  // Success state — shown after successful API call
  const [createdListing, setCreatedListing] = useState<BagListing | null>(null);

  const {
    currentStep,
    quantities,
    stepOrder,
    currentIndex,
    isSubmitting,
    goBack,
    goToStep,
    saveListingDetails,
    saveQuantities,
    saveDrivers,
    saveWood,
    saveHybrid,
    saveIrons,
    saveWedges,
    savePutters,
    setQuantities,
    handleSubmit,
  } = useCreateListing();

  const progress = stepOrder.length > 1
    ? Math.round((currentIndex / (stepOrder.length - 1)) * 100)
    : 0;

  // Override handleSubmit to capture the created listing
  const onConfirm = async () => {
    const created = await handleSubmit();
    if (created) {
      setCreatedListing(created);
    }
  };

  // Show success page
  if (createdListing) {
    return <ListingSuccessPage listing={createdListing} />;
  }

  const renderStep = () => {
    switch (currentStep) {
      case 'listing-details':
        return (
          <ListingDetailsStep
            onNext={(data) => saveListingDetails(data as Parameters<typeof saveListingDetails>[0])}
            onPhotosChange={setPhotoUrls}
            initialPhotos={photoUrls}
          />
        );

      case 'club-quantities':
        return (
          <ClubQuantitiesStep
            quantities={quantities}
            onQuantityChange={(key, value) => setQuantities({ [key]: value })}
            onContinue={saveQuantities}
          />
        );

      case 'driver-details':
        return (
          <DriverDetailsStep
            count={quantities.driver}
            initialDrivers={store.drivers}
            onSave={saveDrivers}
          />
        );

      case 'wood-details':
        return (
          <WoodDetailsStep
            quantity={quantities.wood}
            initial={store.wood}
            onSave={saveWood}
          />
        );

      case 'hybrid-details':
        return (
          <HybridDetailsStep
            quantity={quantities.hybrid_rescue}
            initial={store.hybrid}
            onSave={saveHybrid}
          />
        );

      case 'iron-details':
        return (
          <IronDetailsStep
            quantity={quantities.iron}
            initial={store.irons}
            onSave={saveIrons}
          />
        );

      case 'wedge-details':
        return (
          <WedgeDetailsStep
            quantity={quantities.wedge}
            initial={store.wedges}
            onSave={saveWedges}
          />
        );

      case 'putter-details':
        return (
          <PutterDetailsStep
            count={quantities.putter}
            initialPutters={store.putters}
            onSave={savePutters}
          />
        );

      case 'overview':
        return (
          <OverviewStep
            store={store}
            photoUrls={photoUrls}
            onGoToStep={goToStep}
            onConfirm={onConfirm}
            isSubmitting={isSubmitting}
          />
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Sticky header */}
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          bgcolor: 'background.paper',
          borderBottom: '0.5px solid',
          borderColor: 'grey.200',
        }}
      >
        <Container maxWidth="md">
          <Box sx={{ display: 'flex', alignItems: 'center', py: 1.5 }}>
            <IconButton
              onClick={goBack}
              size="small"
              sx={{ mr: 1.5, '&:hover': { background: 'transparent' } }}
              disableRipple
            >
              <ArrowBackIcon sx={{ color: 'text.primary' }} />
            </IconButton>
            <Typography variant="h4" sx={{ fontWeight: 500, flex: 1 }}>
              {STEP_TITLES[currentStep] ?? ''}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {currentIndex + 1} / {stepOrder.length}
            </Typography>
          </Box>
        </Container>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: 2,
            bgcolor: 'grey.100',
            '& .MuiLinearProgress-bar': { bgcolor: 'primary.main' },
          }}
        />
      </Box>

      {/* Content */}
      <Container maxWidth={currentStep === 'listing-details' ? 'md' : 'sm'}>
        <Box sx={{ py: 4 }}>
          {renderStep()}
        </Box>
      </Container>
    </Box>
  );
};

export default CreateListingPage;