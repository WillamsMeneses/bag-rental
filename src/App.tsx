import { ThemeProvider } from '@mui/material/styles';
import { Button, Stack } from '@mui/material';
import theme from './theme/theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <div style={{ padding: '40px' }}>
        <Stack spacing={2} direction="row">
          <Button variant="contained" color="primary">Primary Button</Button>
          <Button variant="outlined" color="secondary">Secondary Button</Button>
        </Stack>
      </div>
    </ThemeProvider>
  );
}

export default App;