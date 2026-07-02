import { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, Card, CardContent, TextField, InputAdornment,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TableSortLabel, Chip, IconButton, Button, Dialog, DialogTitle,
  DialogContent, DialogActions, DialogContentText, Alert, CircularProgress,
  Tooltip, Rating as MuiRating, Snackbar, Avatar, Skeleton,
} from '@mui/material';
import { Search, Delete, Add, Store } from '@mui/icons-material';
import AppLayout from '../layouts/AppLayout';
import { getStores, createStore, deleteStore } from '../services/api';
import { useToast } from '../hooks/useToast';
import CreateStoreDialog from '../components/CreateStoreDialog';

const AdminStoresPage = () => {
  const { toast, showSuccess, showError, hideToast } = useToast();

  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [deleteDialog, setDeleteDialog] = useState({ open: false, store: null });
  const [createDialog, setCreateDialog] = useState(false);

  const fetchStores = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getStores({ search, sortBy, sortOrder });
      setStores(res.data.data);
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to load stores');
    } finally {
      setLoading(false);
    }
  }, [search, sortBy, sortOrder]);

  useEffect(() => {
    const timeout = setTimeout(fetchStores, 300);
    return () => clearTimeout(timeout);
  }, [fetchStores]);

  const handleSort = (column) => {
    if (sortBy === column) setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    else { setSortBy(column); setSortOrder('asc'); }
  };

  const handleDelete = async () => {
    try {
      await deleteStore(deleteDialog.store.id);
      showSuccess('Store deleted successfully');
      setDeleteDialog({ open: false, store: null });
      fetchStores();
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to delete store');
    }
  };

  const handleCreate = async (data) => {
    try {
      await createStore(data);
      showSuccess('Store created successfully');
      setCreateDialog(false);
      fetchStores();
    } catch (err) {
      throw err; // Let dialog handle field-level errors
    }
  };

  return (
    <AppLayout>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h4" fontWeight={700}>Store Management</Typography>
            <Typography variant="body2" color="text.secondary">{stores.length} stores found</Typography>
          </Box>
          <Button
            id="create-store-btn"
            variant="contained"
            startIcon={<Add />}
            onClick={() => setCreateDialog(true)}
          >
            Add Store
          </Button>
        </Box>

        {/* Search */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <TextField
              id="store-search"
              placeholder="Search by name, email, address..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{ startAdornment: <InputAdornment position="start"><Search /></InputAdornment> }}
              fullWidth
              size="small"
            />
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <TableContainer>
            <Table id="stores-table">
              <TableHead>
                <TableRow>
                  <TableCell>Store</TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortBy === 'email'}
                      direction={sortBy === 'email' ? sortOrder : 'asc'}
                      onClick={() => handleSort('email')}
                    >Email</TableSortLabel>
                  </TableCell>
                  <TableCell>Address</TableCell>
                  <TableCell>Owner</TableCell>
                  <TableCell>Avg. Rating</TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortBy === 'createdAt'}
                      direction={sortBy === 'createdAt' ? sortOrder : 'asc'}
                      onClick={() => handleSort('createdAt')}
                    >Created</TableSortLabel>
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
                      <TableCell><Skeleton variant="text" width="70%" /><Skeleton variant="text" width="50%" height={12} /></TableCell>
                      <TableCell><Skeleton variant="text" width={100} /></TableCell>
                      <TableCell><Skeleton variant="text" width={80} /></TableCell>
                      <TableCell align="center"><Skeleton variant="circular" width={24} height={24} sx={{ mx: 'auto' }} /></TableCell>
                    </TableRow>
                  ))
                ) : stores.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
                        <Store sx={{ fontSize: 48, color: 'text.secondary', opacity: 0.5 }} />
                        <Typography variant="h6" color="text.secondary">No stores found</Typography>
                        <Typography variant="body2" color="text.disabled">Adjust your search, or add a new store to the system.</Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  stores.map((store) => (
                    <TableRow key={store.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar sx={{ bgcolor: 'secondary.main', width: 32, height: 32, fontSize: 14 }}>
                            {store.name[0]}
                          </Avatar>
                          <Typography variant="body2" fontWeight={600}>{store.name}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{store.email}</TableCell>
                      <TableCell>
                        <Tooltip title={store.address}>
                          <Typography variant="body2" noWrap sx={{ maxWidth: 160 }}>{store.address}</Typography>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{store.owner?.name}</Typography>
                        <Typography variant="caption" color="text.secondary">{store.owner?.email}</Typography>
                      </TableCell>
                      <TableCell>
                        {store.averageRating ? (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <MuiRating value={store.averageRating} precision={0.1} readOnly size="small" />
                            <Typography variant="caption">({store.averageRating})</Typography>
                          </Box>
                        ) : (
                          <Typography variant="caption" color="text.secondary">No ratings yet</Typography>
                        )}
                      </TableCell>
                      <TableCell>{new Date(store.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell align="center">
                        <Tooltip title="Delete">
                          <IconButton
                            id={`delete-store-${store.id}`}
                            aria-label={`Delete store ${store.name}`}
                            size="small"
                            color="error"
                            onClick={() => setDeleteDialog({ open: true, store })}
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

      {/* Delete Confirmation */}
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, store: null })}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete <strong>{deleteDialog.store?.name}</strong>? All ratings for this store will be permanently removed.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button id="cancel-delete-store-btn" onClick={() => setDeleteDialog({ open: false, store: null })}>Cancel</Button>
          <Button id="confirm-delete-store-btn" onClick={handleDelete} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Create Store Dialog */}
      <CreateStoreDialog
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

export default AdminStoresPage;
