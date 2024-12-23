import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from './App';
import { AuthRedirectGuard, PrivateGuard } from './guards';
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('./private/Dashboard/Dashboard'));
const CreateTrivia = lazy(
  () => import('./private/Activities/Trivia/CreateTrivia/CreateTrivia')
);
const JoinCommunity = lazy(
  () => import('./public/JoinCommunity/JoinCommunity')
);
const Login = lazy(() => import('./public/Login/Login'));
const Register = lazy(() => import('./public/Register/Register'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/', element: <Navigate to="/home" /> },
      {
        path: '/join/:token',
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <JoinCommunity />
          </Suspense>
        ),
      },
      {
        element: <AuthRedirectGuard />,
        children: [
          {
            path: '/login',
            element: (
              <Suspense fallback={<div>Loading...</div>}>
                <Login />
              </Suspense>
            ),
          },
          {
            path: '/register',
            element: (
              <Suspense fallback={<div>Loading...</div>}>
                <Register />
              </Suspense>
            ),
          },
        ],
      },
      {
        element: <PrivateGuard />,
        children: [
          {
            path: '/community/:communityId?',
            element: (
              <Suspense fallback={<div>Loading...</div>}>
                <Dashboard />
              </Suspense>
            ),
          },
          {
            path: '/community/activity/trivia',
            element: (
              <Suspense fallback={<div>Loading...</div>}>
                <CreateTrivia />
              </Suspense>
            ),
          },
        ],
      },
      { path: '/home', element: <div>Home</div> },
      { path: '*', element: <h1>Pagina no encontrada</h1> },
    ],
  },
]);

export default router;
