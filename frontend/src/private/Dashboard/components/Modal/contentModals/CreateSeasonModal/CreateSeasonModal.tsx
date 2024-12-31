import { LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useApi } from '../../../../../../hooks';
import {
  createSeason,
  toggleSeasonStatus,
} from '../../../../../../services/firebase';
import {
  useCommunityDetailsStore,
  useCommunityStore,
  useModalStore,
} from '../../../../../../stores/zubstand';
import './CreateSeasonModal.css';

export const CreteSeasonModal = () => {
  const { closeModal } = useModalStore();
  const [newSeasonName, setNewSeasonName] = useState('');
  const [selectedTab, setSelectedTab] = useState<'create' | 'manage'>('create');
  const { selectedCommunityId } = useCommunityStore();
  const { addSeason, updateSeasonStatus, details } = useCommunityDetailsStore();

  const {
    loading: createLoading,
    data: createResponse,
    execute: createNewSeason,
    error: createError,
  } = useApi({ request: createSeason });

  const {
    loading: toggleLoading,
    data: toggleResponse,
    error: toggleError,
    execute: toggleStatus,
  } = useApi({ request: toggleSeasonStatus });

  useEffect(() => {
    if (createResponse?.data) {
      console.log(createResponse.data);
      addSeason(selectedCommunityId!, {
        id: createResponse.data.seasonId,
        name: newSeasonName,
        status: createResponse.data.status,
      });
      closeModal();
    }

    if (toggleResponse?.data) {
      console.log(toggleResponse?.data);
      updateSeasonStatus(
        selectedCommunityId!,
        toggleResponse.data.seasonId,
        toggleResponse.data.newStatus
      );
    }
  }, [
    addSeason,
    closeModal,
    createResponse?.data,
    newSeasonName,
    selectedCommunityId,
    toggleResponse?.data,
    updateSeasonStatus,
  ]);

  const handleCreateSeason = async () => {
    if (!newSeasonName.trim()) return;

    await createNewSeason({
      communityId: selectedCommunityId,
      name: newSeasonName,
    });
  };

  const handleToggleSeasonStatus = async (seasonId: string) => {
    if (!seasonId) return;

    await toggleStatus({ communityId: selectedCommunityId, seasonId });
  };

  const { seasons } = details[selectedCommunityId || ''];
  console.log(seasons);
  return (
    <>
      <Tabs
        value={selectedTab}
        onChange={(_, value) => setSelectedTab(value)}
        className="season-tabs"
      >
        <Tab
          label="Crear Temporada"
          value="create"
          disabled={toggleLoading || createLoading}
        />
        <Tab label="Administrar Temporadas" value="manage" />
      </Tabs>
      {selectedTab === 'create' && (
        <Box className="season-create">
          <TextField
            label="Nombre de la Temporada"
            variant="outlined"
            fullWidth
            value={newSeasonName}
            onChange={(e) => setNewSeasonName(e.target.value)}
            className="season-input"
          />
          <LoadingButton
            onClick={handleCreateSeason}
            variant="contained"
            color="primary"
            type="submit"
            loading={createLoading}
            size="large"
            loadingIndicator="Cargando"
            sx={{ mb: 2 }}
          >
            Crear season
          </LoadingButton>
          {createError && (
            <Typography variant="body2" color="error" sx={{ mt: 2 }}>
              {createError.message}
            </Typography>
          )}
        </Box>
      )}
      {selectedTab === 'manage' && (
        <Box className="season-manage">
          {seasons && (
            <List>
              {seasons.map((season) => (
                <ListItem key={season.id} className="season-item">
                  <ListItemText
                    primary={season.name}
                    secondary={`Estado: ${season.status}`}
                  />
                  <Button
                    variant="contained"
                    disabled={toggleLoading}
                    color={season.status === 'active' ? 'secondary' : 'primary'}
                    onClick={() => handleToggleSeasonStatus(season.id)}
                    className="season-toggle-button"
                  >
                    {season.status === 'active' ? 'Finalizar' : 'Activar'}
                  </Button>
                </ListItem>
              ))}
            </List>
          )}
          {toggleError && (
            <Typography variant="body2" color="error" sx={{ mt: 2 }}>
              {toggleError.message}
            </Typography>
          )}
        </Box>
      )}
    </>
  );
};
