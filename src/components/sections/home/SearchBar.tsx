import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ClickAwayListener,
  TextField,
  IconButton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchStore } from '@/stores/searchStore';
import { ClubCategory } from '@/types/listing.types';

const CA_CITIES = [
  'Los Angeles', 'San Francisco', 'San Diego', 'San Jose', 'Sacramento',
  'Fresno', 'Oakland', 'Bakersfield', 'Anaheim', 'Riverside',
  'Stockton', 'Irvine', 'Chula Vista', 'Fremont', 'Long Beach',
  'Santa Ana', 'Modesto', 'Fontana', 'Moreno Valley', 'Glendale',
  'Huntington Beach', 'Santa Clarita', 'Oxnard', 'Salinas', 'Pomona',
];

const GEAR_OPTIONS: { label: string; value: ClubCategory | null }[] = [
  { label: 'Complete Set', value: null },
  { label: 'Driver', value: ClubCategory.DRIVER },
  { label: 'Wood', value: ClubCategory.WOOD },
  { label: 'Hybrid/Rescue', value: ClubCategory.HYBRID_RESCUE },
  { label: 'Irons', value: ClubCategory.IRON },
  { label: 'Wedge', value: ClubCategory.WEDGE },
  { label: 'Putter', value: ClubCategory.PUTTER },
];

interface SearchBarProps {
  heroHeight?: number;
}

export const SearchBar = ({ heroHeight = 400 }: SearchBarProps) => {
  const { cities, gearCategories, toggleCity, toggleGearCategory, applySearch } =
    useSearchStore();

  const [cityInput, setCityInput] = useState('');
  const [citySuggestions, setCitySuggestions] = useState<string[]>(CA_CITIES);
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);
  const [showGearOptions, setShowGearOptions] = useState(false);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsSticky(window.scrollY > heroHeight - 80);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [heroHeight]);

  const handleCityChange = (value: string) => {
    setCityInput(value);
    const filtered = value.trim()
      ? CA_CITIES.filter((c) => c.toLowerCase().startsWith(value.toLowerCase()))
      : CA_CITIES;
    setCitySuggestions(filtered);
    setShowCitySuggestions(true);
  };

  const cityPlaceholder = cities.length > 0 ? cities.join(', ') : 'Enter City';
  const gearPlaceholder =
    gearCategories.length > 0
      ? gearCategories.map((g) => GEAR_OPTIONS.find((o) => o.value === g)?.label ?? '').join(', ')
      : 'Browse Gear';

  const handleSearch = () => {
    setShowCitySuggestions(false);
    setShowGearOptions(false);
    applySearch();
  };

  // ─── Figma sticky: 561px, hero: 860px ─────────────────────────────────────
  // position va con CSS, framer solo anima width
  return (
    <>
      {isSticky && <Box sx={{ height: 72 }} />}

      {/* ── CSS position — no animable con framer ── */}
      <Box
        sx={{
          position: isSticky ? 'fixed' : 'relative',
          top: 0,
          left: 0,
          right: 0,
          zIndex: isSticky ? 1100 : 1,
          display: 'flex',
          justifyContent: 'center',
          py: isSticky ? 1.5 : 0,
          bgcolor: isSticky ? 'background.paper' : 'transparent',
          boxShadow: isSticky ? '0 1px 8px rgba(0,0,0,0.06)' : 'none',
          transition: 'background-color 0.3s ease, box-shadow 0.3s ease, padding 0.3s ease',
        }}
      >
        {/* ── framer anima solo el width ── */}
        <motion.div
          animate={{ width: isSticky ? 561 : 860 }}
          transition={{ type: 'spring', stiffness: 280, damping: 28 }}
          style={{ overflow: 'visible' }}
        >
          <Paper
            elevation={2}
            sx={{
              display: 'flex',
              alignItems: 'stretch',
              borderRadius: '16px',
              overflow: 'visible',
              bgcolor: 'background.paper',
              boxShadow: '4px 4px 16px 0px rgba(0,0,0,0.08)',
              outline: '1px solid',
              outlineColor: 'grey.100',
            }}
          >
            {/* ── City field ── */}
            <ClickAwayListener onClickAway={() => setShowCitySuggestions(false)}>
              <Box sx={{ flex: 1, position: 'relative', minWidth: 0 }}>
                <Box
                  sx={{
                    px: 2,
                    py: isSticky ? 1 : 2,
                    cursor: 'text',
                    transition: 'padding 0.3s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: isSticky ? 0.5 : 1,
                  }}
                  onClick={() => { setShowCitySuggestions(true); setShowGearOptions(false); }}
                >
                  {/* título — se achica en sticky */}
                  <Typography
                    sx={{
                      fontSize: isSticky ? '12px' : '14px',
                      fontWeight: 500,
                      color: '#404040',
                      lineHeight: isSticky ? '16px' : '20px',
                      transition: 'font-size 0.3s ease, line-height 0.3s ease',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Where would you like to rent?
                  </Typography>

                  <TextField
                    fullWidth
                    placeholder={cityPlaceholder}
                    value={cityInput}
                    onChange={(e) => handleCityChange(e.target.value)}
                    onFocus={() => { setCitySuggestions(CA_CITIES); setShowCitySuggestions(true); }}
                    variant="standard"
                    slotProps={{
                      input: {
                        disableUnderline: true,
                        endAdornment: cities.length > 0 ? (
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              setCityInput('');
                              cities.forEach(c => toggleCity(c));
                            }}
                            sx={{ color: 'text.disabled', '&:hover': { color: 'text.primary' } }}
                          >
                            <CloseIcon sx={{ fontSize: 14 }} />
                          </IconButton>
                        ) : null,
                      },
                    }}
                    sx={{
                      '& input': {
                        p: 0,
                        fontSize: isSticky ? '13px' : '15px',
                        fontWeight: 400,
                        lineHeight: '20px',
                        transition: 'font-size 0.3s ease',
                        color: cities.length > 0 ? '#404040' : undefined,
                        '&::placeholder': { color: '#9E9E9E', opacity: 1 },
                      },
                    }}
                  />
                </Box>

                <AnimatePresence>
                  {showCitySuggestions && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.15 }}
                      style={{ position: 'absolute', top: '100%', left: 0, zIndex: 1200, width: '100%', minWidth: 280 }}
                    >
                      <Paper elevation={3} sx={{ borderRadius: '12px', mt: 1, overflow: 'hidden' }}>
                        <Box sx={{ px: 2, pt: 2, pb: 0.5 }}>
                          <Typography variant="h6">Suggestions</Typography>
                        </Box>
                        <List dense sx={{ maxHeight: 280, overflowY: 'auto', py: 0.5 }}>
                          {citySuggestions.map((c) => {
                            const selected = cities.includes(c);
                            return (
                              <ListItem
                                key={c}
                                onClick={() => toggleCity(c)}
                                sx={{
                                  cursor: 'pointer', px: 2, py: 1,
                                  bgcolor: selected ? 'rgba(106,157,80,0.06)' : 'transparent',
                                  '&:hover': { bgcolor: selected ? 'rgba(106,157,80,0.1)' : 'grey.50' },
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                }}
                              >
                                <ListItemText
                                  primary={c}
                                  slotProps={{
                                    primary: {
                                      fontSize: '15px',
                                      color: selected ? '#6A9D50' : '#595959',
                                      fontWeight: selected ? 600 : 400,
                                    },
                                  }}
                                />
                                {selected && <CheckIcon sx={{ color: 'primary.main', fontSize: 18 }} />}
                              </ListItem>
                            );
                          })}
                        </List>
                      </Paper>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Box>
            </ClickAwayListener>

            {/* ── Divider ── */}
            <Box sx={{ width: '1px', bgcolor: 'grey.300', my: isSticky ? 1 : 1.5, transition: 'margin 0.3s ease' }} />

            {/* ── Gear field ── */}
            <ClickAwayListener onClickAway={() => setShowGearOptions(false)}>
              <Box sx={{ flex: 1, position: 'relative', minWidth: 0 }}>
                <Box
                  sx={{
                    px: 2,
                    py: isSticky ? 1 : 2,
                    cursor: 'pointer',
                    transition: 'padding 0.3s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: isSticky ? 0.5 : 1,
                  }}
                  onClick={() => { setShowGearOptions((v) => !v); setShowCitySuggestions(false); }}
                >
                  {/* título — se achica en sticky */}
                  <Typography
                    sx={{
                      fontSize: isSticky ? '12px' : '14px',
                      fontWeight: 500,
                      color: '#404040',
                      lineHeight: isSticky ? '16px' : '20px',
                      transition: 'font-size 0.3s ease, line-height 0.3s ease',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    What are you looking for?
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography
                      sx={{
                        fontSize: isSticky ? '13px' : '15px',
                        fontWeight: 400,
                        lineHeight: '20px',
                        transition: 'font-size 0.3s ease',
                        color: gearCategories.length > 0 ? '#404040' : '#9E9E9E',
                        userSelect: 'none',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        flex: 1,
                      }}
                    >
                      {gearPlaceholder}
                    </Typography>

                    {gearCategories.length > 0 && (
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          gearCategories.forEach(g => toggleGearCategory(g));
                        }}
                        sx={{ color: 'text.disabled', '&:hover': { color: 'text.primary' }, ml: 0.5 }}
                      >
                        <CloseIcon sx={{ fontSize: 14 }} />
                      </IconButton>
                    )}
                  </Box>
                </Box>

                <AnimatePresence>
                  {showGearOptions && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.15 }}
                      style={{ position: 'absolute', top: '100%', left: 0, zIndex: 1200, width: '100%', minWidth: 280 }}
                    >
                      <Paper elevation={3} sx={{ borderRadius: '12px', mt: 1, overflow: 'hidden' }}>
                        <Box sx={{ px: 2, pt: 2, pb: 0.5 }}>
                          <Typography variant="h6">Suggestions</Typography>
                        </Box>
                        <List dense sx={{ py: 0.5 }}>
                          {GEAR_OPTIONS.map((opt) => {
                            const selected = gearCategories.includes(opt.value);
                            return (
                              <ListItem
                                key={opt.label}
                                onClick={() => toggleGearCategory(opt.value)}
                                sx={{
                                  cursor: 'pointer', px: 2, py: 1,
                                  bgcolor: selected ? 'rgba(106,157,80,0.06)' : 'transparent',
                                  '&:hover': { bgcolor: selected ? 'rgba(106,157,80,0.1)' : 'grey.50' },
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                }}
                              >
                                <ListItemText
                                  primary={opt.label}
                                  slotProps={{
                                    primary: {
                                      fontSize: '15px',
                                      color: selected ? '#6A9D50' : '#595959',
                                      fontWeight: selected ? 600 : 400,
                                    },
                                  }}
                                />
                                {selected && <CheckIcon sx={{ color: 'primary.main', fontSize: 18 }} />}
                              </ListItem>
                            );
                          })}
                        </List>
                      </Paper>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Box>
            </ClickAwayListener>

            {/* ── Search button ── */}
            <Box sx={{ display: 'flex', alignItems: 'center', px: 1.5 }}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSearch}
                style={{
                  width: isSticky ? 40 : 48,
                  height: isSticky ? 40 : 48,
                  borderRadius: '12px',
                  background: '#6A9D50',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'width 0.3s ease, height 0.3s ease',
                  flexShrink: 0,
                }}
              >
                <SearchIcon sx={{ color: 'white', fontSize: isSticky ? 18 : 20 }} />
              </motion.button>
            </Box>
          </Paper>
        </motion.div>
      </Box>
    </>
  );
};