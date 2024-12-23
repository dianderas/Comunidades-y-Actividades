import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from './App';
import { AuthRedirectGuard, PrivateGuard } from './guards';
import { CreateTrivia, Dashboard } from './private';
import { JoinCommunity, Login, Register } from './public';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/', element: <Navigate to="/home" /> },
      { path: '/join/:token', element: <JoinCommunity /> },
      {
        element: <AuthRedirectGuard />,
        children: [
          { path: '/login', element: <Login /> },
          { path: '/register', element: <Register /> },
        ],
      },
      {
        element: <PrivateGuard />,
        children: [
          {
            path: '/community/:communityId?',
            element: <Dashboard />,
          },
          {
            path: '/community/activity/trivia',
            element: <CreateTrivia />,
          },
        ],
      },
      { path: '/home', element: <div>Home</div> },
      { path: '*', element: <h1>Pagina no encontrada</h1> },
    ],
  },
]);

export default router;
