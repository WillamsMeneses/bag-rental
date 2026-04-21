import React, { useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Collapse,
  Button,
} from '@mui/material';
import type { Club } from '@/types/listing.types';

const FLEX_LABEL: Record<string, string> = {
  ladies: 'Ladies', senior: 'Senior', regular: 'Regular',
  stiff: 'Stiff', x_stiff: 'X Stiff', xx_stiff: 'XX Stiff',
};

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const formatCategory = (category: string): string => {
  const map: Record<string, string> = {
    driver: 'Driver', wood: 'Wood', hybrid_rescue: 'Hybrid',
    iron: 'Iron', wedge: 'Wedge', putter: 'Putter',
  };
  return map[category] ?? category;
};

interface ClubsTableProps {
  clubs: Club[];
}

export const ClubsTable: React.FC<ClubsTableProps> = ({ clubs }) => {
  const [openClubId, setOpenClubId] = useState<string | null>(null);

  if (clubs.length === 0) return null;

  const toggle = (id: string) => setOpenClubId((prev) => (prev === id ? null : id));

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h3" sx={{ mb: 2 }}>Clubs details</Typography>
      <TableContainer component={Paper} elevation={0} sx={{ border: '0.5px solid', borderColor: 'grey.300', borderRadius: '8px' }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '13px' }}>Club Type</TableCell>
              <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '13px' }}>Brand</TableCell>
              <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '13px' }}>Model</TableCell>
              <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '13px', textAlign:'center' }}>Additional Details</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clubs.map((club) => {
              const isOpen = openClubId === club.id;

              return (
                <React.Fragment key={club.id}>
                  <TableRow sx={{ '&:last-child td': { border: 0 } }}>
                    <TableCell sx={{ fontSize: '13px' }}>{formatCategory(club.category)}</TableCell>
                    <TableCell sx={{ fontSize: '13px' }}>{club.brand}</TableCell>
                    <TableCell sx={{ fontSize: '13px' }}>{club.model}</TableCell>

                    <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                      <Button
                        size="small"
                        onClick={() => toggle(club.id)}
                        variant='contained'
                        color='primary'
                      >
                        {isOpen ? 'Hide' : 'See'}
                      </Button>
                    </TableCell>
                  </TableRow>

                  {/* Expanded detail row */}
                  <TableRow>
                    <TableCell colSpan={5} sx={{ p: 0, border: 0 }}>
                      <Collapse in={isOpen} unmountOnExit>
                        <Box
                          sx={{
                            px: 3,
                            py: 2,
                            bgcolor: 'grey.50',
                            borderTop: '0.5px solid',
                            borderBottom: '0.5px solid',
                            borderColor: 'grey.200',
                          }}
                        >
                          <Box
                            sx={{
                              display: 'grid',
                              gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                              gap: 2,
                            }}
                          >
                            <DetailItem label="Club Type" value={formatCategory(club.category)} />
                            <DetailItem label="Brand" value={club.brand} />
                            <DetailItem label="Model" value={club.model} />
                            {club.flex && (
                              <DetailItem label="Flex" value={FLEX_LABEL[club.flex] ?? club.flex} />
                            )}
                            {club.loft && Number(club.loft) > 0 && (
                              <DetailItem label="Loft" value={`${Number(club.loft)}°`} />
                            )}
                            {club.shaftType && (
                              <DetailItem label="Shaft" value={club.shaftType} />
                            )}
                            {club.woodDetail && (
                              <DetailItem label="Wood Type" value={capitalize(club.woodDetail.woodType)} />
                            )}
                            {club.hybridDetail && (
                              <DetailItem label="Hybrid" value={`#${club.hybridDetail.hybridNumber}`} />
                            )}
                            {club.ironDetail && (
                              <DetailItem label="Iron" value={`${club.ironDetail.ironNumber} iron`} />
                            )}
                            {club.wedgeDetail && (
                              <DetailItem label="Wedge" value={club.wedgeDetail.wedgeType} />
                            )}
                            {club.putterDetail?.putterTypes?.length ? (
                              <DetailItem label="Putter Type" value={club.putterDetail.putterTypes.join(', ')} />
                            ) : null}
                          </Box>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

const DetailItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <Box>
    <Typography variant="caption" color="text.secondary" display="block">
      {label}
    </Typography>
    <Typography variant="body2" fontWeight={500}>
      {value}
    </Typography>
  </Box>
);