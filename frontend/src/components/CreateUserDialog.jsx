import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  TextField, Grid, MenuItem, CircularProgress, InputAdornment, IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
  nameValidation, emailValidation, passwordValidation, addressValidation,
} from '../validations/schemas';

const createUserSchema = z.object({
  name: nameValidation,
  email: emailValidation,
  password: passwordValidation,
  address: addressValidation,
  role: z.enum(['ADMIN', 'USER', 'STORE_OWNER'], { required_error: 'Role is required' }),
});

const CreateUserDialog = ({ open, onClose, onSubmit }) => {
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(createUserSchema),
    defaultValues: { role: 'USER' },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFormSubmit = async (data) => {
    await onSubmit(data);
    reset();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create New User</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          <Grid item xs={12}>
            <TextField id="new-user-name" label="Full Name" fullWidth {...register('name')} error={!!errors.name} helperText={errors.name?.message || '20–60 characters'} />
          </Grid>
          <Grid item xs={12}>
            <TextField id="new-user-email" label="Email" type="email" fullWidth {...register('email')} error={!!errors.email} helperText={errors.email?.message} />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="new-user-password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              {...register('password')}
              error={!!errors.password}
              helperText={errors.password?.message || '8–16 chars, uppercase & special char'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword((s) => !s)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField id="new-user-address" label="Address" fullWidth multiline rows={2} {...register('address')} error={!!errors.address} helperText={errors.address?.message} />
          </Grid>
          <Grid item xs={12}>
            <TextField id="new-user-role" label="Role" fullWidth select defaultValue="USER" {...register('role')} error={!!errors.role} helperText={errors.role?.message}>
              <MenuItem value="USER">User</MenuItem>
              <MenuItem value="ADMIN">Admin</MenuItem>
              <MenuItem value="STORE_OWNER">Store Owner</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button id="cancel-create-user-btn" onClick={handleClose}>Cancel</Button>
        <Button
          id="submit-create-user-btn"
          variant="contained"
          disabled={isSubmitting}
          onClick={handleSubmit(handleFormSubmit)}
        >
          {isSubmitting ? <CircularProgress size={20} color="inherit" /> : 'Create User'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateUserDialog;
