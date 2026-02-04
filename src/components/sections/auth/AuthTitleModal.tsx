import { Box } from "@mui/material";
import BackgroundAuthModal from '@assets/svg/background-auth-modal.svg'
import LogoWhite from '@assets/svg/logo-white.svg';

export default function AuthTitleModal() {
  return (
    <Box sx={{ width: '100%' }}>
      <img 
        src={BackgroundAuthModal} 
        alt="Auth Modal Background" 
        style={{ 
          width: '100%',
          display: 'block',
          borderTopLeftRadius: '4px',
          borderTopRightRadius: '4px',
          position: 'relative'
        }} 
      />
      <img src={LogoWhite} alt="Logo White" style={{ position: 'absolute', top: 64, left: 64 }} />
    </Box>
  )
}