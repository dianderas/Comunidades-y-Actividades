import { Button, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useModalStore } from '../../../../../stores/zubstand';

export const SelectActivityModal = () => {
  const { communityId } = useParams();
  const { closeModal } = useModalStore();
  const navigate = useNavigate();
  const handleNavigate = (path: string) => {
    closeModal();
    navigate(path, { replace: false });
  };

  return (
    <>
      <Typography variant="h6">Elige la actividad que deseas crear:</Typography>
      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 2 }}
        onClick={() =>
          handleNavigate(`/community/${communityId}/activity/trivia`)
        }
      >
        Trivia
      </Button>
      <Button
        variant="contained"
        color="secondary"
        sx={{ mt: 2, ml: 2 }}
        onClick={() => handleNavigate('/actividad-2')}
      >
        Beets
      </Button>
    </>
  );
};
