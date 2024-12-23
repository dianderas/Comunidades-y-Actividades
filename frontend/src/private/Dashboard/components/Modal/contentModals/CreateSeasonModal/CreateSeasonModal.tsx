import { Button, Typography } from '@mui/material';
import { useModalStore } from '../../../../../../stores/zubstand';

export const CreteSeasonModal = () => {
  const { closeModal } = useModalStore();

  const handleSubmit = () => {
    closeModal();
  };

  return (
    <>
      <Typography variant="h6">Elige la actividad que deseas crear:</Typography>
      <Button
        variant="contained"
        color="secondary"
        sx={{ mt: 2, ml: 2 }}
        onClick={() => handleSubmit()}
      >
        Actividad 2
      </Button>
    </>
  );
};
