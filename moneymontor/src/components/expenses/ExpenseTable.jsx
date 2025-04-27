import React from 'react';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { Box, IconButton, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

export default function ExpenseTable() {
  const [rows, setRows] = React.useState([]);

  const loadExpenses = () => {
    const expenses = JSON.parse(localStorage.getItem('mm_expenses') || '[]');
    setRows(expenses);
  };

  React.useEffect(() => {
    loadExpenses();
    window.addEventListener('expenseAdded', loadExpenses);
    return () => window.removeEventListener('expenseAdded', loadExpenses);
  }, []);

  const handleDelete = (id) => {
    const updated = rows.filter((row) => row.id !== id);
    setRows(updated);
    localStorage.setItem('mm_expenses', JSON.stringify(updated));
  };

  const columns = [
    { field: 'date', headerName: 'Date', width: 110 },
    { field: 'category', headerName: 'Category', width: 130 },
    { field: 'amount', headerName: 'Amount', width: 110, valueFormatter: ({ value }) => `$${Number(value).toFixed(2)}` },
    { field: 'description', headerName: 'Description', width: 200 },
    {
      field: 'actions',
      type: 'actions',
      width: 90,
      getActions: (params) => [
        <GridActionsCellItem icon={<EditIcon />} label="Edit" onClick={() => alert('Edit not implemented')} />,
        <GridActionsCellItem icon={<DeleteIcon />} label="Delete" onClick={() => handleDelete(params.id)} />,
      ],
    },
  ];

  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Expense Records
      </Typography>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5, 10]}
        disableSelectionOnClick
        getRowId={(row) => row.id}
        sx={{ bgcolor: 'background.paper' }}
      />
    </Box>
  );
} 