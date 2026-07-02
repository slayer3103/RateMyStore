import { useState, useEffect, useMemo } from 'react';
import {
  Box, Typography, Card, CardContent, CircularProgress, Alert,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Rating as MuiRating, Avatar, Divider, Grid, Skeleton,
  TablePagination, TableSortLabel, useTheme, TextField
} from '@mui/material';
import { Store, Star, People } from '@mui/icons-material';
import AppLayout from '../layouts/AppLayout';
import { getOwnerDashboard } from '../services/api';

const OwnerDashboardPage = () => {
  const theme = useTheme();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [searchQuery, setSearchQuery] = useState('');

  // Table State
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortBy, setSortBy] = useState('ratedAt_desc');

  useEffect(() => {
    getOwnerDashboard()
      .then((res) => setData(res.data.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const sortedRaters = useMemo(() => {
    if (!data?.raters) return [];
    
    // 1. Filter by search query
    let filtered = data.raters;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(r => 
        r.user.name.toLowerCase().includes(q) || 
        r.user.email.toLowerCase().includes(q)
      );
    }

    // 2. Sort
    return [...filtered].sort((a, b) => {
      const [column, order] = sortBy.split('_');
      let valA, valB;
      
      if (column === 'rating') {
        valA = a.rating;
        valB = b.rating;
      } else if (column === 'userName') {
        valA = a.user.name.toLowerCase();
        valB = b.user.name.toLowerCase();
      } else {
        valA = new Date(a.ratedAt).getTime();
        valB = new Date(b.ratedAt).getTime();
      }
      
      if (valA < valB) return order === 'asc' ? -1 : 1;
      if (valA > valB) return order === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data?.raters, sortBy, searchQuery]);

  const paginatedRaters = sortedRaters.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  if (error) {
    return (
      <AppLayout>
        <Alert severity="error">{error}</Alert>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Box>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Owner Dashboard
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={4}>
          Your store's performance at a glance
        </Typography>

        {/* Store Info */}
        <Card sx={{ mb: 4 }}>
          <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Avatar sx={{ bgcolor: 'secondary.main', width: 56, height: 56, fontSize: 24 }}>
              <Store />
            </Avatar>
            <Box>
              {loading ? (
                <>
                  <Skeleton variant="text" width={200} height={32} />
                  <Skeleton variant="text" width={150} />
                  <Skeleton variant="text" width={250} />
                </>
              ) : (
                <>
                  <Typography variant="h5" fontWeight={700}>{data?.store?.name}</Typography>
                  <Typography variant="body2" color="text.secondary">{data?.store?.email}</Typography>
                  <Typography variant="body2" color="text.secondary">{data?.store?.address}</Typography>
                </>
              )}
            </Box>
          </CardContent>
        </Card>

        {/* Stats */}
        <Grid container spacing={4} mb={14}>
          <Grid item xs={12}>
            <Card 
              sx={{ 
                position: 'relative', 
                overflow: 'hidden',
                borderColor: 'warning.main',
                borderWidth: 2,
                boxShadow: `0 8px 24px ${theme.palette.warning.main}40`,
                animation: 'pulse 3s infinite',
                p: 2
              }}
            >
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Box sx={{ bgcolor: 'warning.main', borderRadius: 2, p: 2, display: 'flex', zIndex: 1 }}>
                  <Star sx={{ color: 'white', fontSize: 40 }} />
                </Box>
                <Box sx={{ zIndex: 1 }}>
                  <Typography variant="h2" fontWeight={800} color="warning.main">
                    {loading ? <Skeleton width={80} /> : (data?.averageRating ?? 'N/A')}
                  </Typography>
                  <Typography variant="h6" color="text.secondary" fontWeight={600}>Average Rating</Typography>
                  {!loading && data?.averageRating && (
                    <MuiRating value={data.averageRating} precision={0.1} readOnly size="large" sx={{ mt: 1 }} />
                  )}
                </Box>
                <Box 
                  sx={{ 
                    position: 'absolute', 
                    top: -40, 
                    right: -20, 
                    opacity: 0.1, 
                    transform: 'scale(4)' 
                  }}
                >
                  <Star color="warning" />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card sx={{ p: 2 }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Box sx={{ bgcolor: 'primary.main', borderRadius: 2, p: 2, display: 'flex' }}>
                  <People sx={{ color: 'white', fontSize: 40 }} />
                </Box>
                <Box>
                  <Typography variant="h2" fontWeight={800} color="primary.main">
                    {loading ? <Skeleton width={60} /> : (data?.totalRatings ?? 0)}
                  </Typography>
                  <Typography variant="h6" color="text.secondary" fontWeight={600}>Total Ratings</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Raters Table */}
        <Card>
          <CardContent sx={{ pb: 2 }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6" fontWeight={600}>
                Users Who Rated Your Store
              </Typography>
              
              {/* Search and Sort Controls */}
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', flex: 1, justifyContent: 'flex-end' }}>
                <TextField 
                  size="small" 
                  placeholder="Search users..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  sx={{ minWidth: 200 }}
                />
                <TextField
                  select
                  size="small"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  sx={{ minWidth: 200 }}
                  SelectProps={{ native: true }}
                >
                  <option value="ratedAt_desc">Newest First</option>
                  <option value="ratedAt_asc">Oldest First</option>
                  <option value="rating_desc">Highest Rating</option>
                  <option value="rating_asc">Lowest Rating</option>
                  <option value="userName_asc">Name (A-Z)</option>
                  <option value="userName_desc">Name (Z-A)</option>
                </TextField>
              </Box>
            </Box>
            <Divider />
          </CardContent>
          <TableContainer sx={{ maxHeight: 500, overflowX: 'auto' }}>
            <Table id="raters-table" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Rating</TableCell>
                  <TableCell>Review Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  Array.from(new Array(3)).map((_, index) => (
                    <TableRow key={`skeleton-${index}`}>
                      <TableCell><Skeleton variant="text" width="80%" /></TableCell>
                      <TableCell><Skeleton variant="text" width="100%" /></TableCell>
                      <TableCell><Skeleton variant="rounded" width={80} height={24} sx={{ borderRadius: 1 }} /></TableCell>
                      <TableCell><Skeleton variant="text" width={80} /></TableCell>
                    </TableRow>
                  ))
                ) : sortedRaters.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 6 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
                        <Star sx={{ fontSize: 48, color: 'text.secondary', opacity: 0.5 }} />
                        <Typography variant="h6" color="text.secondary">No ratings found</Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedRaters.map((r) => (
                    <TableRow key={r.ratingId} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32, fontSize: 14 }}>
                            {r.user.name[0]}
                          </Avatar>
                          <Typography variant="body2" fontWeight={600}>{r.user.name}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{r.user.email}</TableCell>
                      <TableCell>
                        <MuiRating value={r.rating} readOnly size="small" sx={{ color: 'warning.main' }} />
                      </TableCell>
                      <TableCell>{new Date(r.ratedAt).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={sortedRaters.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </Card>
      </Box>
    </AppLayout>
  );
};

export default OwnerDashboardPage;
