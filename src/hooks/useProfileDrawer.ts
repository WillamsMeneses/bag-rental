import { useState } from 'react';

export const useProfileDrawer = () => {
  const [open, setOpen] = useState(false);

  const openDrawer = () => setOpen(true);
  const closeDrawer = () => setOpen(false);

  return { open, openDrawer, closeDrawer };
};