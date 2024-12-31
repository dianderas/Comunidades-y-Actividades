import EditIcon from '@mui/icons-material/Edit';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { KeyboardEvent, useEffect, useState } from 'react';

interface Props {
  defaultValue: string;
  onSave?: (value: string) => void;
}

export const EditableLabel = ({ defaultValue, onSave }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const handleBlur = () => {
    setIsEditing(false);
    if (onSave) {
      onSave(value);
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === 'Escape') {
      setIsEditing(false);
      if (onSave) {
        onSave(value);
      }
    }
  };

  return (
    <Box display="flex" alignItems="center" gap={1}>
      {isEditing ? (
        <TextField
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          variant="outlined"
          size="small"
          autoFocus
          InputProps={{
            style: { fontSize: '1.5rem', fontWeight: 600 },
          }}
        />
      ) : (
        <Box
          display="flex"
          alignItems="center"
          gap={1}
          onClick={() => setIsEditing(true)}
          style={{ cursor: 'pointer' }}
        >
          <Typography variant="h5" fontWeight="bold">
            {value}
          </Typography>
          <IconButton size="small">
            <EditIcon fontSize="small" />
          </IconButton>
        </Box>
      )}
    </Box>
  );
};
