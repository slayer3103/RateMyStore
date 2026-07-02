import { useState, useEffect } from 'react';
import {
  Box, Typography, Card, CardContent, Chip, CircularProgress, Alert,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Rating as MuiRating, Avatar, Divider, Grid,
} from '@mui/material';
import { Store, Star, People } from '@mui/icons-material';
import AppLayout from '../layouts/AppLayout';
import { getOwnerDashboard } from '../services/api';

const OwnerDashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getOwnerDashboard()
      .then((res) => setData(res.data.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <AppLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
          <CircularProgress size={48} />
        </Box>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <Alert severity="error">{error}</Alert>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Box>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Owner Dashboard
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={4}>
          Your store's performance at a glance
        </Typography>

        {/* Store Info */}
        <Card sx={{ mb: 3 }}>
          <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'secondary.main', width: 56, height: 56, fontSize: 24 }}>
              <Store />
            </Avatar>
            <Box>
              <Typography variant="h5" fontWeight={700}>{data?.store?.name}</Typography>
              <Typography variant="body2" color="text.secondary">{data?.store?.email}</Typography>
              <Typography variant="body2" color="text.secondary">{data?.store?.address}</Typography>
            </Box>
          </CardContent>
        </Card>

        {/* Stats */}
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} sm={6}>
            <Card>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ bgcolor: 'warning.main', borderRadius: 2, p: 1.5, display: 'flex' }}>
                  <Star sx={{ color: 'white', fontSize: 28 }} />
                </Box>
                <Box>
                  <Typography variant="h4" fontWeight={700}>
                    {data?.averageRating ?? 'N/A'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">Average Rating</Typography>
                  {data?.averageRating && (
                    <MuiRating value={data.averageRating} precision={0.1} readOnly size="small" />
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Card>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ bgcolor: 'primary.main', borderRadius: 2, p: 1.5, display: 'flex' }}>
                  <People sx={{ color: 'white', fontSize: 28 }} />
                </Box>
                <Box>
                  <Typography variant="h4" fontWeight={700}>{data?.totalRatings ?? 0}</Typography>
                  <Typography variant="body2" color="text.secondary">Total Ratings</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Raters Table */}
        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Users Who Rated Your Store
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </CardContent>
          <TableContainer>
            <Table id="raters-table">
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Rating</TableCell>
                  <TableCell>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.raters?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">No ratings yet</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  data?.raters?.map((r) => (
                    <TableRow key={r.ratingId} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32, fontSize: 14 }}>
                            {r.user.name[0]}
                          </Avatar>
                          <Typography variant="body2" fontWeight={600}>{r.user.name}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{r.user.email}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <MuiRating value={r.rating} readOnly size="small" />
                          <Chip label={r.rating} size="small" color="warning" variant="outlined" />
                        </Box>
                      </TableCell>
                      <TableCell>{new Date(r.ratedAt).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </Box>
    </AppLayout>
  );
};

export default OwnerDashboardPage;
