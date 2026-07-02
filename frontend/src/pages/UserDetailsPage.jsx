import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, Card, CardContent, Grid, Button,
  Divider, Skeleton, Chip, Alert, Avatar, Rating as MuiRating,
  List, ListItem, ListItemText, ListItemAvatar,
} from '@mui/material';
import {
  ArrowBack, Person, Email, Home, Star, Store,
  AdminPanelSettings, DateRange
} from '@mui/icons-material';
import AppLayout from '../layouts/AppLayout';
import { getAdminUser } from '../services/api';

const roleColor = { ADMIN: 'error', USER: 'primary', STORE_OWNER: 'secondary' };

const UserDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getAdminUser(id);
        setUser(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load user details');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  if (loading) {
    return (
      <AppLayout>
        <Box sx={{ pb: 6 }}>
          <Skeleton variant="text" width={200} height={40} sx={{ mb: 4 }} />
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Skeleton variant="rounded" height={300} sx={{ borderRadius: 3 }} />
            </Grid>
            <Grid item xs={12} md={8}>
              <Skeleton variant="rounded" height={300} sx={{ borderRadius: 3 }} />
            </Grid>
          </Grid>
        </Box>
      </AppLayout>
    );
  }

  if (error || !user) {
    return (
      <AppLayout>
        <Alert severity="error" sx={{ mt: 4 }}>{error || 'User not found'}</Alert>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/admin/users')} sx={{ mt: 2 }}>
          Back to Users
        </Button>
      </AppLayout>
    );
  }

  const isStoreOwner = user.role === 'STORE_OWNER';
  const assignedStore = isStoreOwner && user.stores && user.stores.length > 0 ? user.stores[0] : null;

  return (
    <AppLayout>
      <Box sx={{ pb: 6 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 2 }}>
          <Button 
            startIcon={<ArrowBack />} 
            onClick={() => navigate('/admin/users')}
            color="inherit"
            sx={{ fontWeight: 600, bgcolor: 'background.paper', px: 2, py: 1, borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
          >
            Back
          </Button>
          <Typography variant="h4" fontWeight={800} sx={{ letterSpacing: '-0.02em' }}>
            User Details
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Left Column: Basic Info */}
          <Grid item xs={12} md={5} lg={4}>
            <Card sx={{ borderRadius: 4, boxShadow: '0 8px 24px rgba(0,0,0,0.05)', height: '100%' }}>
              <CardContent sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <Avatar 
                  sx={{ 
                    width: 100, 
                    height: 100, 
                    bgcolor: `${roleColor[user.role]}.main`, 
                    fontSize: 40,
                    fontWeight: 700,
                    boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
                    mb: 3
                  }}
                >
                  {user.name[0]}
                </Avatar>
                
                <Typography variant="h5" fontWeight={800} gutterBottom>
                  {user.name}
                </Typography>
                <Chip 
                  label={user.role.replace('_', ' ')} 
                  color={roleColor[user.role]} 
                  sx={{ fontWeight: 700, px: 1, mb: 4 }} 
                />

                <Divider sx={{ width: '100%', mb: 3 }} />

                <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2.5, textAlign: 'left' }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <Email color="action" />
                    <Box>
                      <Typography variant="caption" color="text.secondary" fontWeight={600} display="block">EMAIL ADDRESS</Typography>
                      <Typography variant="body2" fontWeight={500}>{user.email}</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <Home color="action" />
                    <Box>
                      <Typography variant="caption" color="text.secondary" fontWeight={600} display="block">PHYSICAL ADDRESS</Typography>
                      <Typography variant="body2" fontWeight={500}>{user.address}</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <DateRange color="action" />
                    <Box>
                      <Typography variant="caption" color="text.secondary" fontWeight={600} display="block">JOINED DATE</Typography>
                      <Typography variant="body2" fontWeight={500}>{new Date(user.createdAt).toLocaleDateString()}</Typography>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Right Column: Role-Specific Details */}
          <Grid item xs={12} md={7} lg={8}>
            {isStoreOwner ? (
              <Card sx={{ borderRadius: 4, boxShadow: '0 8px 24px rgba(0,0,0,0.05)', mb: 4 }}>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <Store color="secondary" sx={{ fontSize: 28 }} />
                    <Typography variant="h5" fontWeight={700}>Assigned Store</Typography>
                  </Box>
                  <Divider sx={{ mb: 3 }} />
                  
                  {assignedStore ? (
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ p: 3, bgcolor: 'background.default', borderRadius: 3 }}>
                          <Typography variant="caption" color="text.secondary" fontWeight={600} display="block" mb={1}>STORE NAME</Typography>
                          <Typography variant="h6" fontWeight={700}>{assignedStore.name}</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ p: 3, bgcolor: 'background.default', borderRadius: 3 }}>
                          <Typography variant="caption" color="text.secondary" fontWeight={600} display="block" mb={1}>STORE RATINGS</Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Star sx={{ color: 'warning.main' }} />
                            <Typography variant="h6" fontWeight={700}>
                              {assignedStore.ratings?.length > 0 
                                ? (assignedStore.ratings.reduce((a, b) => a + b.rating, 0) / assignedStore.ratings.length).toFixed(1) 
                                : 'N/A'
                              }
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              ({assignedStore.ratings?.length || 0} total)
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                      <Grid item xs={12}>
                        <Box sx={{ p: 3, bgcolor: 'background.default', borderRadius: 3 }}>
                          <Typography variant="caption" color="text.secondary" fontWeight={600} display="block" mb={1}>STORE ADDRESS</Typography>
                          <Typography variant="body1">{assignedStore.address}</Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  ) : (
                    <Alert severity="warning" sx={{ borderRadius: 2 }}>
                      This user is designated as a Store Owner but has not been assigned a store yet.
                    </Alert>
                  )}
                </CardContent>
              </Card>
            ) : null}

            {/* User Ratings (If they have made any) */}
            <Card sx={{ borderRadius: 4, boxShadow: '0 8px 24px rgba(0,0,0,0.05)' }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Star color="warning" sx={{ fontSize: 28 }} />
                  <Typography variant="h5" fontWeight={700}>User's Ratings</Typography>
                </Box>
                <Divider sx={{ mb: 3 }} />
                
                {user.ratings && user.ratings.length > 0 ? (
                  <List sx={{ p: 0 }}>
                    {user.ratings.map((r, index) => (
                      <Box key={index}>
                        <ListItem sx={{ px: 2, py: 2, bgcolor: 'background.default', borderRadius: 2, mb: 2 }}>
                          <ListItemAvatar>
                            <Avatar sx={{ bgcolor: 'primary.main', fontWeight: 600 }}>{r.store.name[0]}</Avatar>
                          </ListItemAvatar>
                          <ListItemText 
                            primary={<Typography variant="subtitle1" fontWeight={700}>{r.store.name}</Typography>}
                            secondary={
                              <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                                <MuiRating value={r.rating} size="small" readOnly />
                              </Box>
                            }
                          />
                        </ListItem>
                      </Box>
                    ))}
                  </List>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                      This user hasn't rated any stores yet.
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </AppLayout>
  );
};

export default UserDetailsPage;
