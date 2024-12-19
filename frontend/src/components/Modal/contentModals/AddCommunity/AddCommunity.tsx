import { useEffect, useRef, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  styled,
  TextField,
  Typography,
} from '@mui/material';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import './AddCommunity.css';
import { createCommunity } from '../../../../services/firebase';
import { useApi } from '../../../../hooks';
import { useCommunityStore, useModalStore } from '../../../../stores/zubstand';
import { useAuthStore } from '../../../../stores/zubstand/authStore';
import { useNavigate } from 'react-router-dom';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

interface Props {
  setDisableClose?: (val: boolean) => void;
}

export const AddCommunity = ({ setDisableClose }: Props) => {
  const [view, setView] = useState('main');
  const nodeRef = useRef(null);
  const user = useAuthStore((state) => state.user);
  const [communityName, setCommunityName] = useState('');
  const { closeModal } = useModalStore();
  const { addCommunity } = useCommunityStore();
  const navigate = useNavigate();

  const { execute, loading, error, data } = useApi({
    request: createCommunity,
  });

  useEffect(() => {
    if (setDisableClose) {
      setDisableClose(loading);
    }
  }, [loading, setDisableClose]);

  const handleBack = () => {
    if (!loading) {
      setView('main');
    }
  };

  useEffect(() => {
    if (data) {
      console.log('AddCommunity Comp', {
        id: data.id,
        name: communityName,
      });
      addCommunity({
        id: data.id,
        name: communityName,
      });
      navigate(`/community/${data.id}`, { replace: true });
      closeModal();
    }
  }, [data, closeModal, addCommunity, communityName, navigate]);

  const handleCreateCommunity = async () => {
    if (!user) {
      console.error('Usuario no autenticado');
      return;
    }

    await execute({ communityName: communityName, ownerId: user.uid });
  };

  return (
    <Box className="modal-box">
      <SwitchTransition>
        <CSSTransition
          key={view}
          nodeRef={nodeRef}
          timeout={300}
          classNames="slide"
          unmountOnExit
        >
          <Box ref={nodeRef} className="modal-content">
            {view === 'main' && (
              <Box>
                <Typography variant="h6" mb={1} align="center">
                  Crea tu comunidad
                </Typography>
                <Typography variant="body2" mb={2}>
                  Tu comunidad es donde te reunes con tus viewers. Crea el tuyo
                  y empieza una nueva experiencia de interaccion.
                </Typography>
                <Button
                  className="btn-anim"
                  variant="contained"
                  sx={{ marginBottom: '24px' }}
                  fullWidth
                  onClick={() => setView('create')}
                >
                  Iniciar una comunidad
                </Button>
                <Typography variant="h6" align="center" mb={2}>
                  Ya tienes una invitacion?
                </Typography>
                <Button
                  className="btn-anim"
                  variant="outlined"
                  fullWidth
                  onClick={() => setView('join')}
                >
                  Unirse a una comunidad
                </Button>
              </Box>
            )}
            {view === 'create' && (
              <Box>
                <Typography variant="h6" mb={1} align="center">
                  Personaliza tu comunidad
                </Typography>
                <Typography variant="body2" mb={2}>
                  Dale una personalidad propia a tu nueva comunidad con un
                  nombre e icono. Siempre puedes cambiarlo mas tarde
                </Typography>
                <Button
                  component="label"
                  role={undefined}
                  variant="contained"
                  tabIndex={-1}
                  sx={{ marginBottom: '24px' }}
                  disabled={loading}
                  startIcon={<CloudUploadIcon />}
                >
                  Upload files
                  <VisuallyHiddenInput
                    type="file"
                    onChange={(event) => console.log(event.target.files)}
                    multiple
                  />
                </Button>
                <TextField
                  fullWidth
                  label="Nombre de la comunidad"
                  variant="outlined"
                  sx={{ mb: 2 }}
                  value={communityName}
                  onChange={(e) => setCommunityName(e.target.value)}
                  disabled={loading}
                />
                <Box display="flex" justifyContent="space-between" mb="auto">
                  <Button onClick={handleBack} disabled={loading}>
                    Regresar
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleCreateCommunity}
                    disabled={loading || communityName.trim() === ''}
                    endIcon={
                      loading ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : null
                    }
                  >
                    {loading ? 'Creando...' : 'Crear'}
                  </Button>
                </Box>
                {error && (
                  <Typography color="error" variant="body2" mt={2}>
                    {error.message}
                  </Typography>
                )}
              </Box>
            )}
            {view === 'join' && (
              <Box>
                <Typography variant="h6" mb={2} align="center">
                  Únete a una comunidad
                </Typography>
                <Typography variant="body2" mb={2}>
                  Introduce la invitacion para unirte a una comunidad existente
                </Typography>
                <TextField
                  fullWidth
                  label="Enlace de invitacion"
                  variant="outlined"
                  sx={{ mb: 2 }}
                  disabled={loading}
                />
                <Box display="flex" justifyContent="space-between" mt={2}>
                  <Button onClick={handleBack} disabled={loading}>
                    Regresar
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => console.log('Unirse a comunidad')}
                    disabled={loading}
                  >
                    Unirse
                  </Button>
                </Box>
              </Box>
            )}
          </Box>
        </CSSTransition>
      </SwitchTransition>
    </Box>
  );
};
