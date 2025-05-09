import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, IconButton, Typography, Chip, Stack, Card, CardContent, TextField, InputAdornment } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import ReceiptIcon from '@mui/icons-material/Receipt';
import SortIcon from '@mui/icons-material/Sort';
import { useUser } from '../../contexts/UserContext';
import axios from 'axios';

export default function ExpenseTable() {
  const {details, user, fetchUserDetails} = useUser();
  const [searchText, setSearchText] = useState('');
  const [pageSize, setPageSize] = useState(5);

  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'PKR',
    }).format(amount);
  };

  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await axios.delete(
          `${import.meta.env.VITE_API_URL}/api/delete-expense/${user._id}/${id}`,
          { withCredentials: true }
        );
        fetchUserDetails();
      } catch (error) {
        console.error('Error deleting expense:', error);
      }
    }
  };

  
  const filteredExpenses = details?.allExpenses ? 
    details.allExpenses.filter(expense => 
      expense.category.toLowerCase().includes(searchText.toLowerCase()) || 
      expense.description?.toLowerCase().includes(searchText.toLowerCase())
    ) : [];

  const columns = [
    { 
      field: 'date', 
      headerName: 'Date', 
      width: 120,
      renderCell: (params) => (
        <Typography variant="body2" fontWeight={500}>
          {formatDate(params.value)}
        </Typography>
      ),
      headerAlign: 'left',
    },
    { 
      field: 'category', 
      headerName: 'Category', 
      width: 140,
      renderCell: (params) => (
        <Chip 
          label={params.value}
          size="small"
          sx={{ 
            bgcolor: 'rgba(0, 0, 0, 0.05)',
            color: '#000',
            fontWeight: 500,
            borderRadius: 1
          }}
        />
      ),
    },
    { 
      field: 'amount', 
      headerName: 'Amount', 
      width: 120,
      renderCell: (params) => (
        <Typography 
          variant="body2" 
          fontWeight={600}
          color={params.value > 100 ? '#d32f2f' : 'inherit'}
        >
          {formatCurrency(params.value)}
        </Typography>
      ),
      headerAlign: 'right',
      align: 'right',
    },
    { 
      field: 'description', 
      headerName: 'Description', 
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          {params.value || '-'}
        </Typography>
      ),
    },
    {
      field: 'actions',
      type: 'actions',
      width: 100,
      headerName: 'Actions',
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <IconButton 
            size="small" 
            onClick={() => handleDelete(params.row._id)}
            sx={{ 
              color: '#d32f2f',
              '&:hover': {
                bgcolor: 'rgba(211, 47, 47, 0.08)',
              }
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Stack>
      ),
    },
  ];

  return (
    <Box sx={{ height: 'calc(100% - 16px)', width: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Search and stats bar */}
      <Stack 
        direction={{ xs: 'column', sm: 'row' }} 
        spacing={2} 
        justifyContent="space-between" 
        alignItems={{ xs: 'flex-start', sm: 'center' }} 
        mb={2}
      >
        <TextField
          placeholder="Search by category or description"
          size="small"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
              </InputAdornment>
            ),
          }}
          sx={{
            width: { xs: '100%', sm: 240 },
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              bgcolor: '#fff',
              '& fieldset': {
                borderColor: 'rgba(0, 0, 0, 0.1)',
              },
              '&:hover fieldset': {
                borderColor: 'rgba(0, 0, 0, 0.3)',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#d32f2f',
              },
            },
          }}
        />
        
        <Stack direction="row" spacing={2}>
          <Card elevation={0} sx={{ bgcolor: 'rgba(0, 0, 0, 0.02)', border: '1px solid rgba(0, 0, 0, 0.06)', borderRadius: 2 }}>
            <CardContent sx={{ py: 1, px: 2, '&:last-child': { pb: 1 } }}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <ReceiptIcon fontSize="small" sx={{ color: '#d32f2f' }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">Total Records</Typography>
                  <Typography variant="body2" fontWeight={600}>{filteredExpenses.length}</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      </Stack>
      
      {/* Data grid */}
      <Box sx={{ flexGrow: 1, width: '100%', bgcolor: '#fff', borderRadius: 2, overflow: 'hidden' }}>
        <DataGrid
          rows={filteredExpenses}
          columns={columns}
          pageSize={pageSize}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          rowsPerPageOptions={[5, 10, 25]}
          disableSelectionOnClick
          getRowId={(row) => row._id}
          sx={{
            border: 'none',
            '& .MuiDataGrid-columnHeaders': {
              bgcolor: 'rgba(0, 0, 0, 0.02)',
              borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
            },
            '& .MuiDataGrid-cell': {
              borderBottom: '1px solid rgba(0, 0, 0, 0.04)',
            },
            '& .MuiDataGrid-row:hover': {
              bgcolor: 'rgba(211, 47, 47, 0.04)',
            },
            '& .MuiDataGrid-footerContainer': {
              borderTop: '1px solid rgba(0, 0, 0, 0.1)',
            },
            '& .MuiTablePagination-root': {
              color: 'text.secondary',
            },
            '& .MuiDataGrid-columnHeaderTitle': {
              fontWeight: 600,
              color: 'text.primary',
            },
          }}
          components={{
            NoRowsOverlay: () => (
              <Stack height="100%" alignItems="center" justifyContent="center">
                <Typography variant="body2" color="text.secondary">
                  No expenses found
                </Typography>
              </Stack>
            ),
          }}
        />
      </Box>
    </Box>
  );
} 