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
import { ComuniityMember } from '../../../../../../stores/zubstand';

interface Props {
  members: ComuniityMember[];
}

export const TopMembersCard = ({ members }: Props) => {
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
            Top Ranking
          </Typography>
          <List dense>
            {members &&
              members.map((m, index) => (
                <ListItem key={index}>
                  <ListItemAvatar>
                    <Avatar src={m.avatar || undefined}>
                      {!m.avatar && <FaceIcon />}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={m.nickname} />
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
