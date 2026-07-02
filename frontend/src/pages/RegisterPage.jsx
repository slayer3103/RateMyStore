import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box, Card, CardContent, TextField, Button, Typography,
  InputAdornment, IconButton, Snackbar, Alert, CircularProgress,
  Grid, useTheme,
} from '@mui/material';
import {
  Visibility, VisibilityOff, Lock, Email, Person, Home, StoreMallDirectory,
} from '@mui/icons-material';
import { registerSchema } from '../validations/schemas';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/useToast';

const RegisterPage = () => {
  const theme = useTheme();
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
      const msg = result.errors
        ? result.errors.map((e) => `${e.field}: ${e.message}`).join(', ')
        : result.message;
      showError(msg);
    }
  };

  const textFieldStyles = {
    '& .MuiOutlinedInput-root': {
      borderRadius: 2,
      bgcolor: 'background.paper',
      transition: 'all 0.2s',
      '&:hover': {
        bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
      },
      '&.Mui-focused': {
        boxShadow: `0 0 0 4px ${theme.palette.primary.main}20`,
      }
    }
  };

  return (
    <Box
      className="full-height flex-center"
      sx={{
        background: theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #0F0F1A 0%, #1A1A2E 50%, #16213E 100%)'
            : 'linear-gradient(135deg, #F4F4FF 0%, #EAE8FF 100%)',
        px: 2,
        py: 4,
      }}
    >
      <Card
        className="fade-in-up"
        sx={{ 
          maxWidth: 680, 
          width: '100%', 
          borderRadius: 4,
          boxShadow: theme.palette.mode === 'dark' ? '0 20px 40px rgba(0,0,0,0.4)' : '0 20px 40px rgba(0,0,0,0.08)',
        }}
      >
        <CardContent sx={{ p: { xs: 3, sm: 5 } }}>
          {/* Logo & Title */}
          <Box sx={{ textAlign: 'center', mb: 5 }}>
            <Box sx={{ 
              display: 'inline-flex', 
              p: 2, 
              borderRadius: '50%', 
              bgcolor: `${theme.palette.primary.main}15`,
              mb: 2
            }}>
              <StoreMallDirectory sx={{ fontSize: 40, color: 'primary.main' }} />
            </Box>
            <Typography variant="h4" fontWeight={800} gutterBottom sx={{ letterSpacing: '-0.02em' }}>
              Create an Account
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Join RateMyStore to discover and rate the best stores around you
            </Typography>
          </Box>

          {/* Form */}
          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <Grid container spacing={3}>
              {/* Full Name */}
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" fontWeight={600} mb={1}>Full Name</Typography>
                <TextField
                  id="register-name"
                  placeholder="e.g. John Doe"
                  fullWidth
                  {...register('name')}
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person sx={{ color: 'text.secondary' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={textFieldStyles}
                />
              </Grid>

              {/* Email */}
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" fontWeight={600} mb={1}>Email Address</Typography>
                <TextField
                  id="register-email"
                  placeholder="you@example.com"
                  type="email"
                  fullWidth
                  {...register('email')}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email sx={{ color: 'text.secondary' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={textFieldStyles}
                />
              </Grid>

              {/* Password */}
              <Grid item xs={12}>
                <Typography variant="subtitle2" fontWeight={600} mb={1}>Password</Typography>
                <TextField
                  id="register-password"
                  placeholder="8+ characters, uppercase, number & symbol"
                  type={showPassword ? 'text' : 'password'}
                  fullWidth
                  {...register('password')}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ color: 'text.secondary' }} />
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
                  sx={textFieldStyles}
                />
              </Grid>

              {/* Address */}
              <Grid item xs={12}>
                <Typography variant="subtitle2" fontWeight={600} mb={1}>Address</Typography>
                <TextField
                  id="register-address"
                  placeholder="Enter your full address"
                  fullWidth
                  multiline
                  rows={2}
                  {...register('address')}
                  error={!!errors.address}
                  helperText={errors.address?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                        <Home sx={{ color: 'text.secondary' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={textFieldStyles}
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
              sx={{ 
                mt: 5, 
                mb: 3, 
                py: 1.5,
                borderRadius: 2,
                fontSize: '1.1rem',
                fontWeight: 700,
                textTransform: 'none',
                boxShadow: `0 8px 16px ${theme.palette.primary.main}40`,
                transition: 'all 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: `0 12px 20px ${theme.palette.primary.main}60`,
                }
              }}
            >
              {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Create Account'}
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body1" color="text.secondary">
                Already have an account?{' '}
                <Link to="/login" style={{ textDecoration: 'none' }}>
                  <Typography component="span" color="primary" fontWeight={700}>
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
        <Alert onClose={hideToast} severity={toast.severity} sx={{ width: '100%', borderRadius: 2 }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default RegisterPage;
