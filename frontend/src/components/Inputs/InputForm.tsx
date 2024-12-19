import {
  Control,
  Controller,
  FieldError,
  FieldValues,
  Path,
} from 'react-hook-form';
import { TextField } from '@mui/material';

interface Props<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  type?: string;
  error?: FieldError;
  disabled?: boolean;
}

export const InputForm = <T extends FieldValues>({
  name,
  control,
  label,
  type = 'text',
  error,
  disabled,
}: Props<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <TextField
          {...field}
          id={name as string}
          label={label}
          type={type}
          variant="outlined"
          fullWidth
          error={!!error}
          helperText={error ? error.message : ''}
          disabled={disabled}
          sx={{ mb: 2 }}
        />
      )}
    />
  );
};
