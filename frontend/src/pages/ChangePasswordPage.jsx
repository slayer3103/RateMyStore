import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Box, Typography, Card, CardContent, TextField, Button,
  Alert, CircularProgress, InputAdornment, IconButton, Snackbar,
} from '@mui/material';
import { Visibility, VisibilityOff, Lock } from '@mui/icons-material';
import AppLayout from '../layouts/AppLayout';
import { updatePassword } from '../services/api';
import { useToast } from '../hooks/useToast';

const schema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(16, 'Password must not exceed 16 characters')
      .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
      .regex(/[^A-Za-z0-9]/, 'Must contain at least one special character'),
    confirmPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

const PasswordField = ({ label, id, register, error, showPassword, onToggle }) => (
  <TextField
    id={id}
    label={label}
    type={showPassword ? 'text' : 'password'}
    {...register}
    error={!!error}
    helperText={error?.message}
    fullWidth
    InputProps={{
      endAdornment: (
        <InputAdornment position="end">
          <IconButton onClick={onToggle} edge="end" size="small">
            {showPassword ? <VisibilityOff /> : <Visibility />}
          </IconButton>
        </InputAdornment>
      ),
    }}
  />
);

const ChangePasswordPage = () => {
  const { toast, showSuccess, showError, hideToast } = useToast();
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    try {
      await updatePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      showSuccess('Password changed successfully!');
      reset();
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to update password');
    }
  };

  return (
    <AppLayout>
      <Box sx={{ maxWidth: 480 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
          <Lock color="primary" />
          <Box>
            <Typography variant="h4" fontWeight={700}>Change Password</Typography>
            <Typography variant="body2" color="text.secondary">
              Update your account password
            </Typography>
          </Box>
        </Box>

        <Card>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <PasswordField
                  id="current-password-field"
                  label="Current Password"
                  register={register('currentPassword')}
                  error={errors.currentPassword}
                  showPassword={showCurrent}
                  onToggle={() => setShowCurrent((p) => !p)}
                />
                <PasswordField
                  id="new-password-field"
                  label="New Password"
                  register={register('newPassword')}
                  error={errors.newPassword}
                  showPassword={showNew}
                  onToggle={() => setShowNew((p) => !p)}
                />
                <PasswordField
                  id="confirm-password-field"
                  label="Confirm New Password"
                  register={register('confirmPassword')}
                  error={errors.confirmPassword}
                  showPassword={showConfirm}
                  onToggle={() => setShowConfirm((p) => !p)}
                />

                <Alert severity="info" sx={{ fontSize: '0.8rem' }}>
                  Password must be 8–16 characters, include an uppercase letter and a special character.
                </Alert>

                <Button
                  id="change-password-btn"
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting}
                  startIcon={isSubmitting && <CircularProgress size={16} />}
                  size="large"
                  fullWidth
                >
                  Update Password
                </Button>
              </Box>
            </form>
          </CardContent>
        </Card>
      </Box>

      <Snackbar open={toast.open} autoHideDuration={4000} onClose={hideToast} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={hideToast} severity={toast.severity} sx={{ width: '100%' }}>{toast.message}</Alert>
      </Snackbar>
    </AppLayout>
  );
};

export default ChangePasswordPage;
