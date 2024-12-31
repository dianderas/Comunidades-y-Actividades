import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getUserCommunities } from '../../services/firebase';
import { useCommunityStore } from '../../stores/zubstand';
import { useAuthStore } from '../../stores/zubstand/authStore';
import { AppBar, CommunityDetails, CommunnitiesList } from './components';
import './Dashboard.css';
import { useApi } from '../../hooks';

export const Dashboard = () => {
  const { user } = useAuthStore();
  const {
    setCommunities,
    selectCommunity,
    selectedCommunityId,
    communities: storedCommunities,
  } = useCommunityStore();
  const { communityId } = useParams();
  const navigate = useNavigate();

  const { execute, loading, data } = useApi({
    request: getUserCommunities,
  });

  useEffect(() => {
    if (storedCommunities.length === 0 && user) {
      const fetchCommunities = async () => {
        await execute(user.uid);
      };

      fetchCommunities();
    }
  }, [execute, storedCommunities.length, user]);

  useEffect(() => {
    if (data && storedCommunities.length === 0) {
      setCommunities(data);
      if (data.length === 0) {
        return;
      }

      if (!communityId) {
        const firstId = data[0].id;
        selectCommunity(firstId);
        navigate(`/community/${firstId}`, { replace: true });
      } else {
        const exists = data.some((c) => c.id === communityId);
        if (exists) {
          selectCommunity(communityId);
        } else {
          const firstId = data[0].id;
          selectCommunity(firstId);
          navigate(`/community/${firstId}`, { replace: true });
        }
      }
    }
  }, [
    communityId,
    data,
    navigate,
    selectCommunity,
    setCommunities,
    storedCommunities.length,
  ]);

  return (
    <>
      <AppBar />
      <main className="dashboard-container">
        <div className="dashboard-comunities dashboard-paper">
          <CommunnitiesList loading={loading} />
        </div>
        <CommunityDetails communityId={selectedCommunityId} />
      </main>
    </>
  );
};

export default Dashboard;
