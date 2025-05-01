import React, { useEffect } from 'react';
import { Button, TextField, Stack, Alert, InputAdornment, Typography, Box, Autocomplete } from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CategoryIcon from '@mui/icons-material/Category';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import NotesIcon from '@mui/icons-material/Notes';
import { useUser } from '../../contexts/UserContext';
import axios from 'axios';
import SendIcon from '@mui/icons-material/Send';

const validationSchema = Yup.object({
  date: Yup.string().required('Required'),
  category: Yup.string().required('Required'),
  amount: Yup.number().min(0.01, 'Must be > 0').required('Required'),
  description: Yup.string(),
});

export default function ExpenseForm({ onAdd }) {
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState(false);
  const {user, details, fetchUserDetails} = useUser();
  const [submitting, setSubmitting] = React.useState(false);

  // Get user categories or provide default ones
  const categoryOptions = details?.uniqueCategories || ['Groceries', 'Transport', 'Entertainment', 'Utilities', 'Rent'];
  
  // Field styles
  const fieldStyle = {
    '& .MuiOutlinedInput-root': {
      borderRadius: 2,
      transition: 'all 0.2s',
      backgroundColor: '#fafafa',
      '&:hover': {
        backgroundColor: '#fff',
      },
      '&.Mui-focused': {
        backgroundColor: '#fff',
        boxShadow: '0 0 0 2px rgba(211, 47, 47, 0.2)',
      }
    },
    '& .MuiInputLabel-root': {
      color: 'rgba(0, 0, 0, 0.7)',
      fontWeight: 500,
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: '#d32f2f',
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: 'rgba(0, 0, 0, 0.3)',
    },
    '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#d32f2f',
      borderWidth: 1,
    }
  };
  
  return (
    <Formik
      initialValues={{ date: '', category: '', amount: '', description: '' }}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        setError('');
        setSuccess(false);
        try {
          const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/api/add-expense/${user._id}`,
            values,
            { withCredentials: true }
          );
          console.log('Backend response:', response.data);
      
          fetchUserDetails();
          if (onAdd) onAdd();
          setSuccess(true);
          resetForm();
          setTimeout(() => setSuccess(false), 1800);
        } catch (e) {
          console.error('Error adding expense:', e);
          setError('Failed to save expense');
        }
        setSubmitting(false);
      }}
    >
      {({ values, handleChange, handleBlur, touched, errors, isSubmitting, setFieldValue }) => (
        <Form>
          <Stack spacing={2.5}>
            {error && <Alert 
              severity="error" 
              sx={{ 
                borderRadius: 2, 
                backgroundColor: 'rgba(211, 47, 47, 0.05)', 
                border: '1px solid rgba(211, 47, 47, 0.1)',
                '& .MuiAlert-icon': { color: '#d32f2f' }
              }}
            >
              {error}
            </Alert>}
            
            {success && (
              <Box 
                sx={{ 
                  textAlign: 'center', 
                  py: 1.5, 
                  borderRadius: 2, 
                  backgroundColor: 'rgba(46, 125, 50, 0.08)', 
                  border: '1px solid rgba(46, 125, 50, 0.2)',
                  animation: 'slideDown 0.5s ease-out'
                }}
              >
                <Typography variant="subtitle1" color="#2e7d32" fontWeight={600}>
                  ✓ Expense Added Successfully!
                </Typography>
                <style>{`
                  @keyframes slideDown {
                    0% { transform: translateY(-20px); opacity: 0; }
                    100% { transform: translateY(0); opacity: 1; }
                  }
                `}</style>
              </Box>
            )}
            
            <TextField
              label="Date"
              name="date"
              type="date"
              value={values.date}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.date && Boolean(errors.date)}
              helperText={touched.date && errors.date}
              fullWidth
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CalendarMonthIcon sx={{ color: '#d32f2f' }} />
                  </InputAdornment>
                ),
              }}
              sx={fieldStyle}
            />
            
            <Autocomplete
              freeSolo
              options={categoryOptions}
              value={values.category}
              onChange={(event, newValue) => {
                setFieldValue('category', newValue || '');
              }}
              onInputChange={(event, newInputValue) => {
                setFieldValue('category', newInputValue || '');
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Category"
                  name="category"
                  error={touched.category && Boolean(errors.category)}
                  helperText={touched.category && errors.category}
                  onBlur={handleBlur}
                  fullWidth
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <>
                        <InputAdornment position="start">
                          <CategoryIcon sx={{ color: '#000' }} />
                        </InputAdornment>
                        {params.InputProps.startAdornment}
                      </>
                    ),
                  }}
                  sx={fieldStyle}
                />
              )}
              ListboxProps={{
                sx: {
                  '& li': {
                    borderRadius: 1,
                    m: 0.3,
                    '&:hover': {
                      bgcolor: 'rgba(211, 47, 47, 0.08)',
                    },
                    '&[aria-selected="true"]': {
                      bgcolor: 'rgba(211, 47, 47, 0.12)',
                    }
                  }
                }
              }}
            />
            
            <TextField
              label="Amount"
              name="amount"
              type="number"
              value={values.amount}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.amount && Boolean(errors.amount)}
              helperText={touched.amount && errors.amount}
              fullWidth
              inputProps={{ min: 0, step: 0.01 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AttachMoneyIcon sx={{ color: '#2e7d32' }} />
                  </InputAdornment>
                ),
              }}
              sx={fieldStyle}
            />
            
            <TextField
              label="Description"
              name="description"
              value={values.description}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.description && Boolean(errors.description)}
              helperText={touched.description && errors.description}
              fullWidth
              multiline
              minRows={2}
              maxRows={4}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <NotesIcon sx={{ color: '#757575' }} />
                  </InputAdornment>
                ),
              }}
              sx={fieldStyle}
            />
            
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={submitting}
              endIcon={<SendIcon />}
              sx={{
                mt: 1,
                py: 1.2,
                fontWeight: 600,
                fontSize: 16,
                textTransform: 'none',
                borderRadius: 2,
                background: '#d32f2f',
                boxShadow: '0 4px 12px rgba(211, 47, 47, 0.2)',
                transition: 'all 0.2s',
                '&:hover': {
                  background: '#b71c1c',
                  boxShadow: '0 6px 16px rgba(211, 47, 47, 0.3)',
                  transform: 'translateY(-1px)'
                },
              }}
            >
              {submitting ? 'Saving...' : 'Save Expense'}
            </Button>
          </Stack>
        </Form>
      )}
    </Formik>
  );
} 