import { ThemeProvider } from '@mui/material/styles';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import theme from './theme/theme';
import HomeNavbar from './components/ui/HomeNavbar';
import GlobalToast from './components/ui/GlobalToast';

// pages
import AuthCallbackPage from './pages/AuthCallbackPage';
import { MyListingsPage } from './pages/MyListingsPage';
import { HomePage } from './pages/HomePage';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <HomeNavbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />
          <Route path="/my-listings" element={<MyListingsPage />} />
        </Routes>
        <GlobalToast />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;