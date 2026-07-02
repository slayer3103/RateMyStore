import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box, Typography, Card, CardContent, TextField, InputAdornment,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TableSortLabel, Chip, IconButton, Button, Dialog, DialogTitle,
  DialogContent, DialogActions, DialogContentText, Alert, CircularProgress,
  Tooltip, Rating as MuiRating, Snackbar, Avatar, Skeleton, TablePagination, Grid
} from '@mui/material';
import { Search, Delete, Add, Store, FilterList } from '@mui/icons-material';
import AppLayout from '../layouts/AppLayout';
import { getStores, createStore, deleteStore } from '../services/api';
import { useToast } from '../hooks/useToast';
import CreateStoreDialog from '../components/CreateStoreDialog';

const AdminStoresPage = () => {
  const { toast, showSuccess, showError, hideToast } = useToast();

  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter states
  const [filterName, setFilterName] = useState('');
  const [filterEmail, setFilterEmail] = useState('');
  const [filterAddress, setFilterAddress] = useState('');
  
  // Sorting state
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  
  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  const [deleteDialog, setDeleteDialog] = useState({ open: false, store: null });
  const [createDialog, setCreateDialog] = useState(false);

  const fetchStores = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getStores();
      setStores(res.data.data);
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to load stores');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

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

  // Client-side filtering, sorting and pagination
  const filteredSortedPaginatedStores = useMemo(() => {
    // Filter
    let result = stores.filter((s) => {
      if (filterName && !s.name.toLowerCase().includes(filterName.toLowerCase())) return false;
      if (filterEmail && !s.email.toLowerCase().includes(filterEmail.toLowerCase())) return false;
      if (filterAddress && !s.address.toLowerCase().includes(filterAddress.toLowerCase())) return false;
      return true;
    });

    // Sort
    result.sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];
      
      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();
      
      // Handle nulls/undefined for things like averageRating
      if (valA == null) valA = '';
      if (valB == null) valB = '';
      
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
  }, [stores, filterName, filterEmail, filterAddress, sortBy, sortOrder, page, rowsPerPage]);

  return (
    <AppLayout>
      <Box sx={{ pb: 6 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h4" fontWeight={700}>Store Management</Typography>
            <Typography variant="body1" color="text.secondary">{stores.length} total stores</Typography>
          </Box>
          <Button
            id="create-store-btn"
            variant="contained"
            size="large"
            startIcon={<Add />}
            onClick={() => setCreateDialog(true)}
            sx={{ borderRadius: 2 }}
          >
            Add Store
          </Button>
        </Box>

        {/* Filters */}
        <Card sx={{ mb: 4, borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <FilterList color="action" />
              <Typography variant="subtitle2" color="text.secondary" fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Filter Stores
              </Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField
                  placeholder="Filter by Name"
                  value={filterName}
                  onChange={(e) => { setFilterName(e.target.value); setPage(0); }}
                  fullWidth
                  size="small"
                  InputProps={{ startAdornment: <InputAdornment position="start"><Search fontSize="small" /></InputAdornment> }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  placeholder="Filter by Email"
                  value={filterEmail}
                  onChange={(e) => { setFilterEmail(e.target.value); setPage(0); }}
                  fullWidth
                  size="small"
                  InputProps={{ startAdornment: <InputAdornment position="start"><Search fontSize="small" /></InputAdornment> }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  placeholder="Filter by Address"
                  value={filterAddress}
                  onChange={(e) => { setFilterAddress(e.target.value); setPage(0); }}
                  fullWidth
                  size="small"
                  InputProps={{ startAdornment: <InputAdornment position="start"><Search fontSize="small" /></InputAdornment> }}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Table */}
        <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <TableContainer>
            <Table id="stores-table">
              <TableHead sx={{ bgcolor: 'background.default' }}>
                <TableRow>
                  <TableCell>
                    <TableSortLabel
                      active={sortBy === 'name'}
                      direction={sortBy === 'name' ? sortOrder : 'asc'}
                      onClick={() => handleSort('name')}
                    >Store Name</TableSortLabel>
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
                  <TableCell>Owner</TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortBy === 'averageRating'}
                      direction={sortBy === 'averageRating' ? sortOrder : 'asc'}
                      onClick={() => handleSort('averageRating')}
                    >Avg. Rating</TableSortLabel>
                  </TableCell>
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
                ) : filteredSortedPaginatedStores.paginated.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
                        <Store sx={{ fontSize: 48, color: 'text.secondary', opacity: 0.5 }} />
                        <Typography variant="h6" color="text.secondary">No stores found</Typography>
                        <Typography variant="body2" color="text.disabled">Adjust your filters, or add a new store to the system.</Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSortedPaginatedStores.paginated.map((store) => (
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
                        <Typography variant="body2" fontWeight={600}>{store.owner?.name}</Typography>
                        <Typography variant="caption" color="text.secondary">{store.owner?.email}</Typography>
                      </TableCell>
                      <TableCell>
                        {store.averageRating ? (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <MuiRating value={store.averageRating} precision={0.1} readOnly size="small" />
                            <Typography variant="body2" fontWeight={600}>({store.averageRating})</Typography>
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
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredSortedPaginatedStores.totalFiltered}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
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
        <Alert onClose={hideToast} severity={toast.severity} sx={{ width: '100%', borderRadius: 2 }}>{toast.message}</Alert>
      </Snackbar>
    </AppLayout>
  );
};

export default AdminStoresPage;
