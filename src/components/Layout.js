import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Container,
  Divider
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import HistoryIcon from '@mui/icons-material/History';

function Layout({ children }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const navItems = [
    { text: 'Home', icon: <HomeIcon />, path: '/' },
    { text: 'Enter New Game', icon: <AddCircleOutlinedIcon />, path: '/enter-game' },
    { text: 'View Historical Stats', icon: <HistoryIcon />, path: '/historical-stats' }
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setDrawerOpen(false);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static" color="primary" elevation={4}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer(true)}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, cursor: 'pointer', fontWeight: 'bold', letterSpacing: 1 }}
            onClick={() => handleNavigation('/')}
          >
            CricketStats
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box
          sx={{ width: 250, height: '100%', bgcolor: 'background.default' }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'primary.main', color: 'primary.contrastText' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Navigation
            </Typography>
          </Box>
          <Divider />
          <List>
            {navItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  selected={location.pathname === item.path}
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    '&.Mui-selected': {
                      bgcolor: 'primary.light',
                      color: 'primary.contrastText',
                      '& .MuiListItemIcon-root': {
                        color: 'primary.contrastText'
                      }
                    },
                    '&:hover': {
                      bgcolor: 'action.hover'
                    }
                  }}
                >
                  <ListItemIcon sx={{ color: location.pathname === item.path ? 'primary.contrastText' : 'inherit' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      <Container component="main" sx={{ flexGrow: 1, py: 4 }}>
        {children}
      </Container>
    </Box>
  );
}

export default Layout;
