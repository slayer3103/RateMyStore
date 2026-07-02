import { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography, Box, Rating as MuiRating, CircularProgress, Alert,
} from '@mui/material';
import { submitRating } from '../services/api';

const labels = { 1: 'Poor', 2: 'Fair', 3: 'Good', 4: 'Very Good', 5: 'Excellent' };

const RateStoreDialog = ({ open, store, existingRating, onClose, onSuccess, onError }) => {
  const [value, setValue] = useState(existingRating?.rating || 0);
  const [hover, setHover] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!value) {
      setError('Please select a rating');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await submitRating({ storeId: store.id, rating: value });
      onSuccess(existingRating ? 'Rating updated!' : 'Rating submitted!');
      setValue(0);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to submit rating';
      setError(msg);
      onError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError('');
    setValue(existingRating?.rating || 0);
    onClose();
  };

  const displayValue = hover !== -1 ? hover : value;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle fontWeight={700}>
        {existingRating ? 'Edit Your Rating' : 'Rate This Store'}
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          {store?.name}
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, py: 2 }}>
          <MuiRating
            id="store-rating-input"
            value={value}
            onChange={(_, newVal) => setValue(newVal)}
            onChangeActive={(_, newHover) => setHover(newHover)}
            size="large"
            sx={{ fontSize: '3rem' }}
          />
          {displayValue > 0 && (
            <Typography variant="body1" fontWeight={600} color="primary">
              {labels[displayValue]}
            </Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button id="cancel-rate-btn" onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          id="submit-rate-btn"
          variant="contained"
          onClick={handleSubmit}
          disabled={loading || !value}
          startIcon={loading && <CircularProgress size={16} />}
        >
          {existingRating ? 'Update Rating' : 'Submit Rating'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RateStoreDialog;
