import { ThemeProvider } from '@mui/material/styles';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import theme from './theme/theme';
import GlobalToast from './components/ui/GlobalToast';

// pages
import AuthCallbackPage from './pages/AuthCallbackPage';
import { MyListingsPage } from './pages/MyListingsPage';
import { HomePage } from './pages/HomePage';
import HomeLayout from './layouts/HomeLayout';
import DashboardLayout from './layouts/DashboardLayout';
import CssBaseline from '@mui/material/CssBaseline';
import CreateListingPage from './pages/CreateListingPage';
import EditListingPage from './pages/EditListingPage';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route element={<HomeLayout />}>
            <Route path="/" element={<HomePage />} />
          </Route>
          <Route element={<DashboardLayout />}>
            <Route path="/my-listings" element={<MyListingsPage />} />
          </Route>
           <Route element={<DashboardLayout />}>
            <Route path="/create-listing" element={<CreateListingPage />} />
          </Route>
           <Route element={<DashboardLayout />}>
            <Route path="/edit-listing" element={<EditListingPage />} />
          </Route>
          <Route path="/auth/callback" element={<AuthCallbackPage />} />
        </Routes>
        <GlobalToast />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;