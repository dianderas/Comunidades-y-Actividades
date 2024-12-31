import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import { Button, Divider } from '@mui/material';
import { useEffect, useState } from 'react';
import { useApi } from '../../../../hooks';
import { getCommunityDetails } from '../../../../services/firebase';
import {
  Community,
  useCommunityDetailsStore,
  useCommunityStore,
  useModalStore,
} from '../../../../stores/zubstand';
import {
  CommunityOptions,
  LastActivitiesCard,
  TopMembersCard,
} from './components';
import './CommunityDetails.css';

interface Props {
  communityId: string | null;
}

export const CommunityDetails = ({ communityId }: Props) => {
  const { openModal } = useModalStore();
  const { getCommunity } = useCommunityStore();
  const [community, setCommunity] = useState<Community | undefined>();

  const {
    details,
    setCommunityDetails,
    getCommunityDetails: getStoredCommunityDetails,
  } = useCommunityDetailsStore();

  const { data, execute } = useApi({
    request: getCommunityDetails,
  });

  useEffect(() => {
    const fetchCommunityDetails = async () => {
      if (!communityId) return;

      const cachedDetails = getStoredCommunityDetails(communityId);

      if (!cachedDetails) {
        await execute(communityId);
      }
    };

    fetchCommunityDetails();
    setCommunity(getCommunity(communityId!));
  }, [communityId, execute, getCommunity, getStoredCommunityDetails]);

  useEffect(() => {
    if (data) {
      setCommunityDetails(data.data.communityId, data.data);
    }
  }, [data, getCommunity, setCommunity, setCommunityDetails]);

  const handleOpenSelectActivityModal = () => {
    openModal('selectActivity');
  };

  const communityDetails = details[communityId || ''];

  return communityDetails && community ? (
    <>
      <div className="dashboard-channels dashboard-paper">
        <CommunityOptions name={community.name} />
        <Divider />
        <Button
          onClick={handleOpenSelectActivityModal}
          className="button-activities"
        >
          <SportsEsportsIcon />
          <p>Actividades</p>
        </Button>
        <Divider />
      </div>
      <div className="dashboard-content dashboard-paper">
        <TopMembersCard members={communityDetails.members} />
        <LastActivitiesCard activities={communityDetails.activities} />
      </div>
      <div className="dashboard-members dashboard-paper">Columna D</div>
    </>
  ) : (
    <>
      <div className="dashboard-channels dashboard-paper"></div>
      <div className="dashboard-content dashboard-paper"></div>
      <div className="dashboard-members dashboard-paper"></div>
    </>
  );
};
