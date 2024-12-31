import FaceIcon from '@mui/icons-material/Face';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from '@mui/material';
import { BaseInfoActivity } from '../../../../../../stores/zubstand';
import { useNavigate, useParams } from 'react-router-dom';

interface Props {
  activities: BaseInfoActivity[];
}

export const LastActivitiesCard = ({ activities }: Props) => {
  const navigate = useNavigate();
  const { communityId } = useParams();
  return (
    <Box sx={{ minWidth: 275, mt: 4, width: '50%' }}>
      <Card variant="outlined">
        <CardContent>
          <Typography
            gutterBottom
            sx={{ color: 'text.secondary', fontSize: 14 }}
          >
            Last update: today
          </Typography>
          <Typography variant="h5" component="div">
            Historial de actividades
          </Typography>
          <List dense>
            {activities &&
              activities.map((activity, index) => (
                <ListItem key={index}>
                  <ListItemAvatar>
                    <Avatar>
                      <FaceIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={`(${activity.seasonName}) ${activity.type} ${activity.name}`}
                  />
                  <Button
                    onClick={() =>
                      navigate(
                        `/community/${communityId}/activity/trivia/${activity.id}`
                      )
                    }
                  >
                    Admin
                  </Button>
                </ListItem>
              ))}
          </List>
        </CardContent>
        <CardActions>
          <Button size="small">Mas detalles</Button>
        </CardActions>
      </Card>
    </Box>
  );
};
