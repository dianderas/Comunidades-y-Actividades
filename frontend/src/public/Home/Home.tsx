import {
  AppBar,
  Box,
  Button,
  Container,
  Toolbar,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/zubstand/authStore';

export const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  return (
    <div>
      <AppBar position="static" color="primary" elevation={0}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            EkisDe
          </Typography>
          <Box sx={{ display: 'flex', columnGap: '8px' }}>
            {!user?.uid ? (
              <>
                <Button
                  color="inherit"
                  variant="outlined"
                  onClick={() => navigate('/login')}
                >
                  Login
                </Button>
                <Button
                  color="inherit"
                  variant="outlined"
                  onClick={() => navigate('/register')}
                >
                  Register
                </Button>
              </>
            ) : (
              <Button
                color="inherit"
                variant="outlined"
                onClick={() => navigate('/community')}
              >
                Ya tamos
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <Container
        sx={{
          height: 'calc(100vh - 64px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography variant="h1" fontWeight="bold">
          XD
        </Typography>
        <Typography variant="h4" fontWeight="bold">
          {`{ Alpha }`}
        </Typography>
      </Container>
    </div>
  );
};
