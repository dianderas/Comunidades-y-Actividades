import { Avatar, Box, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { PlayersRoom } from '../../../../services/firebase/dtos';
import './TopPlayers.css';

interface Props {
  players: PlayersRoom;
}

export const TopPlayersList = ({ players }: Props) => {
  const [topPlayers, setTopPlayers] = useState<
    { userId: string; nickname: string; score: number }[]
  >([]);

  useEffect(() => {
    const sortedPlayers = Object.entries(players || {})
      .map(([userId, { nickname, score }]) => ({ userId, nickname, score }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    setTopPlayers([]);
    const timeout = setTimeout(() => setTopPlayers(sortedPlayers), 200);

    return () => clearTimeout(timeout);
  }, [players]);

  return (
    <Box>
      <Typography
        variant="h6"
        textAlign="center"
        gutterBottom
        className="top-player-title"
      >
        Top Players
      </Typography>
      <Box className="top-players-container">
        {topPlayers.map((player) => (
          <Box key={player.userId} className="player-item">
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              {player.nickname.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="subtitle1">
                {player.nickname.split('@')[0]}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {player.score} puntos
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};
