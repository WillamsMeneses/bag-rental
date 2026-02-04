import { GenericDialog } from '@/components/ui/GenericDialog';
import { Box, Button } from '@mui/material';
import { useState } from 'react';
import AuthTitleModal from './AuthTitleModal';
import ArrowRightIcon from '@/components/icons/ArrowRightIcon';
import { useAuth } from '@/hooks/useAuth';
import AuthEmailForm from './AuthEmailForm';
import AuthLoginForm from './AuthLoginForm';
import AuthRegisterForm from './AuthRegisterForm';

const AuthModal = () => {
  const [open, setOpen] = useState(false);
  const { currentStep, isLoading, resetAuth } = useAuth();

  const handleOpen = () => setOpen(true);
  
  const handleClose = () => {
    setOpen(false);
    // Resetear el estado cuando se cierra el modal
    setTimeout(() => resetAuth(), 300); // Delay para que la animación del modal termine
  };

  // Determinar qué formulario mostrar
  const renderForm = () => {
    switch (currentStep) {
      case 'email':
        return <AuthEmailForm />;
      case 'login':
        return <AuthLoginForm />;
      case 'register':
        return <AuthRegisterForm />;
      default:
        return <AuthEmailForm />;
    }
  };

  // Determinar el texto del botón
  const getButtonText = () => {
    if (isLoading) return 'Processing...';
    
    switch (currentStep) {
      case 'email':
        return 'Continue';
      case 'login':
        return 'Login';
      case 'register':
        return 'Register';
      default:
        return 'Continue';
    }
  };

  return (
    <>
      <Button variant="contained" onClick={handleOpen}>
        Iniciar Sesión
      </Button>

      <GenericDialog
        open={open}
        onClose={handleClose}
        title={<AuthTitleModal />}
        showCloseButton
        maxWidth="xs"
        actions={
          <Box sx={{ display: 'flex', width: '100%' }}>
            <Button
              type="submit"
              form="auth-form"
              variant="contained"
              color="primary"
              disabled={isLoading}
              sx={{ flex: 1 }}
            >
              {getButtonText()}
              <Box sx={{ mt: '7px', ml: '5px' }}>
                <ArrowRightIcon />
              </Box>
            </Button>
          </Box>
        }
      >
        {renderForm()}
      </GenericDialog>
    </>
  );
};

export default AuthModal;