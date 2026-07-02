import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, MenuItem, CircularProgress, Alert, Box,
} from '@mui/material';
import { getAdminUsers } from '../services/api';

const schema = z.object({
  name: z.string().min(1, 'Store name is required').max(100, 'Name too long'),
  email: z.string().email('Must be a valid email'),
  address: z.string().min(1, 'Address is required').max(400, 'Address too long'),
  ownerId: z.string().min(1, 'Owner is required'),
});

const CreateStoreDialog = ({ open, onClose, onSubmit }) => {
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  // Load store owners when dialog opens
  useEffect(() => {
    if (open) {
      setServerError('');
      reset();
      getAdminUsers({ role: 'STORE_OWNER' })
        .then((res) => setOwners(res.data.data))
        .catch(() => setOwners([]));
    }
  }, [open, reset]);

  const handleFormSubmit = async (data) => {
    setLoading(true);
    setServerError('');
    try {
      await onSubmit(data);
      reset();
      onClose();
    } catch (err) {
      setServerError(err.response?.data?.message || 'Failed to create store');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle fontWeight={700}>Add New Store</DialogTitle>
      <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            {serverError && <Alert severity="error">{serverError}</Alert>}
            <TextField
              id="store-name-field"
              label="Store Name"
              {...register('name')}
              error={!!errors.name}
              helperText={errors.name?.message}
              fullWidth
            />
            <TextField
              id="store-email-field"
              label="Store Email"
              type="email"
              {...register('email')}
              error={!!errors.email}
              helperText={errors.email?.message}
              fullWidth
            />
            <TextField
              id="store-address-field"
              label="Address"
              multiline
              rows={2}
              {...register('address')}
              error={!!errors.address}
              helperText={errors.address?.message}
              fullWidth
            />
            <Controller
              name="ownerId"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  id="store-owner-field"
                  select
                  label="Store Owner"
                  {...field}
                  error={!!errors.ownerId}
                  helperText={errors.ownerId?.message || 'Only users with STORE_OWNER role appear here'}
                  fullWidth
                >
                  {owners.length === 0 ? (
                    <MenuItem disabled>No store owners available</MenuItem>
                  ) : (
                    owners.map((o) => (
                      <MenuItem key={o.id} value={o.id}>
                        {o.name} ({o.email})
                      </MenuItem>
                    ))
                  )}
                </TextField>
              )}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button id="cancel-create-store-btn" onClick={onClose} disabled={isSubmitting || loading}>
            Cancel
          </Button>
          <Button
            id="submit-create-store-btn"
            type="submit"
            variant="contained"
            disabled={isSubmitting || loading}
            startIcon={loading && <CircularProgress size={16} />}
          >
            Create Store
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreateStoreDialog;
