import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box, Card, CardContent, TextField, Button, Typography,
  InputAdornment, IconButton, Snackbar, Alert, CircularProgress,
  Divider, Grid,
} from '@mui/material';
import {
  Visibility, VisibilityOff, Lock, Email, Person, Home, StoreMallDirectory,
} from '@mui/icons-material';
import { registerSchema } from '../validations/schemas';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/useToast';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const { toast, showError, hideToast } = useToast();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (data) => {
    const result = await registerUser(data);
    if (result.success) {
      const role = result.user.role;
      if (role === 'ADMIN') navigate('/admin/dashboard');
      else if (role === 'STORE_OWNER') navigate('/owner/dashboard');
      else navigate('/stores');
    } else {
      // Show field-level or general error
      const msg = result.errors
        ? result.errors.map((e) => `${e.field}: ${e.message}`).join(', ')
        : result.message;
      showError(msg);
    }
  };

  return (
    <Box
      className="full-height flex-center"
      sx={{
        background: (theme) =>
          theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #0F0F1A 0%, #1A1A2E 50%, #16213E 100%)'
            : 'linear-gradient(135deg, #F4F4FF 0%, #EAE8FF 100%)',
        px: 2,
        py: 4,
      }}
    >
      <Card
        className="fade-in-up"
        sx={{ maxWidth: 520, width: '100%', p: { xs: 2, sm: 3 } }}
      >
        <CardContent>
          {/* Logo & Title */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <StoreMallDirectory sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
            <Typography variant="h4" fontWeight={700} color="primary">
              Create Account
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={0.5}>
              Join RateMyStore today
            </Typography>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Form */}
          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <Grid container spacing={2}>
              {/* Full Name */}
              <Grid item xs={12}>
                <TextField
                  id="register-name"
                  label="Full Name"
                  fullWidth
                  {...register('name')}
                  error={!!errors.name}
                  helperText={errors.name?.message || '20–60 characters required'}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* Email */}
              <Grid item xs={12}>
                <TextField
                  id="register-email"
                  label="Email Address"
                  type="email"
                  fullWidth
                  {...register('email')}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* Password */}
              <Grid item xs={12}>
                <TextField
                  id="register-password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  fullWidth
                  {...register('password')}
                  error={!!errors.password}
                  helperText={errors.password?.message || '8–16 chars, uppercase & special char required'}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock color="primary" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          id="toggle-register-password-visibility"
                          onClick={() => setShowPassword((s) => !s)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* Address */}
              <Grid item xs={12}>
                <TextField
                  id="register-address"
                  label="Address"
                  fullWidth
                  multiline
                  rows={2}
                  {...register('address')}
                  error={!!errors.address}
                  helperText={errors.address?.message || 'Max 400 characters'}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                        <Home color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>

            <Button
              id="register-submit-btn"
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isSubmitting}
              sx={{ mt: 3, mb: 2, py: 1.5 }}
            >
              {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Create Account'}
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?{' '}
                <Link to="/login" style={{ textDecoration: 'none' }}>
                  <Typography component="span" color="primary" fontWeight={600}>
                    Sign In
                  </Typography>
                </Link>
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Toast Notification */}
      <Snackbar
        open={toast.open}
        autoHideDuration={5000}
        onClose={hideToast}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={hideToast} severity={toast.severity} sx={{ width: '100%' }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default RegisterPage;
