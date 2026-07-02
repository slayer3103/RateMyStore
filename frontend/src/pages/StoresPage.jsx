import { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, Card, CardContent, TextField, InputAdornment,
  Grid, Chip, Alert, CircularProgress, Rating as MuiRating,
  Button, Snackbar, Avatar,
} from '@mui/material';
import { Search, Store } from '@mui/icons-material';
import AppLayout from '../layouts/AppLayout';
import { getStores, getUserRatings } from '../services/api';
import { useToast } from '../hooks/useToast';
import RateStoreDialog from '../components/RateStoreDialog';

const StoreCard = ({ store, myRating, onRate }) => {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar sx={{ bgcolor: 'secondary.main', width: 44, height: 44, fontSize: 18 }}>
            {store.name[0]}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="h6" fontWeight={700} noWrap>{store.name}</Typography>
            <Typography variant="caption" color="text.secondary" noWrap>{store.email}</Typography>
          </Box>
        </Box>

        {/* Address */}
        <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1 }}>
          {store.address}
        </Typography>

        {/* Avg Rating */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <MuiRating value={store.averageRating || 0} precision={0.1} readOnly size="small" />
          <Typography variant="body2" color="text.secondary">
            {store.averageRating ? `${store.averageRating} (${store._count?.ratings} ratings)` : 'No ratings yet'}
          </Typography>
        </Box>

        {/* My Rating */}
        {myRating && (
          <Chip
            label={`Your rating: ${myRating.rating} ⭐`}
            size="small"
            color="primary"
            variant="outlined"
          />
        )}
      </CardContent>

      {/* Rate Button */}
      <Box sx={{ px: 2, pb: 2 }}>
        <Button
          id={`rate-store-${store.id}`}
          variant={myRating ? 'outlined' : 'contained'}
          fullWidth
          onClick={() => onRate(store, myRating)}
          size="small"
        >
          {myRating ? 'Edit Rating' : 'Rate This Store'}
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

  return (
    <AppLayout>
      <Box>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" fontWeight={700}>Browse Stores</Typography>
          <Typography variant="body2" color="text.secondary">
            Discover and rate stores near you
          </Typography>
        </Box>

        {/* Search */}
        <TextField
          id="stores-search"
          placeholder="Search stores by name, email, or address..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{ startAdornment: <InputAdornment position="start"><Search /></InputAdornment> }}
          fullWidth
          size="small"
          sx={{ mb: 3 }}
        />

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
            <CircularProgress size={48} />
          </Box>
        ) : stores.length === 0 ? (
          <Box sx={{ textAlign: 'center', mt: 8 }}>
            <Store sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">No stores found</Typography>
            <Typography variant="body2" color="text.secondary">Try adjusting your search</Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {stores.map((store) => (
              <Grid item xs={12} sm={6} md={4} key={store.id}>
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
