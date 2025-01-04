import { Box, Typography } from '@mui/material';
import { useEffect, useState, memo } from 'react';
import './HudTopbar.css';
import { QuestionRooom } from '../../../../services/firebase/dtos';

interface Props {
  triviaTitle: string;
  currentQuestion: QuestionRooom | null;
  status: string;
}

const HudTopbarComponent = ({
  triviaTitle,
  currentQuestion,
  status,
}: Props) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (currentQuestion) {
      setVisible(false);
      setTimeout(() => setVisible(true), 300);
    }
  }, [currentQuestion]);

  return (
    <Box
      className={`topbar-container ${visible ? 'fade-in-lateral' : 'fade-out'}`}
    >
      {status === 'waiting' && (
        <Typography variant="h6" component="div">
          {`Trivia "${triviaTitle}" esperando que jugadores ingresen...`}
        </Typography>
      )}
      {status === 'in_progress' && (
        <>
          <Typography variant="h6" component="div">
            {`Pregunta: "${currentQuestion?.question}"`}
          </Typography>
        </>
      )}
    </Box>
  );
};

export const HudTopbar = memo(HudTopbarComponent, (prevProps, nextProps) => {
  return prevProps.currentQuestion === nextProps.currentQuestion;
});
