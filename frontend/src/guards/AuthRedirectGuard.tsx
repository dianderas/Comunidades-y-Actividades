import { Navigate, Outlet } from 'react-router-dom';
import { Backdrop } from '../components';
import { useAuthStore } from '../stores/zubstand/authStore';

export const AuthRedirectGuard = () => {
  const { user, isCheckingAuth } = useAuthStore();

  if (isCheckingAuth) {
    return <Backdrop />;
  }

  return user ? <Navigate to="/community" replace /> : <Outlet />;
};
