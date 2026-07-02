import { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, Card, CardContent, TextField, InputAdornment,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TableSortLabel, Chip, IconButton, Button, Dialog, DialogTitle,
  DialogContent, DialogContentText, DialogActions, Alert, CircularProgress,
  Tooltip, MenuItem, Select, FormControl, InputLabel, Snackbar,
  Avatar,
} from '@mui/material';
import { Search, Delete, Visibility, PersonAdd } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../layouts/AppLayout';
import { getAdminUsers, adminDeleteUser, adminCreateUser } from '../services/api';
import { useToast } from '../hooks/useToast';
import CreateUserDialog from '../components/CreateUserDialog';

const roleColor = { ADMIN: 'error', USER: 'primary', STORE_OWNER: 'secondary' };

const AdminUsersPage = () => {
  const navigate = useNavigate();
  const { toast, showSuccess, showError, hideToast } = useToast();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [deleteDialog, setDeleteDialog] = useState({ open: false, user: null });
  const [createDialog, setCreateDialog] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAdminUsers({ search, role: roleFilter || undefined, sortBy, sortOrder });
      setUsers(res.data.data);
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [search, roleFilter, sortBy, sortOrder]);

  useEffect(() => {
    const timeout = setTimeout(fetchUsers, 300); // debounce search
    return () => clearTimeout(timeout);
  }, [fetchUsers]);

  const handleSort = (column) => {
    if (sortBy === column) setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    else { setSortBy(column); setSortOrder('asc'); }
  };

  const handleDelete = async () => {
    try {
      await adminDeleteUser(deleteDialog.user.id);
      showSuccess('User deleted successfully');
      setDeleteDialog({ open: false, user: null });
      fetchUsers();
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleCreate = async (data) => {
    try {
      await adminCreateUser(data);
      showSuccess('User created successfully');
      setCreateDialog(false);
      fetchUsers();
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to create user');
    }
  };

  return (
    <AppLayout>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h4" fontWeight={700}>User Management</Typography>
            <Typography variant="body2" color="text.secondary">{users.length} users found</Typography>
          </Box>
          <Button
            id="create-user-btn"
            variant="contained"
            startIcon={<PersonAdd />}
            onClick={() => setCreateDialog(true)}
          >
            Add User
          </Button>
        </Box>

        {/* Filters */}
        <Card sx={{ mb: 3 }}>
          <CardContent sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField
              id="user-search"
              placeholder="Search by name, email, address..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{ startAdornment: <InputAdornment position="start"><Search /></InputAdornment> }}
              sx={{ flexGrow: 1, minWidth: 200 }}
              size="small"
            />
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel id="role-filter-label">Role</InputLabel>
              <Select
                labelId="role-filter-label"
                id="role-filter"
                label="Role"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <MenuItem value="">All Roles</MenuItem>
                <MenuItem value="ADMIN">Admin</MenuItem>
                <MenuItem value="USER">User</MenuItem>
                <MenuItem value="STORE_OWNER">Store Owner</MenuItem>
              </Select>
            </FormControl>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <TableContainer>
            <Table id="users-table">
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortBy === 'email'}
                      direction={sortBy === 'email' ? sortOrder : 'asc'}
                      onClick={() => handleSort('email')}
                    >Email</TableSortLabel>
                  </TableCell>
                  <TableCell>Address</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortBy === 'createdAt'}
                      direction={sortBy === 'createdAt' ? sortOrder : 'asc'}
                      onClick={() => handleSort('createdAt')}
                    >Joined</TableSortLabel>
                  </TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                      <Typography color="text.secondary">No users found</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32, fontSize: 14 }}>
                            {user.name[0]}
                          </Avatar>
                          <Typography variant="body2" fontWeight={600}>{user.name}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Tooltip title={user.address}>
                          <Typography variant="body2" noWrap sx={{ maxWidth: 180 }}>{user.address}</Typography>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={user.role.replace('_', ' ')}
                          color={roleColor[user.role]}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        {new Date(user.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Delete">
                          <IconButton
                            id={`delete-user-${user.id}`}
                            size="small"
                            color="error"
                            onClick={() => setDeleteDialog({ open: true, user })}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, user: null })}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete <strong>{deleteDialog.user?.name}</strong>? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button id="cancel-delete-btn" onClick={() => setDeleteDialog({ open: false, user: null })}>Cancel</Button>
          <Button id="confirm-delete-btn" onClick={handleDelete} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Create User Dialog */}
      <CreateUserDialog
        open={createDialog}
        onClose={() => setCreateDialog(false)}
        onSubmit={handleCreate}
      />

      <Snackbar open={toast.open} autoHideDuration={4000} onClose={hideToast} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={hideToast} severity={toast.severity} sx={{ width: '100%' }}>{toast.message}</Alert>
      </Snackbar>
    </AppLayout>
  );
};

export default AdminUsersPage;
