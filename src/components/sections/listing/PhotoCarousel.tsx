import React, { useState } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=800&h=600&fit=crop';

interface PhotoCarouselProps {
  photos: string[];
  title: string;
}

export const PhotoCarousel: React.FC<PhotoCarouselProps> = ({ photos, title }) => {
  const [current, setCurrent] = useState(0);
  const images = photos.length > 0 ? photos : [PLACEHOLDER, PLACEHOLDER, PLACEHOLDER, PLACEHOLDER];

  const prev = () => setCurrent((c) => (c === 0 ? images.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === images.length - 1 ? 0 : c + 1));

  return (
    <Box>
      <Box sx={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', bgcolor: 'grey.200' }}>
        <Box
          component="img"
          src={images[current]}
          alt={title}
          sx={{ width: '100%', height: { xs: 260, md: 420 }, objectFit: 'cover', display: 'block' }}
        />
        <Box sx={{ position: 'absolute', bottom: 12, right: 12, bgcolor: 'rgba(0,0,0,0.55)', borderRadius: '6px', px: 1.5, py: 0.5 }}>
          <Typography variant="caption" sx={{ color: '#fff', fontWeight: 600 }}>{title}</Typography>
        </Box>
        {images.length > 1 && (
          <>
            <IconButton onClick={prev} size="small" sx={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', bgcolor: 'rgba(255,255,255,0.85)', '&:hover': { bgcolor: 'white' } }}>
              <ArrowBackIosIcon sx={{ fontSize: 14 }} />
            </IconButton>
            <IconButton onClick={next} size="small" sx={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', bgcolor: 'rgba(255,255,255,0.85)', '&:hover': { bgcolor: 'white' } }}>
              <ArrowForwardIosIcon sx={{ fontSize: 14 }} />
            </IconButton>
          </>
        )}
        {images.length > 1 && (
          <Box sx={{ position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 0.5 }}>
            {images.map((_, i) => (
              <Box key={i} onClick={() => setCurrent(i)} sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: i === current ? '#fff' : 'rgba(255,255,255,0.5)', cursor: 'pointer', transition: 'all 0.2s' }} />
            ))}
          </Box>
        )}
      </Box>
      {images.length > 1 && (
        <Box sx={{ display: 'flex', gap: 1, mt: 1.5, overflowX: 'auto', pb: 0.5 }}>
          {images.map((src, i) => (
            <Box key={i} component="img" src={src} alt={`${title} ${i + 1}`} onClick={() => setCurrent(i)}
              sx={{ width: 72, height: 56, objectFit: 'cover', borderRadius: '6px', flexShrink: 0, cursor: 'pointer', border: i === current ? '2px solid' : '2px solid transparent', borderColor: i === current ? 'primary.main' : 'transparent', transition: 'border-color 0.2s', opacity: i === current ? 1 : 0.7 }}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};