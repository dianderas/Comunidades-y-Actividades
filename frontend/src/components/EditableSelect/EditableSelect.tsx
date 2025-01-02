import { KeyboardEvent, useEffect, useState } from 'react';
import { Box, IconButton, MenuItem, Select, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

type Props = {
  defaultValue: string;
  options: { value: string; label: string }[];
  onSave?: (value: string) => void;
};

export const EditableSelect = ({ defaultValue, options, onSave }: Props) => {
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

  const handleKeyDown = (
    event: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
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
        <Select
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoFocus
          size="small"
          sx={{ fontSize: '1rem', fontWeight: 600 }}
        >
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          gap={1}
          onClick={() => setIsEditing(true)}
          style={{ cursor: 'pointer' }}
        >
          <Typography variant="body1" fontWeight="bold">
            {options.find((o) => o.value === value)?.label}
          </Typography>
          <IconButton size="small">
            <EditIcon fontSize="small" />
          </IconButton>
        </Box>
      )}
    </Box>
  );
};
