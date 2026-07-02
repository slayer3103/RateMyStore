import { useState, useEffect } from 'react';
import {
  Box, Drawer, AppBar, Toolbar, Typography, IconButton, List,
  ListItem, ListItemButton, ListItemIcon, ListItemText, Avatar,
  Tooltip, Divider, useTheme, useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon, Dashboard, People, Store, Star, BarChart,
  Logout, Brightness4, Brightness7, StoreMallDirectory, Lock,
  ChevronLeft, ChevronRight,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useThemeContext } from '../contexts/ThemeContext';

const DRAWER_WIDTH = 260;
const DRAWER_WIDTH_COLLAPSED = 72;

const adminNavItems = [
  { label: 'Dashboard', icon: <Dashboard />, path: '/admin/dashboard' },
  { label: 'Users', icon: <People />, path: '/admin/users' },
  { label: 'Stores', icon: <Store />, path: '/admin/stores' },
];

const userNavItems = [
  { label: 'Browse Stores', icon: <Store />, path: '/stores' },
  { label: 'My Ratings', icon: <Star />, path: '/stores' },
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
  const [collapsed, setCollapsed] = useState(() => {
    return localStorage.getItem('sidebarCollapsed') === 'true';
  });
  const { user, logout } = useAuth();
  const { mode, toggleTheme } = useThemeContext();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = getNavItems(user?.role);
  const currentDrawerWidth = collapsed && !isMobile ? DRAWER_WIDTH_COLLAPSED : DRAWER_WIDTH;

  const handleToggleCollapse = () => {
    setCollapsed((prev) => {
      const newVal = !prev;
      localStorage.setItem('sidebarCollapsed', newVal);
      return newVal;
    });
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', overflowX: 'hidden' }}>
      {/* Logo */}
      <Box sx={{ 
        p: collapsed && !isMobile ? 2 : 3, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: collapsed && !isMobile ? 'center' : 'flex-start', 
        gap: 1.5,
        transition: 'padding 0.3s'
      }}>
        <StoreMallDirectory sx={{ color: 'primary.main', fontSize: 32, flexShrink: 0 }} />
        <Typography 
          variant="h6" 
          fontWeight={700} 
          color="primary"
          sx={{ 
            opacity: collapsed && !isMobile ? 0 : 1, 
            width: collapsed && !isMobile ? 0 : 'auto', 
            overflow: 'hidden', 
            transition: 'all 0.3s ease',
            whiteSpace: 'nowrap'
          }}
        >
          RateMyStore
        </Typography>
      </Box>
      <Divider />

      {/* User Info */}
      <Box sx={{ 
        px: collapsed && !isMobile ? 2 : 2.5, 
        py: 2, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: collapsed && !isMobile ? 'center' : 'flex-start',
        gap: 1.5,
        transition: 'padding 0.3s'
      }}>
        <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40, flexShrink: 0 }}>
          {user?.name?.[0]?.toUpperCase()}
        </Avatar>
        <Box sx={{ 
          opacity: collapsed && !isMobile ? 0 : 1, 
          width: collapsed && !isMobile ? 0 : 'auto', 
          overflow: 'hidden', 
          transition: 'all 0.3s ease',
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
          const isActive = location.pathname === item.path;
          return (
            <Tooltip title={collapsed && !isMobile ? item.label : ''} placement="right" key={item.label}>
              <ListItem disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={() => { navigate(item.path); if (isMobile) setMobileOpen(false); }}
                  selected={isActive}
                  sx={{
                    borderRadius: 2,
                    justifyContent: collapsed && !isMobile ? 'center' : 'flex-start',
                    px: collapsed && !isMobile ? 1 : 2,
                    '&.Mui-selected': {
                      bgcolor: 'primary.main',
                      color: 'white',
                      '& .MuiListItemIcon-root': { color: 'white' },
                      '&:hover': { bgcolor: 'primary.dark' },
                    },
                  }}
                >
                  <ListItemIcon sx={{ 
                    minWidth: collapsed && !isMobile ? 0 : 40, 
                    mr: collapsed && !isMobile ? 0 : 2,
                    justifyContent: 'center',
                    color: isActive ? 'white' : 'text.secondary' 
                  }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.label} 
                    sx={{ 
                      opacity: collapsed && !isMobile ? 0 : 1, 
                      width: collapsed && !isMobile ? 0 : 'auto', 
                      overflow: 'hidden', 
                      transition: 'all 0.3s ease',
                      whiteSpace: 'nowrap',
                      m: 0
                    }} 
                  />
                </ListItemButton>
              </ListItem>
            </Tooltip>
          );
        })}
      </List>

      <Divider />

      {/* Collapse Toggle */}
      <Box sx={{ p: 1, display: { xs: 'none', md: 'flex' }, justifyContent: collapsed ? 'center' : 'flex-end' }}>
        <IconButton onClick={handleToggleCollapse}>
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
        </IconButton>
      </Box>
      <Divider sx={{ display: { xs: 'none', md: 'block' } }} />

      {/* Logout */}
      <Box sx={{ p: 2 }}>
        <Tooltip title={collapsed && !isMobile ? 'Logout' : ''} placement="right">
          <ListItemButton onClick={handleLogout} sx={{ 
            borderRadius: 2, 
            color: 'error.main',
            justifyContent: collapsed && !isMobile ? 'center' : 'flex-start',
            px: collapsed && !isMobile ? 1 : 2
          }}>
            <ListItemIcon sx={{ 
              minWidth: collapsed && !isMobile ? 0 : 40, 
              mr: collapsed && !isMobile ? 0 : 2,
              justifyContent: 'center',
              color: 'error.main' 
            }}>
              <Logout />
            </ListItemIcon>
            <ListItemText 
              primary="Logout" 
              sx={{ 
                opacity: collapsed && !isMobile ? 0 : 1, 
                width: collapsed && !isMobile ? 0 : 'auto', 
                overflow: 'hidden', 
                transition: 'all 0.3s ease',
                whiteSpace: 'nowrap',
                m: 0
              }} 
            />
          </ListItemButton>
        </Tooltip>
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
          width: { md: `calc(100% - ${currentDrawerWidth}px)` },
          ml: { md: `${currentDrawerWidth}px` },
          borderBottom: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
          color: 'text.primary',
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
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
          '& .MuiDrawer-paper': {
            width: currentDrawerWidth,
            boxSizing: 'border-box',
            borderRight: '1px solid',
            borderColor: 'divider',
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
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
          width: { xs: '100%', md: `calc(100% - ${currentDrawerWidth}px)` },
          maxWidth: '100%',
          minHeight: '100vh',
          bgcolor: 'background.default',
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          overflowX: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Toolbar />
        <Box sx={{ maxWidth: 1400, width: '100%', mx: 'auto' }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default AppLayout;
