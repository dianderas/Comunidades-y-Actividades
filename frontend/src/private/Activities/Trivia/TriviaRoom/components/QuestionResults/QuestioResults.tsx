import { Box, Typography } from '@mui/material';
import { RoomData } from '../../../../../../services/firebase/dtos';

interface Props {
  roomData: RoomData;
  showTitle?: boolean;
}

export const QuestionResults = ({ roomData, showTitle = true }: Props) => {
  const MIN_HEIGHT = 20;
  const MAX_HEIGHT = 200;

  // Obtener el máximo count para escalar las barras
  const maxCount = Math.max(
    ...Object.values(roomData?.currentQuestionResults || {}).map(Number),
    1 // Evitar dividir por 0 si no hay resultados
  );

  const getBarHeight = (count: number) => {
    if (count === 0) return MIN_HEIGHT;
    if (maxCount === 1) return MAX_HEIGHT;
    const scaledHeight = (Math.log(count) / Math.log(maxCount)) * MAX_HEIGHT;
    return Math.max(scaledHeight, MIN_HEIGHT);
  };

  return (
    <Box>
      {showTitle && (
        <Typography variant="h6" textAlign="center" mb={2}>
          Resultados de la pregunta
        </Typography>
      )}
      <Box
        display="flex"
        justifyContent="space-evenly"
        alignItems="flex-end"
        height="280px" // Altura total del contenedor de las barras
        pt={2}
      >
        {roomData?.currentQuestionResults &&
          Object.entries(roomData.currentQuestionResults).map(
            ([option, count]) => (
              <Box key={option} textAlign="center">
                <Typography variant="body2" mb={1}>
                  {count}
                </Typography>
                <Box
                  width="40px"
                  height={`${getBarHeight(count)}px`}
                  bgcolor="primary.main"
                  mx={1}
                  borderRadius="4px"
                  display="flex"
                  justifyContent="center"
                  alignItems="flex-end"
                />
                <Typography variant="caption" mt={1}>
                  {option}
                </Typography>
              </Box>
            )
          )}
      </Box>
    </Box>
  );
};
