import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../stores/zubstand/authStore';
import { Backdrop } from '../components';

export const PrivateGuard = () => {
  const { user, isCheckingAuth } = useAuthStore();

  if (isCheckingAuth) {
    return <Backdrop />;
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};
