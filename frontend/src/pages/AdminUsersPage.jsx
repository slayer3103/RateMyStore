import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box, Typography, Card, CardContent, TextField, InputAdornment,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TableSortLabel, Chip, IconButton, Button, Dialog, DialogTitle,
  DialogContent, DialogContentText, DialogActions, Alert, CircularProgress,
  Tooltip, MenuItem, Select, FormControl, InputLabel, Snackbar,
  Avatar, Skeleton, TablePagination, Grid
} from '@mui/material';
import { Search, Delete, Visibility, PersonAdd, FilterList } from '@mui/icons-material';
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
  
  // Filter states
  const [filterName, setFilterName] = useState('');
  const [filterEmail, setFilterEmail] = useState('');
  const [filterAddress, setFilterAddress] = useState('');
  const [filterRole, setFilterRole] = useState('');
  
  // Sorting state
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  
  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  const [deleteDialog, setDeleteDialog] = useState({ open: false, user: null });
  const [createDialog, setCreateDialog] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch all users once and handle granular filtering client-side
      const res = await getAdminUsers();
      setUsers(res.data.data);
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSort = (column) => {
    if (sortBy === column) setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    else { setSortBy(column); setSortOrder('asc'); }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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

  // Client-side filtering, sorting and pagination
  const filteredSortedPaginatedUsers = useMemo(() => {
    // Filter
    let result = users.filter((u) => {
      if (filterName && !u.name.toLowerCase().includes(filterName.toLowerCase())) return false;
      if (filterEmail && !u.email.toLowerCase().includes(filterEmail.toLowerCase())) return false;
      if (filterAddress && !u.address.toLowerCase().includes(filterAddress.toLowerCase())) return false;
      if (filterRole && u.role !== filterRole) return false;
      return true;
    });
    
    // Sort
    result.sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];
      
      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();
      
      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
    
    // Paginate
    const start = page * rowsPerPage;
    return {
      paginated: result.slice(start, start + rowsPerPage),
      totalFiltered: result.length
    };
  }, [users, filterName, filterEmail, filterAddress, filterRole, sortBy, sortOrder, page, rowsPerPage]);

  return (
    <AppLayout>
      <Box sx={{ pb: 6 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h4" fontWeight={700}>User Management</Typography>
            <Typography variant="body1" color="text.secondary">{users.length} total users</Typography>
          </Box>
          <Button
            id="create-user-btn"
            variant="contained"
            size="large"
            startIcon={<PersonAdd />}
            onClick={() => setCreateDialog(true)}
            sx={{ borderRadius: 2 }}
          >
            Add User
          </Button>
        </Box>

        {/* Filters */}
        <Card sx={{ mb: 4, borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <FilterList color="action" />
              <Typography variant="subtitle2" color="text.secondary" fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Filter Users
              </Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  placeholder="Filter by Name"
                  value={filterName}
                  onChange={(e) => { setFilterName(e.target.value); setPage(0); }}
                  fullWidth
                  size="small"
                  InputProps={{ startAdornment: <InputAdornment position="start"><Search fontSize="small" /></InputAdornment> }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  placeholder="Filter by Email"
                  value={filterEmail}
                  onChange={(e) => { setFilterEmail(e.target.value); setPage(0); }}
                  fullWidth
                  size="small"
                  InputProps={{ startAdornment: <InputAdornment position="start"><Search fontSize="small" /></InputAdornment> }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  placeholder="Filter by Address"
                  value={filterAddress}
                  onChange={(e) => { setFilterAddress(e.target.value); setPage(0); }}
                  fullWidth
                  size="small"
                  InputProps={{ startAdornment: <InputAdornment position="start"><Search fontSize="small" /></InputAdornment> }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl size="small" fullWidth>
                  <InputLabel id="role-filter-label">Filter by Role</InputLabel>
                  <Select
                    labelId="role-filter-label"
                    value={filterRole}
                    label="Filter by Role"
                    onChange={(e) => { setFilterRole(e.target.value); setPage(0); }}
                  >
                    <MenuItem value="">All Roles</MenuItem>
                    <MenuItem value="ADMIN">Admin</MenuItem>
                    <MenuItem value="USER">User</MenuItem>
                    <MenuItem value="STORE_OWNER">Store Owner</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Table */}
        <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <TableContainer>
            <Table id="users-table">
              <TableHead sx={{ bgcolor: 'background.default' }}>
                <TableRow>
                  <TableCell>
                    <TableSortLabel
                      active={sortBy === 'name'}
                      direction={sortBy === 'name' ? sortOrder : 'asc'}
                      onClick={() => handleSort('name')}
                    >Name</TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortBy === 'email'}
                      direction={sortBy === 'email' ? sortOrder : 'asc'}
                      onClick={() => handleSort('email')}
                    >Email</TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortBy === 'address'}
                      direction={sortBy === 'address' ? sortOrder : 'asc'}
                      onClick={() => handleSort('address')}
                    >Address</TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortBy === 'role'}
                      direction={sortBy === 'role' ? sortOrder : 'asc'}
                      onClick={() => handleSort('role')}
                    >Role</TableSortLabel>
                  </TableCell>
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
                  Array.from(new Array(5)).map((_, index) => (
                    <TableRow key={`skeleton-${index}`}>
                      <TableCell><Skeleton variant="text" width="60%" /></TableCell>
                      <TableCell><Skeleton variant="text" width="80%" /></TableCell>
                      <TableCell><Skeleton variant="text" width="90%" /></TableCell>
                      <TableCell><Skeleton variant="rounded" width={80} height={24} sx={{ borderRadius: 1 }} /></TableCell>
                      <TableCell><Skeleton variant="text" width={80} /></TableCell>
                      <TableCell align="center"><Skeleton variant="circular" width={24} height={24} sx={{ mx: 'auto' }} /></TableCell>
                    </TableRow>
                  ))
                ) : filteredSortedPaginatedUsers.paginated.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
                        <PersonAdd sx={{ fontSize: 48, color: 'text.secondary', opacity: 0.5 }} />
                        <Typography variant="h6" color="text.secondary">No users found</Typography>
                        <Typography variant="body2" color="text.disabled">Adjust your filters, or add a new user.</Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSortedPaginatedUsers.paginated.map((user) => (
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
                          sx={{ fontWeight: 600 }}
                        />
                      </TableCell>
                      <TableCell>
                        {new Date(user.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                          <Tooltip title="View Details">
                            <IconButton
                              id={`view-user-${user.id}`}
                              size="small"
                              color="primary"
                              onClick={() => navigate(`/admin/users/${user.id}`)}
                            >
                              <Visibility fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              id={`delete-user-${user.id}`}
                              aria-label={`Delete user ${user.name}`}
                              size="small"
                              color="error"
                              onClick={() => setDeleteDialog({ open: true, user })}
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredSortedPaginatedUsers.totalFiltered}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
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
        <Alert onClose={hideToast} severity={toast.severity} sx={{ width: '100%', borderRadius: 2 }}>{toast.message}</Alert>
      </Snackbar>
    </AppLayout>
  );
};

export default AdminUsersPage;
