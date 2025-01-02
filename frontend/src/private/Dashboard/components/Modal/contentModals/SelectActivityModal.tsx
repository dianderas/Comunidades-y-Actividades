import { Button, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import {
  useCreateTriviaStore,
  useModalStore,
} from '../../../../../stores/zubstand';

export const SelectActivityModal = () => {
  const { communityId } = useParams();
  const { closeModal } = useModalStore();
  const { resetStore: resetCreateTriviaStore } = useCreateTriviaStore();
  const navigate = useNavigate();

  const handleNavigate = (type: string) => {
    closeModal();
    if (type === 'trivia') {
      resetCreateTriviaStore();
      navigate(`/community/${communityId}/activity/trivia`, { replace: false });
    }
  };

  return (
    <>
      <Typography variant="h6">Elige la actividad que deseas crear:</Typography>
      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 2 }}
        onClick={() => handleNavigate('trivia')}
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
