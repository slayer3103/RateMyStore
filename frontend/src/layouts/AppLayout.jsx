import { useState } from 'react';
import {
  Box, Drawer, AppBar, Toolbar, Typography, IconButton, List,
  ListItem, ListItemButton, ListItemIcon, ListItemText, Avatar,
  Tooltip, Divider, useTheme, useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon, Dashboard, People, Store, Star, BarChart,
  Logout, Brightness4, Brightness7, StoreMallDirectory, Lock,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useThemeContext } from '../contexts/ThemeContext';

const DRAWER_WIDTH = 260;

const adminNavItems = [
  { label: 'Dashboard', icon: <Dashboard />, path: '/admin/dashboard' },
  { label: 'Users', icon: <People />, path: '/admin/users' },
  { label: 'Stores', icon: <Store />, path: '/admin/stores' },
];

const userNavItems = [
  { label: 'Browse Stores', icon: <Store />, path: '/stores' },
  { label: 'My Ratings', icon: <Star />, path: '/stores?filter=my-ratings' },
  { label: 'Change Password', icon: <Lock />, path: '/profile/password' },
];

const ownerNavItems = [
  { label: 'Dashboard', icon: <BarChart />, path: '/owner/dashboard' },
  { label: 'Change Password', icon: <Lock />, path: '/profile/password' },
];

const getNavItems = (role) => {
  if (role === 'ADMIN') return adminNavItems;
  if (role === 'STORE_OWNER') return ownerNavItems;
  return userNavItems;
};

const AppLayout = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const { mode, toggleTheme } = useThemeContext();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = getNavItems(user?.role);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', overflowX: 'hidden' }}>
      {/* Logo */}
      <Box sx={{ 
        p: 3, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'flex-start', 
        gap: 1.5,
      }}>
        <StoreMallDirectory sx={{ color: 'primary.main', fontSize: 32, flexShrink: 0 }} />
        <Typography 
          variant="h6" 
          fontWeight={700} 
          color="primary"
          sx={{ 
            overflow: 'hidden', 
            whiteSpace: 'nowrap'
          }}
        >
          RateMyStore
        </Typography>
      </Box>
      <Divider />

      {/* User Info */}
      <Box sx={{ 
        px: 2.5, 
        py: 2, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'flex-start',
        gap: 1.5,
      }}>
        <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40, flexShrink: 0 }}>
          {user?.name?.[0]?.toUpperCase()}
        </Avatar>
        <Box sx={{ 
          overflow: 'hidden', 
          whiteSpace: 'nowrap'
        }}>
          <Typography variant="body2" fontWeight={600} noWrap sx={{ maxWidth: 140 }}>
            {user?.name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {user?.role?.replace('_', ' ')}
          </Typography>
        </Box>
      </Box>
      <Divider />

      {/* Navigation */}
      <List sx={{ flex: 1, px: 1, py: 1 }}>
        {navItems.map((item) => {
          const itemPathname = item.path.split('?')[0];
          const itemSearch = item.path.split('?')[1] || '';
          
          let isActive = false;
          if (itemSearch) {
            isActive = location.pathname === itemPathname && location.search.includes(itemSearch);
          } else {
            // For exact matches without query params, ensure the current location doesn't have the specific filter
            isActive = location.pathname === itemPathname && !location.search.includes('filter=my-ratings');
          }
          
          // Fallback for paths that don't match the special logic
          if (item.path === '/profile/password' || item.path.startsWith('/admin') || item.path.startsWith('/owner')) {
             isActive = location.pathname === item.path;
          }

          return (
            <ListItem key={item.label} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => { navigate(item.path); if (isMobile) setMobileOpen(false); }}
                selected={isActive}
                sx={{
                  borderRadius: 2,
                  justifyContent: 'flex-start',
                  px: 2,
                  '&.Mui-selected': {
                    bgcolor: 'primary.main',
                    color: 'white',
                    '& .MuiListItemIcon-root': { color: 'white' },
                    '&:hover': { bgcolor: 'primary.dark' },
                  },
                }}
              >
                <ListItemIcon sx={{ 
                  minWidth: 40, 
                  mr: 2,
                  justifyContent: 'center',
                  color: isActive ? 'white' : 'text.secondary' 
                }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.label} 
                  sx={{ 
                    overflow: 'hidden', 
                    whiteSpace: 'nowrap',
                    m: 0
                  }} 
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider />

      {/* Logout */}
      <Box sx={{ p: 2 }}>
        <ListItemButton onClick={handleLogout} sx={{ 
          borderRadius: 2, 
          color: 'error.main',
          justifyContent: 'flex-start',
          px: 2
        }}>
          <ListItemIcon sx={{ 
            minWidth: 40, 
            mr: 2,
            justifyContent: 'center',
            color: 'error.main' 
          }}>
            <Logout />
          </ListItemIcon>
          <ListItemText 
            primary="Logout" 
            sx={{ 
              overflow: 'hidden', 
              whiteSpace: 'nowrap',
              m: 0
            }} 
          />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', overflowX: 'hidden' }}>
      {/* AppBar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { md: `${DRAWER_WIDTH}px` },
          borderBottom: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
          color: 'text.primary',
        }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            onClick={() => setMobileOpen(true)}
            sx={{ mr: 2, display: { md: 'none' } }}
            aria-label="open drawer"
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" fontWeight={600} sx={{ flexGrow: 1 }} noWrap>
            {navItems.find((n) => n.path === location.pathname)?.label || 'RateMyStore'}
          </Typography>
          <Tooltip title={mode === 'dark' ? 'Light mode' : 'Dark mode'}>
            <IconButton onClick={toggleTheme} id="theme-toggle-btn" aria-label="toggle theme">
              {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      {/* Drawer - mobile */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Drawer - desktop */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          width: { md: DRAWER_WIDTH },
          flexShrink: { md: 0 },
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            borderRight: '1px solid',
            borderColor: 'divider',
            overflowX: 'hidden',
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          width: { xs: '100%', md: `calc(100% - ${DRAWER_WIDTH}px)` },
          maxWidth: '100%',
          minHeight: '100vh',
          bgcolor: 'background.default',
          overflowX: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Toolbar />
        <Box className="fade-in-up" sx={{ maxWidth: 1400, width: '100%', mx: 'auto' }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default AppLayout;
