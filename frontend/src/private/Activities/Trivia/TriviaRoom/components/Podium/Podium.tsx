import { Box, Typography } from '@mui/material';
import { PlayersRoom } from '../../../../../../services/firebase/dtos';

interface Props {
  players: PlayersRoom;
}

export const Podium = ({ players }: Props) => {
  // Transformar los jugadores en un array y ordenarlos por puntaje descendente
  const sortedPlayers = Object.entries(players || {})
    .map(([playerId, data]) => ({
      nickname: data.nickname || playerId,
      score: data.score,
    }))
    .sort((a, b) => b.score - a.score);

  // Crear la estructura del podio: [Top 2, Top 1, Top 3]
  const podiumStructure = [
    sortedPlayers[1] || { nickname: 'Vacío', score: 0 }, // Top 2
    sortedPlayers[0] || { nickname: 'Vacío', score: 0 }, // Top 1
    sortedPlayers[2] || { nickname: 'Vacío', score: 0 }, // Top 3
  ];

  const podiumHeights = [150, 200, 125]; // Alturas de las columnas (en px)

  return (
    <Box>
      <Typography variant="h4" textAlign="center" mb={2}>
        Resultados Finales
      </Typography>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="flex-end"
        height="250px"
      >
        {podiumStructure.map((player, index) => (
          <Box
            key={index}
            display="flex"
            flexDirection="column"
            alignItems="center"
            mx={1}
          >
            {/* Nickname del jugador */}
            <Typography variant="caption" textAlign="center" mb={1}>
              {player.nickname}
            </Typography>

            {/* Barra del podio */}
            <Box
              width="60px"
              height={`${podiumHeights[index]}px`}
              bgcolor={index === 1 ? 'gold' : index === 0 ? 'silver' : 'bronze'}
              display="flex"
              justifyContent="center"
              alignItems="center"
              borderRadius="4px"
              boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
            >
              {/* Puntaje dentro de la barra */}
              <Typography variant="body1" color="white" fontWeight="bold">
                {player.score}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Podium;
