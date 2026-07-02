import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box, Typography, Card, CardContent, TextField, InputAdornment,
  Grid, Chip, Alert, CircularProgress, Rating as MuiRating,
  Button, Snackbar, Avatar, Skeleton, useTheme,
} from '@mui/material';
import { Search, Store, LocationOn, Star } from '@mui/icons-material';
import { useLocation } from 'react-router-dom';
import AppLayout from '../layouts/AppLayout';
import { getStores, getUserRatings } from '../services/api';
import { useToast } from '../hooks/useToast';
import RateStoreDialog from '../components/RateStoreDialog';

const StoreCard = ({ store, myRating, onRate }) => {
  const theme = useTheme();
  
  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: `0 12px 28px ${theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.1)'}`,
        },
        borderRadius: 3,
        overflow: 'visible'
      }}
    >
      <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2.5, p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          <Avatar 
            sx={{ 
              bgcolor: 'primary.main', 
              width: 56, 
              height: 56, 
              fontSize: 24,
              boxShadow: `0 4px 12px ${theme.palette.primary.main}40`,
              fontWeight: 700
            }}
          >
            {store.name[0]}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0, pt: 0.5 }}>
            <Typography variant="h5" fontWeight={800} noWrap sx={{ mb: 0.5 }}>{store.name}</Typography>
            <Typography variant="body2" color="text.secondary" noWrap>{store.email}</Typography>
          </Box>
        </Box>

        {/* Address */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, flexGrow: 1 }}>
          <LocationOn sx={{ color: 'text.disabled', fontSize: 20, mt: 0.2 }} />
          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
            {store.address}
          </Typography>
        </Box>

        {/* Avg Rating & My Rating Box */}
        <Box 
          sx={{ 
            bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)',
            borderRadius: 2,
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 1.5
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Star sx={{ color: 'warning.main', fontSize: 28 }} />
              <Typography variant="h6" fontWeight={700} color="warning.main">
                {store.averageRating || 'N/A'}
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" fontWeight={600}>
              {store._count?.ratings || 0} reviews
            </Typography>
          </Box>
          
          {myRating && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
              <Typography variant="caption" color="text.secondary" fontWeight={600}>You rated:</Typography>
              <MuiRating value={myRating.rating} size="small" readOnly sx={{ color: 'primary.main' }} />
            </Box>
          )}
        </Box>
      </CardContent>

      {/* Rate Button */}
      <Box sx={{ px: 3, pb: 3, pt: 0 }}>
        <Button
          id={`rate-store-${store.id}`}
          variant={myRating ? 'outlined' : 'contained'}
          fullWidth
          onClick={() => onRate(store, myRating)}
          size="large"
          sx={{ 
            borderRadius: 2,
            py: 1.2,
            fontWeight: 700,
            textTransform: 'none',
            fontSize: '1rem',
            borderWidth: myRating ? 2 : 0,
            '&:hover': { borderWidth: myRating ? 2 : 0 }
          }}
        >
          {myRating ? 'Edit Your Rating' : 'Rate This Store'}
        </Button>
      </Box>
    </Card>
  );
};

const StoresPage = () => {
  const { toast, showSuccess, showError, hideToast } = useToast();
  const [stores, setStores] = useState([]);
  const [myRatings, setMyRatings] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [rateDialog, setRateDialog] = useState({ open: false, store: null, existingRating: null });
  
  const location = useLocation();
  const isMyRatingsFilter = location.search.includes('filter=my-ratings');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [storesRes, ratingsRes] = await Promise.all([
        getStores({ search }),
        getUserRatings(),
      ]);
      setStores(storesRes.data.data);

      // Build a map of storeId -> rating
      const ratingsMap = {};
      ratingsRes.data.data.forEach((r) => {
        ratingsMap[r.storeId] = r;
      });
      setMyRatings(ratingsMap);
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to load stores');
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const timeout = setTimeout(fetchData, 300);
    return () => clearTimeout(timeout);
  }, [fetchData]);

  const handleRateSuccess = (message) => {
    showSuccess(message);
    setRateDialog({ open: false, store: null, existingRating: null });
    fetchData();
  };

  const displayedStores = useMemo(() => {
    if (!isMyRatingsFilter) return stores;
    return stores.filter(store => myRatings[store.id] !== undefined);
  }, [stores, myRatings, isMyRatingsFilter]);

  return (
    <AppLayout>
      <Box sx={{ pb: 6 }}>
        <Box sx={{ mb: 6, mt: 2 }}>
          <Typography variant="h3" fontWeight={800} gutterBottom sx={{ letterSpacing: '-0.02em' }}>
            {isMyRatingsFilter ? 'My Ratings' : 'Browse Stores'}
          </Typography>
          <Typography variant="h6" color="text.secondary" fontWeight={400}>
            {isMyRatingsFilter 
              ? 'View and edit the stores you have previously rated' 
              : 'Discover and rate stores in your area'}
          </Typography>
        </Box>

        {/* Search */}
        <Box sx={{ maxWidth: 600, mb: 6 }}>
          <TextField
            id="stores-search"
            placeholder="Search stores by name, email, or address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{ 
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: 'primary.main' }} />
                </InputAdornment>
              ) 
            }}
            fullWidth
            size="medium"
            sx={{ 
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                bgcolor: 'background.paper',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                '& fieldset': { borderColor: 'transparent' },
                '&:hover fieldset': { borderColor: 'primary.light' },
                '&.Mui-focused fieldset': { borderColor: 'primary.main', borderWidth: 2 },
              }
            }}
          />
        </Box>

        {loading ? (
          <Grid container spacing={4}>
            {Array.from(new Array(6)).map((_, index) => (
              <Grid item xs={12} sm={6} md={6} lg={4} key={`skeleton-${index}`}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 3 }}>
                  <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2.5, p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Skeleton variant="circular" width={56} height={56} />
                      <Box sx={{ flex: 1 }}>
                        <Skeleton variant="text" width="70%" height={32} />
                        <Skeleton variant="text" width="50%" height={24} />
                      </Box>
                    </Box>
                    <Skeleton variant="text" width="90%" height={24} sx={{ mt: 1 }} />
                    <Skeleton variant="rounded" height={80} sx={{ borderRadius: 2 }} />
                  </CardContent>
                  <Box sx={{ px: 3, pb: 3 }}>
                    <Skeleton variant="rounded" height={48} sx={{ borderRadius: 2 }} />
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : displayedStores.length === 0 ? (
          <Box sx={{ textAlign: 'center', mt: 10, py: 8, bgcolor: 'background.paper', borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            <Store sx={{ fontSize: 80, color: 'primary.main', mb: 3, opacity: 0.8 }} />
            <Typography variant="h5" fontWeight={700} gutterBottom>
              {isMyRatingsFilter ? "You haven't rated any stores yet" : "No stores found"}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 400, mx: 'auto' }}>
              {isMyRatingsFilter 
                ? "Once you rate a store, it will appear here so you can easily manage your feedback." 
                : "Try adjusting your search query or check back later for new stores."}
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={4}>
            {displayedStores.map((store) => (
              <Grid item xs={12} sm={6} md={6} lg={4} key={store.id}>
                <StoreCard
                  store={store}
                  myRating={myRatings[store.id] || null}
                  onRate={(s, r) => setRateDialog({ open: true, store: s, existingRating: r })}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      <RateStoreDialog
        open={rateDialog.open}
        store={rateDialog.store}
        existingRating={rateDialog.existingRating}
        onClose={() => setRateDialog({ open: false, store: null, existingRating: null })}
        onSuccess={handleRateSuccess}
        onError={(msg) => showError(msg)}
      />

      <Snackbar open={toast.open} autoHideDuration={4000} onClose={hideToast} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={hideToast} severity={toast.severity} sx={{ width: '100%' }}>{toast.message}</Alert>
      </Snackbar>
    </AppLayout>
  );
};

export default StoresPage;
