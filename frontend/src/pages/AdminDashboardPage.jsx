import { useState, useEffect } from 'react';
import {
  Box, Grid, Card, CardContent, Typography, Skeleton,
  Alert, Divider, Chip, useTheme
} from '@mui/material';
import { People, Store, Star, AdminPanelSettings } from '@mui/icons-material';
import AppLayout from '../layouts/AppLayout';
import { getDashboardStats } from '../services/api';

const StatCard = ({ icon, label, value, color }) => {
  const theme = useTheme();
  return (
    <Card 
      className="fade-in-up"
      sx={{
        height: '100%',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        '&:hover': {
          transform: 'translateY(-6px)',
          boxShadow: `0 12px 24px ${theme.palette[color].main}30`,
          borderColor: `${color}.main`,
        }
      }}
    >
      <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 3, p: 3 }}>
        <Box
          sx={{
            bgcolor: `${color}.main`,
            borderRadius: 3,
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            boxShadow: `0 4px 12px ${theme.palette[color].main}40`,
          }}
        >
          {icon}
        </Box>
        <Box>
          <Typography variant="h3" fontWeight={800} color="text.primary">
            {value !== undefined ? value : <Skeleton width={60} />}
          </Typography>
          <Typography variant="subtitle2" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
            {label}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getDashboardStats();
        setStats(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <AppLayout>
      <Box sx={{ pb: 6 }}>
        <Box sx={{ mb: 5, mt: 2 }}>
          <Typography variant="h3" fontWeight={800} gutterBottom sx={{ letterSpacing: '-0.02em' }}>
            System Overview
          </Typography>
          <Typography variant="h6" color="text.secondary" fontWeight={400}>
            Platform statistics and user distribution at a glance
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 4, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {/* Quick Stats Grid */}
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} lg={3}>
            <StatCard
              icon={<People sx={{ fontSize: 32 }} />}
              label="Total Users "
              value={stats?.totalUsers}
              color="primary"
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <StatCard
              icon={<Store sx={{ fontSize: 32 }} />}
              label="Total Stores "
              value={stats?.totalStores}
              color="secondary"
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <StatCard
              icon={<Star sx={{ fontSize: 32 }} />}
              label="Total Ratings "
              value={stats?.totalRatings}
              color="warning"
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <StatCard
              icon={<AdminPanelSettings sx={{ fontSize: 32 }} />}
              label="System Admins "
              value={stats?.roleBreakdown?.ADMIN}
              color="error"
            />
          </Grid>
        </Grid>

        <Box sx={{ height: 64 }} /> {/* Explicit large spacer block to guarantee gap */}

        {/* Extended Stats */}
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" fontWeight={700} gutterBottom>
                  User Role Distribution
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={4}>
                  Breakdown of accounts by their designated platform role
                </Typography>
                
                <Grid container spacing={3}>
                  {loading ? (
                    Array.from(new Array(3)).map((_, i) => (
                      <Grid item xs={12} md={4} key={i}>
                        <Skeleton variant="rounded" height={80} sx={{ borderRadius: 2 }} />
                      </Grid>
                    ))
                  ) : (
                    <>
                      <Grid item xs={12} md={4}>
                        <Box sx={{ 
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                          p: 3, bgcolor: 'background.default', borderRadius: 2,
                          border: '1px solid', borderColor: 'divider',
                          transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.02)' }
                        }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box sx={{ p: 1.5, bgcolor: 'primary.main', borderRadius: 2, display: 'flex', color: 'white' }}>
                              <People />
                            </Box>
                            <Typography fontWeight={700} variant="h6">Normal Users : </Typography>
                          </Box>
                          <Typography variant="h4" fontWeight={800} color="primary.main">
                            {stats?.roleBreakdown?.USER ?? 0}
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={12} md={4}>
                        <Box sx={{ 
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                          p: 3, bgcolor: 'background.default', borderRadius: 2,
                          border: '1px solid', borderColor: 'divider',
                          transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.02)' }
                        }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box sx={{ p: 1.5, bgcolor: 'secondary.main', borderRadius: 2, display: 'flex', color: 'white' }}>
                              <Store />
                            </Box>
                            <Typography fontWeight={700} variant="h6">Store Owners : </Typography>
                          </Box>
                          <Typography variant="h4" fontWeight={800} color="secondary.main">
                            {stats?.roleBreakdown?.STORE_OWNER ?? 0}
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={12} md={4}>
                        <Box sx={{ 
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                          p: 3, bgcolor: 'background.default', borderRadius: 2,
                          border: '1px solid', borderColor: 'divider',
                          transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.02)' }
                        }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box sx={{ p: 1.5, bgcolor: 'error.main', borderRadius: 2, display: 'flex', color: 'white' }}>
                              <AdminPanelSettings />
                            </Box>
                            <Typography fontWeight={700} variant="h6">Administrators : </Typography>
                          </Box>
                          <Typography variant="h4" fontWeight={800} color="error.main">
                            {stats?.roleBreakdown?.ADMIN ?? 0}
                          </Typography>
                        </Box>
                      </Grid>
                    </>
                  )}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </AppLayout>
  );
};

export default AdminDashboardPage;
