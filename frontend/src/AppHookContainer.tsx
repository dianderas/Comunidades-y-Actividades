import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { Backdrop } from './components';
import ErrorBoundary from './ErrorBoundary';
import router from './router';
import { useAuthStore } from './stores/zubstand/authStore';
import theme from './theme';

function AppHookContainer() {
  const initAuthListener = useAuthStore((state) => state.initAuthListener);
  const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);

  useEffect(() => {
    initAuthListener();
  }, [initAuthListener]);

  if (isCheckingAuth) {
    return <Backdrop />;
  }

  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <RouterProvider router={router} />
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default AppHookContainer;
