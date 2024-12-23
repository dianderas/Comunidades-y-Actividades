import { Box, Button, TextField, Tooltip, Typography } from '@mui/material';
import { useRef, useState } from 'react';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import './inviteLink.css';

interface Props {
  token?: string;
}

export const InviteLink = ({ token = '' }: Props) => {
  const [tooltipText, setTooltipText] = useState('Copiar');
  const inputRef = useRef<HTMLInputElement | null>(null);
  const url = `${window.location.host}/join/${token}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setTooltipText('Copiado!');
      setTimeout(() => setTooltipText('Copiar'), 2000);
    } catch (error) {
      console.log(error);
      setTooltipText('Error al copiar');
    }
  };

  const handleFocus = () => {
    if (inputRef.current) {
      inputRef.current.select();
    }
  };

  return (
    <Box className="modal-content">
      <Typography variant="h6" mb={1} align="center">
        Invitar amigos
      </Typography>
      <Typography variant="body2" mb={2}>
        Envia un enlace de invitacion a la comunidad
      </Typography>
      <Box className="input-container">
        <TextField
          value={url}
          variant="outlined"
          size="small"
          fullWidth
          slotProps={{
            input: {
              readOnly: true,
            },
          }}
          inputRef={inputRef}
          onClick={handleFocus}
        />
        <Tooltip title={tooltipText} arrow>
          <Button
            variant="contained"
            color="primary"
            startIcon={<ContentCopyIcon />}
            onClick={handleCopy}
          >
            <Typography variant="body2" sx={{ mt: '2px' }}>
              Copiar
            </Typography>
          </Button>
        </Tooltip>
      </Box>
    </Box>
  );
};
