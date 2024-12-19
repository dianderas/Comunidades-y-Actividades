import AdbIcon from '@mui/icons-material/Adb';
import {
  Avatar,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import MuiAppBar from '@mui/material/AppBar';
import { useState } from 'react';
import { useApi } from '../../../../hooks';
import { logout } from '../../../../services/firebase';
import { useModalStore } from '../../../../stores/zubstand';

const settings = ['Profile', 'Account', 'Logout'];

export const AppBar = () => {
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const { openModal } = useModalStore();

  const { execute: logoutExecute } = useApi({
    request: logout,
  });

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = async (setting: string) => {
    setAnchorElUser(null);
    if (setting === 'Logout') {
      await logoutExecute();
    }
  };

  const handleOpenSelectActivityModal = () => {
    openModal('selectActivity');
  };

  return (
    <MuiAppBar position="static" elevation={0}>
      <Box sx={{ px: 2 }}>
        <Toolbar disableGutters>
          <AdbIcon sx={{ display: { xs: 'flex' }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            XD
          </Typography>
          <Box sx={{ ml: 'auto', display: 'flex', columnGap: 1 }}>
            <Box>
              <Button
                sx={{ backgroundColor: 'white' }}
                onClick={handleOpenSelectActivityModal}
                variant="outlined"
              >
                Nueva Actividad
              </Button>
            </Box>
            <Box>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem
                    key={setting}
                    onClick={() => handleCloseUserMenu(setting)}
                  >
                    <Typography sx={{ textAlign: 'center' }}>
                      {setting}
                    </Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Box>
        </Toolbar>
      </Box>
    </MuiAppBar>
  );
};
