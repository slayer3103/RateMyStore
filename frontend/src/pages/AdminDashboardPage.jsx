import { useState, useEffect } from 'react';
import {
  Box, Grid, Card, CardContent, Typography, Skeleton,
  Alert, Divider, Chip,
} from '@mui/material';
import { People, Store, Star, AdminPanelSettings } from '@mui/icons-material';
import AppLayout from '../layouts/AppLayout';
import { getDashboardStats } from '../services/api';

const StatCard = ({ icon, label, value, color }) => (
  <Card className="fade-in-up">
    <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 3 }}>
      <Box
        sx={{
          bgcolor: `${color}.main`,
          borderRadius: 2,
          p: 1.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: 0.9,
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography variant="h4" fontWeight={700}>
          {value !== undefined ? value : <Skeleton width={40} />}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
      </Box>
    </CardContent>
  </Card>
);

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
      <Box>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Admin Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={4}>
          Overview of the entire platform
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<People sx={{ color: 'white', fontSize: 28 }} />}
              label="Total Users"
              value={stats?.totalUsers}
              color="primary"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<Store sx={{ color: 'white', fontSize: 28 }} />}
              label="Total Stores"
              value={stats?.totalStores}
              color="secondary"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<Star sx={{ color: 'white', fontSize: 28 }} />}
              label="Total Ratings"
              value={stats?.totalRatings}
              color="warning"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<AdminPanelSettings sx={{ color: 'white', fontSize: 28 }} />}
              label="Admins"
              value={stats?.roleBreakdown?.ADMIN}
              color="error"
            />
          </Grid>
        </Grid>

        {/* Role Breakdown */}
        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              User Role Breakdown
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              {loading ? (
                <>
                  <Skeleton variant="rounded" width={100} height={32} sx={{ borderRadius: 16 }} />
                  <Skeleton variant="rounded" width={100} height={32} sx={{ borderRadius: 16 }} />
                  <Skeleton variant="rounded" width={120} height={32} sx={{ borderRadius: 16 }} />
                </>
              ) : (
                <>
                  <Chip label={`Admins: ${stats?.roleBreakdown?.ADMIN ?? 0}`} color="error" variant="outlined" />
                  <Chip label={`Users: ${stats?.roleBreakdown?.USER ?? 0}`} color="primary" variant="outlined" />
                  <Chip label={`Store Owners: ${stats?.roleBreakdown?.STORE_OWNER ?? 0}`} color="secondary" variant="outlined" />
                </>
              )}
            </Box>
          </CardContent>
        </Card>
      </Box>
    </AppLayout>
  );
};

export default AdminDashboardPage;
