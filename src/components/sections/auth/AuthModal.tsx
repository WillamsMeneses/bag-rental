import { GenericDialog } from '@/components/ui/GenericDialog';
import { Box, Button, Typography } from '@mui/material';
import AuthTitleModal from './AuthTitleModal';
import ArrowRightIcon from '@/components/icons/ArrowRightIcon';
import { useAuth } from '@/hooks/useAuth';
import AuthEmailForm from './AuthEmailForm';
import AuthLoginForm from './AuthLoginForm';
import AuthRegisterForm from './AuthRegisterForm';
import HoverLink from '@/components/ui/HoverLink';
import { useAuthModal } from '@/hooks/useAuthModal';

const AuthModal = () => {
  const { open, closeModal } = useAuthModal();
  const { currentStep, isLoading, resetAuth } = useAuth();

  const handleClose = () => {
    console.log('🔒 AuthModal handleClose called');
    closeModal();
    setTimeout(() => resetAuth(), 300);
  };


  // Determinar qué formulario mostrar
  const renderForm = () => {
    switch (currentStep) {
      case 'email':
        return <AuthEmailForm />;
      case 'login':
        return <AuthLoginForm onSuccess={handleClose} />;
      case 'register':
        return <AuthRegisterForm onSuccess={handleClose} />;
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
        return 'Create password';
      default:
        return 'Continue';
    }
  };

  return (
    <>
      <GenericDialog
        open={open}
        onClose={handleClose}
        title={<AuthTitleModal />}
        showCloseButton
        maxWidth="xs"
        actions={
          <Box sx={{ display: 'flex', width: '100%', flexDirection: 'column', gap: '24px' }}>

            <Button
              type="submit"
              form="auth-form"
              variant="contained"
              color="primary"
              disabled={isLoading}
              sx={{ flex: 1 }}
            >
              {getButtonText()}
              <Box sx={{ mt: '5px', ml: '5px' }}>
                <ArrowRightIcon />
              </Box>
            </Button>

            {currentStep == 'login' && (
              <>
                < Box sx={{
                  display: 'block',
                }}>
                  <Typography variant='body2' component="span">I have read and accepted the</Typography>
                  {' '}
                  <HoverLink to={"/dashboard"} underlineColor='#595959' alwaysUnderline>
                    <Typography variant='body2' component="span" sx={{
                      color: '#595959',
                      fontWeight: '700',
                    }}>Terms and Conditions</Typography>
                  </HoverLink>
                  {' '}
                  <Typography variant='body2' component="span"> of <br></br> Bag Chatter's </Typography>
                  {' '}
                  <HoverLink to={"/dashboard"} underlineColor='#595959' alwaysUnderline>
                    <Typography variant='body2' component="span" sx={{
                      color: '#595959',
                      fontWeight: '700',
                    }}>Privacy Policy.</Typography>
                  </HoverLink>
                </Box>
                <Box sx={{
                  mb: '16px'
                }}>
                  <HoverLink to={"/dashboard"} underlineColor='transparent' alwaysUnderline={false}>
                    <Typography variant='body1' sx={{
                      color: '#6A9D50',
                      fontWeight: '600',
                    }}>Forgot your password?</Typography>
                  </HoverLink>
                </Box>

              </>
            )}

          </Box >
        }
      >
        {renderForm()}
      </GenericDialog >
    </>
  );
};

export default AuthModal;