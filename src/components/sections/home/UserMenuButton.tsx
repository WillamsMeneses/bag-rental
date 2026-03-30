import avatarSvg from '@/assets/svg/avatar.svg';
import ChevronDown from '@/components/icons/ChevronDown';
import { Box } from '@mui/material';

interface UserMenuButtonProps {
  onClick?: () => void;
}

export default function UserMenuButton({ onClick }: UserMenuButtonProps) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '6px 16px 6px 6px',
        backgroundColor: '#ffffff',
        border: '1.5px solid #E0E0E0',
        borderRadius: '999px',
        cursor: 'pointer',
      }}
    >
      <img
        src={avatarSvg}
        alt="avatar"
        style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }}
      />
      <Box sx={{ color: '#595959', display: 'flex', alignItems: 'center', width: 12, height: 7 }}>
        <ChevronDown />
      </Box>
    </button>
  );
}