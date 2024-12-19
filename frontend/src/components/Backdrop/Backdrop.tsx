import { CircularProgress, Backdrop as MuiBackdrop } from '@mui/material';

interface Props {
  open?: boolean;
}

export const Backdrop = ({ open = true }: Props) => {
  return (
    <MuiBackdrop
      sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
      open={open}
    >
      <CircularProgress color="inherit" />
    </MuiBackdrop>
  );
};
