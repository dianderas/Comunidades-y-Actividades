import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Backdrop } from '../components';
import { useAuthStore } from '../stores/zubstand/authStore';

export const AuthRedirectGuard = () => {
  const { user, isCheckingAuth } = useAuthStore();
  const location = useLocation();

  const from = (location.state?.from as string) || '';
  console.log({ from });

  if (isCheckingAuth) {
    return <Backdrop />;
  }

  if (user && from.startsWith('/join')) {
    return <Navigate to={from} replace />;
  }

  return user ? <Navigate to="/community" replace /> : <Outlet />;
};
