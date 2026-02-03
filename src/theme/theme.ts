import { createTheme } from '@mui/material/styles';
import { typographyConfig } from './typography';
import { buttonConfig } from './button';

const theme = createTheme({
  typography: typographyConfig,
  
  components: {
    MuiButton: buttonConfig,
    // Aquí puedes agregar más componentes como MuiTable en el futuro
  },
});

export default theme;