import PlusOne from '@mui/icons-material/Add';
import { Avatar, IconButton, Skeleton, Stack, Tooltip } from '@mui/material';
import { useCommunityStore, useModalStore } from '../../../../stores/zubstand';
import './CommunitiesList.css';
import { useNavigate } from 'react-router-dom';

interface Props {
  loading: boolean;
}

export const CommunnitiesList = ({ loading }: Props) => {
  const { openModal } = useModalStore();

  const { communities, selectedCommunityId, selectCommunity } =
    useCommunityStore();
  const navigate = useNavigate();

  const handleOpenSelectActivityModal = () => {
    openModal('addCommunity');
  };

  const handleSelectCommunity = (id: string) => {
    selectCommunity(id);
    navigate(`/community/${id}`, { replace: true });
  };

  return (
    <Stack direction="column" alignItems="center">
      {loading ? (
        <>
          <Skeleton variant="circular" className="community-item-avatar" />
          <Skeleton variant="circular" className="community-item-avatar" />
        </>
      ) : (
        communities.map((community, index) => (
          <div
            key={index}
            className={`community-item ${
              community.id === selectedCommunityId ? 'selected' : ''
            }`}
          >
            <div className="community-item-selected"></div>
            <Tooltip title={community.name} placement="right" arrow>
              <Avatar
                className="community-item-avatar"
                onClick={() => handleSelectCommunity(community.id)}
              >
                {community.name.substring(0, 1).toUpperCase()}
              </Avatar>
            </Tooltip>
          </div>
        ))
      )}
      <Tooltip title="Añadir comunidad" placement="right" arrow>
        <IconButton
          className="icon-plus"
          aria-label="add"
          size="large"
          onClick={handleOpenSelectActivityModal}
        >
          <PlusOne />
        </IconButton>
      </Tooltip>
    </Stack>
  );
};
