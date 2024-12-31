import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  Typography,
} from '@mui/material';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import AdbIcon from '@mui/icons-material/Adb';
import './JoinCommunity.css';
import {
  addMemberToCommunity,
  getCommunityByInviteToken,
} from '../../services/firebase';
import { useApi } from '../../hooks';
import { useEffect, useState } from 'react';
import { useAuthStore } from '../../stores/zubstand/authStore';
import { CommunitytoInviteResponse } from '../../services/firebase/dtos';

export const JoinCommunity = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useParams();
  const [community, setCommunity] = useState<CommunitytoInviteResponse | null>(
    null
  );

  const {
    data: fetchResponse,
    error: fetchError,
    execute: fetchCommunity,
  } = useApi({
    request: getCommunityByInviteToken,
  });

  const {
    data: addMemberResponse,
    error: addMemberError,
    execute: addMember,
    loading,
  } = useApi({
    request: addMemberToCommunity,
  });

  useEffect(() => {
    fetchCommunity(token);
  }, [fetchCommunity, token]);

  useEffect(() => {
    if (community && addMemberResponse?.data.success) {
      navigate(`/community/${community.id}`, {
        state: { from: location.pathname },
      });
    }

    if (fetchResponse?.data) {
      setCommunity(fetchResponse?.data);
    }
  }, [
    addMemberResponse?.data.success,
    community,
    fetchResponse?.data,
    location.pathname,
    navigate,
  ]);

  const onAccept = () => {
    if (user && community) {
      console.log(user.uid);
      addMember({ communityId: community.id, userId: user.uid });
    } else {
      console.log('redirect to: ', location.pathname);
      navigate('/login', { state: { from: location.pathname } });
    }
  };

  return (
    <Container className="invite-container">
      {fetchError && (
        <Typography variant="body2" color="error" sx={{ mt: 2 }}>
          {fetchError.message}
        </Typography>
      )}
      <Box className="invite-logo">
        <AdbIcon />
        <Typography
          variant="h5"
          noWrap
          component="a"
          href=""
          sx={{
            mr: 2,
            display: { xs: 'flex' },
            fontFamily: 'monospace',
            fontWeight: 700,
            letterSpacing: '.3rem',
            color: 'inherit',
            textDecoration: 'none',
          }}
        >
          XD
        </Typography>
      </Box>
      {community && (
        <Card variant="outlined" className="invite-box">
          <CardContent className="invite-accept">
            <Typography
              gutterBottom
              sx={{ color: 'text.secondary', fontSize: 14 }}
            >
              Te han invitado unirte a
            </Typography>
            <Avatar sx={{ width: 56, height: 56 }} />
            <Typography variant="h5" component="div">
              {community.name}
            </Typography>
          </CardContent>
          <CardActions className="invite-accept">
            <Button
              variant="contained"
              size="small"
              onClick={onAccept}
              disabled={loading}
            >
              Aceptar invitación
            </Button>
          </CardActions>
          {addMemberError && (
            <Typography variant="body2" color="error" sx={{ mt: 2 }}>
              {addMemberError.message}
            </Typography>
          )}
        </Card>
      )}
    </Container>
  );
};

export default JoinCommunity;
