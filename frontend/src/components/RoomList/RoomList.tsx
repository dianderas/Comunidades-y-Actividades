import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from '@mui/material';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';

type Room = {
  id: string;
  name: string;
  status: string;
};

type RoomListProps = {
  rooms: Room[];
};

const RoomList: React.FC<RoomListProps> = ({ rooms }) => {
  const navigate = useNavigate();
  const { communityId } = useParams();

  const handleJoin = (roomId: string) => {
    navigate(`/community/${communityId}/activity/room/${roomId}`);
  };

  return (
    <Box sx={{ minWidth: 275, width: '100%' }}>
      <Card variant="outlined">
        <CardContent>
          <Typography
            gutterBottom
            sx={{ color: 'text.secondary', fontSize: 14 }}
          >
            Rooms Disponibles
          </Typography>
          <List dense>
            {rooms.length === 0 ? (
              <Typography variant="body1">
                No hay rooms disponibles en este momento.
              </Typography>
            ) : (
              rooms.map((r) => (
                <ListItem key={r.id}>
                  <ListItemAvatar>
                    <Avatar>
                      <SportsEsportsIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={r.name} />
                  <Button onClick={() => handleJoin(r.id)}>Ver</Button>
                </ListItem>
              ))
            )}
          </List>
        </CardContent>
      </Card>
    </Box>
  );
};

export default RoomList;
