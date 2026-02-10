import { createTheme } from '@mui/material/styles';
import { typographyConfig } from './typography';
import { buttonConfig } from './button';
import { textFieldConfig } from './textfield';
import { checkboxConfig } from './checkbox';
import { paletteConfig } from './palette';
import { chipConfig } from './chip';

const theme = createTheme({
  palette: paletteConfig,
  typography: typographyConfig,
  
  components: {
    MuiButton: buttonConfig,
    MuiTextField: textFieldConfig,
    MuiCheckbox: checkboxConfig,
    MuiChip: chipConfig,
  },
});

export default theme;