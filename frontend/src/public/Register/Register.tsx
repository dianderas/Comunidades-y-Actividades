import { zodResolver } from '@hookform/resolvers/zod';
import LoadingButton from '@mui/lab/LoadingButton';
import { Box, Typography } from '@mui/material';
import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { InputForm } from '../../components';
import { useApi } from '../../hooks';
import { RegisterFormValues, registerSchema } from '../../models';
import { register } from '../../services/firebase';

export const Register = () => {
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    //mode: 'onBlur',
    defaultValues: {
      email: '',
      nickname: '',
      password: '',
      confirmPassword: '',
    },
  });

  const { execute, loading, error, data } = useApi({
    request: register,
  });

  const onSubmit: SubmitHandler<RegisterFormValues> = async (values) => {
    await execute({
      email: values.email,
      password: values.password,
      nickname: values.nickname,
    });
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
        Registro
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
          name="nickname"
          control={control}
          label="Nickname"
          type="text"
          disabled={loading}
          error={errors.nickname}
        />
        <InputForm
          name="password"
          control={control}
          label="Password"
          type="password"
          disabled={loading}
          error={errors.password}
        />
        <InputForm
          name="confirmPassword"
          control={control}
          label="Confirm Password"
          type="password"
          disabled={loading}
          error={errors.confirmPassword}
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
          Registrarse
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

export default Register;
