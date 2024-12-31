import EditIcon from '@mui/icons-material/Edit';
import EventIcon from '@mui/icons-material/Event';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import SettingsIcon from '@mui/icons-material/Settings';
import UpgradeIcon from '@mui/icons-material/Upgrade';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CloseIcon from '@mui/icons-material/Close';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import {
  Button,
  Divider,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from '@mui/material';
import { useState } from 'react';
import './CommunityOptions.css';
import { useModalStore } from '../../../../../../stores/zubstand';

interface Props {
  name: string;
}

export const CommunityOptions = ({ name }: Props) => {
  const { openModal } = useModalStore();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOpenModal = (modalName: string) => {
    openModal(modalName);
    setAnchorEl(null);
  };

  return (
    <div>
      <Button onClick={handleClick} className="option-menu">
        <p>{name}</p>
        {anchorEl ? <CloseIcon fontSize="small" /> : <KeyboardArrowDownIcon />}
      </Button>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={handleClose}>
          <ListItemText>Mejorar la comunidad</ListItemText>
          <ListItemIcon className="option-menu-item-icon">
            <UpgradeIcon />
          </ListItemIcon>
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => handleOpenModal('inviteLink')}>
          <ListItemText>Invitar gente</ListItemText>
          <ListItemIcon className="option-menu-item-icon">
            <PersonAddIcon />
          </ListItemIcon>
        </MenuItem>
        <MenuItem onClick={() => handleOpenModal('createSeason')}>
          <ListItemText>Crear temporada</ListItemText>
          <ListItemIcon className="option-menu-item-icon">
            <EventIcon />
          </ListItemIcon>
        </MenuItem>
        <MenuItem onClick={() => handleOpenModal('selectActivity')}>
          <ListItemText>Crear Actividad</ListItemText>
          <ListItemIcon className="option-menu-item-icon">
            <SportsEsportsIcon />
          </ListItemIcon>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleClose}>
          <ListItemText>Ajustes del servidor</ListItemText>
          <ListItemIcon className="option-menu-item-icon">
            <SettingsIcon />
          </ListItemIcon>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemText>Editar perfil de comunidad</ListItemText>
          <ListItemIcon className="option-menu-item-icon">
            <EditIcon />
          </ListItemIcon>
        </MenuItem>
      </Menu>
    </div>
  );
};
