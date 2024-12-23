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

interface Props {
  activities: unknown[];
}

export const LastActivitiesCard = ({ activities }: Props) => {
  return (
    <Box sx={{ minWidth: 275, mt: 4 }}>
      <Card variant="outlined">
        <CardContent>
          <Typography
            gutterBottom
            sx={{ color: 'text.secondary', fontSize: 14 }}
          >
            Season Primavera
          </Typography>
          <Typography variant="h5" component="div">
            Historial de actividades
          </Typography>
          <List dense>
            {activities &&
              activities.map((_, index) => (
                <ListItem key={index}>
                  <ListItemAvatar>
                    <Avatar>
                      <FaceIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary="activity 1" />
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
