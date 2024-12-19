import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { LoginFormValues, loginSchema } from '../../models';
import { login } from '../../services/firebase';
import { useApi } from '../../hooks';
import { useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { InputForm } from '../../components';

export const Login = () => {
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    //mode: 'onBlur',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { execute, loading, error, data } = useApi({
    request: login,
  });

  const onSubmit: SubmitHandler<LoginFormValues> = async (values) => {
    await execute(values.email, values.password);
  };

  useEffect(() => {
    if (data) {
      navigate('/community', { replace: true });
    }
  }, [data, navigate]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        mt: 4,
      }}
    >
      <Typography variant="h4" gutterBottom>
        Login
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <InputForm
          name="email"
          control={control}
          label="Email"
          type="text"
          disabled={loading}
          error={errors.email}
        />
        <InputForm
          name="password"
          control={control}
          label="Password"
          type="password"
          disabled={loading}
          error={errors.password}
        />
        <LoadingButton
          variant="contained"
          color="primary"
          type="submit"
          loading={loading}
          size="large"
          loadingIndicator="Cargando"
          sx={{ mb: 2 }}
        >
          Ingresar
        </LoadingButton>
      </form>
      {error && (
        <Typography variant="body2" color="error" sx={{ mt: 2 }}>
          {error.message}
        </Typography>
      )}
    </Box>
  );
};
