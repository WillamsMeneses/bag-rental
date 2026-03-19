import React from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import type { Club } from '@/types/listing.types';

const FLEX_LABEL: Record<string, string> = {
  ladies: 'Ladies', senior: 'Senior', regular: 'Regular',
  stiff: 'Stiff', x_stiff: 'X Stiff', xx_stiff: 'XX Stiff',
};

const getClubAdditionalDetails = (club: Club): string => {
  const parts: string[] = [];
  if (club.flex) parts.push(FLEX_LABEL[club.flex] ?? club.flex);
  if (club.loft) parts.push(`Loft ${club.loft}°`);
  if (club.woodDetail) parts.push(`${club.woodDetail.woodType} wood`);
  if (club.hybridDetail) parts.push(`#${club.hybridDetail.hybridNumber}`);
  if (club.ironDetail) parts.push(`${club.ironDetail.ironNumber} iron`);
  if (club.wedgeDetail) parts.push(`${club.wedgeDetail.wedgeType} wedge`);
  if (club.putterDetail?.putterTypes?.length) parts.push(club.putterDetail.putterTypes.join(', '));
  if (club.shaftType) parts.push(club.shaftType);
  return parts.join('  ');
};

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
  if (clubs.length === 0) return null;

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
              <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '13px' }}>Additional Details</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clubs.map((club) => (
              <TableRow key={club.id} sx={{ '&:last-child td': { border: 0 } }}>
                <TableCell sx={{ fontSize: '13px' }}>{formatCategory(club.category)}</TableCell>
                <TableCell sx={{ fontSize: '13px' }}>{club.brand}</TableCell>
                <TableCell sx={{ fontSize: '13px' }}>{club.model}</TableCell>
                <TableCell sx={{ fontSize: '13px', color: 'text.secondary' }}>{getClubAdditionalDetails(club)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};