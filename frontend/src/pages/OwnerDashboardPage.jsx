import { useState, useEffect } from 'react';
import {
  Box, Typography, Card, CardContent, Chip, CircularProgress, Alert,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Rating as MuiRating, Avatar, Divider, Grid, Skeleton,
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
              {loading ? (
                <>
                  <Skeleton variant="text" width={200} height={32} />
                  <Skeleton variant="text" width={150} />
                  <Skeleton variant="text" width={250} />
                </>
              ) : (
                <>
                  <Typography variant="h5" fontWeight={700}>{data?.store?.name}</Typography>
                  <Typography variant="body2" color="text.secondary">{data?.store?.email}</Typography>
                  <Typography variant="body2" color="text.secondary">{data?.store?.address}</Typography>
                </>
              )}
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
                    {loading ? <Skeleton width={60} /> : (data?.averageRating ?? 'N/A')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">Average Rating</Typography>
                  {!loading && data?.averageRating && (
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
                  <Typography variant="h4" fontWeight={700}>
                    {loading ? <Skeleton width={40} /> : (data?.totalRatings ?? 0)}
                  </Typography>
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
                {loading ? (
                  Array.from(new Array(3)).map((_, index) => (
                    <TableRow key={`skeleton-${index}`}>
                      <TableCell><Skeleton variant="text" width="80%" /></TableCell>
                      <TableCell><Skeleton variant="text" width="100%" /></TableCell>
                      <TableCell><Skeleton variant="rounded" width={80} height={24} sx={{ borderRadius: 1 }} /></TableCell>
                      <TableCell><Skeleton variant="text" width={80} /></TableCell>
                    </TableRow>
                  ))
                ) : data?.raters?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 6 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
                        <Star sx={{ fontSize: 48, color: 'text.secondary', opacity: 0.5 }} />
                        <Typography variant="h6" color="text.secondary">No ratings yet</Typography>
                        <Typography variant="body2" color="text.disabled">When users rate your store, they will appear here.</Typography>
                      </Box>
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
