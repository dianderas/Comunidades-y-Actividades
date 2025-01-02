import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import { Box, Button, Divider } from '@mui/material';
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
import RoomList from '../../../../components/RoomList/RoomList';
import { RoomData } from '../../../../services/firebase/dtos';
import { onValue, ref } from 'firebase/database';
import { database } from '../../../../services/firebase/config';

interface Props {
  communityId: string | null;
}

export const CommunityDetails = ({ communityId }: Props) => {
  const { openModal } = useModalStore();
  const { getCommunity } = useCommunityStore();
  const [community, setCommunity] = useState<Community | undefined>();
  const [rooms, setRooms] = useState<RoomData[]>([]);

  const {
    details,
    setCommunityDetails,
    getCommunityDetails: getStoredCommunityDetails,
  } = useCommunityDetailsStore();

  const { data, execute } = useApi({
    request: getCommunityDetails,
  });

  useEffect(() => {
    const roomsRef = ref(database, 'rooms');

    const unsubscribe = onValue(roomsRef, (snapshot) => {
      const roomsData = snapshot.val();
      if (roomsData) {
        console.log(roomsData);
        const roomsArray = Object.entries(roomsData).map(([roomId, data]) => ({
          ...(data as RoomData),
          id: roomId,
        }));
        setRooms(roomsArray);
      } else {
        setRooms([]);
      }
    });

    return () => unsubscribe();
  }, []);

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
        <RoomList
          rooms={rooms.map((r) => ({
            id: r.id,
            name: r.name,
            status: r.status,
          }))}
        />
        <Box sx={{ display: 'flex', columnGap: '16px' }}>
          <TopMembersCard members={communityDetails.members} />
          <LastActivitiesCard activities={communityDetails.activities} />
        </Box>
      </div>
      <div className="dashboard-members dashboard-paper"></div>
    </>
  ) : (
    <>
      <div className="dashboard-channels dashboard-paper"></div>
      <div className="dashboard-content dashboard-paper"></div>
      <div className="dashboard-members dashboard-paper"></div>
    </>
  );
};
