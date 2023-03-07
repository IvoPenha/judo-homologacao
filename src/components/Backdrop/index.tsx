import {
  Backdrop,
  CircularProgress,
} from '@mui/material';

interface BackdropProps {
  open: boolean;
}

export function BackdropComponent ({ open }: BackdropProps) {
  return (
    <Backdrop
      sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={open}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}