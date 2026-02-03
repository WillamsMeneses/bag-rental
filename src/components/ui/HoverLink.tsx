import { Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import type { LinkProps as RouterLinkProps } from 'react-router-dom';

interface HoverLinkProps extends RouterLinkProps {
  children: React.ReactNode;
  underlineColor?: string;
  alwaysUnderline?: boolean;
}

const HoverLink = ({ 
  children, 
  underlineColor = '#89C96A',
  alwaysUnderline = false,
  ...props 
}: HoverLinkProps) => {
  
  return (
    <Link
      component={RouterLink}
      sx={{
        textDecoration: alwaysUnderline ? 'underline' : 'none',
        textDecorationColor: alwaysUnderline ? underlineColor : 'transparent',
        '&:hover': {
          textDecoration: 'underline',
          textDecorationColor: underlineColor,
        },
      }}
      {...props}
    >
      {children}
    </Link>
  );
};

export default HoverLink;