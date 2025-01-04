import { Box, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

interface Props {
  remainingTime: number;
}

export const RemainingTimeDisplay = ({ remainingTime }: Props) => {
  const [isLarge, setIsLarge] = useState(false);
  const [isCentered, setIsCentered] = useState(false);

  useEffect(() => {
    if (remainingTime <= 5) {
      setIsLarge(true);
      setTimeout(() => setIsCentered(true), 300);
    } else {
      setIsLarge(false);
      setIsCentered(false);
    }
  }, [remainingTime]);

  if (remainingTime <= 0) return null;

  return (
    <Box
      className={`remaining-time-wrapper ${isCentered ? 'centered' : 'bottom'}`}
      sx={{
        position: 'absolute',
        left: '50%',
        transform: 'translateX(-50%)',
        transition: 'all 0.5s ease',
        bottom: isCentered ? '50%' : '20px',
      }}
    >
      <Typography
        sx={{
          fontSize: isLarge ? '100px' : '24px',
          fontWeight: 'bold',
          opacity: 0,
          animation: `fadeInOut 1s ease`,
        }}
        key={remainingTime}
      >
        {remainingTime}
      </Typography>
    </Box>
  );
};
