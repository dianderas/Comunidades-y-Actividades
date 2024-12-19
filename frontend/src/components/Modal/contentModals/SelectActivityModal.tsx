import { Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useModalStore } from '../../../stores/zubstand';

export const SelectActivityModal = () => {
  const { closeModal } = useModalStore();
  const navigate = useNavigate();
  const handleNavigate = (path: string) => {
    closeModal();
    navigate(path, { replace: true });
  };

  return (
    <>
      <Typography variant="h6">Elige la actividad que deseas crear:</Typography>
      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 2 }}
        onClick={() => handleNavigate('/actividad-1')}
      >
        Actividad 1
      </Button>
      <Button
        variant="contained"
        color="secondary"
        sx={{ mt: 2, ml: 2 }}
        onClick={() => handleNavigate('/actividad-2')}
      >
        Actividad 2
      </Button>
    </>
  );
};
