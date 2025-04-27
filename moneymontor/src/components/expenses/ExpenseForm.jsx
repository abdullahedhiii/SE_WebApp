import React from 'react';
import { Button, TextField, MenuItem, Stack, Alert, InputAdornment, Typography, Box } from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CategoryIcon from '@mui/icons-material/Category';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import NotesIcon from '@mui/icons-material/Notes';

const categories = [
  'Food', 'Transport', 'Utilities', 'Shopping', 'Health', 'Other'
];

const validationSchema = Yup.object({
  date: Yup.string().required('Required'),
  category: Yup.string().required('Required'),
  amount: Yup.number().min(0.01, 'Must be > 0').required('Required'),
  description: Yup.string(),
});

export default function ExpenseForm({ onAdd }) {
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState(false);

  return (
    <Formik
      initialValues={{ date: '', category: '', amount: '', description: '' }}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        setError('');
        setSuccess(false);
        try {
          const expenses = JSON.parse(localStorage.getItem('mm_expenses') || '[]');
          const newExpense = { ...values, id: Date.now() };
          localStorage.setItem('mm_expenses', JSON.stringify([newExpense, ...expenses]));
          if (onAdd) onAdd();
          setSuccess(true);
          resetForm();
          setTimeout(() => setSuccess(false), 1800);
        } catch (e) {
          setError('Failed to save expense');
        }
        setSubmitting(false);
      }}
    >
      {({ values, handleChange, handleBlur, touched, errors, isSubmitting }) => (
        <Form>
          <Stack spacing={3}>
            {error && <Alert severity="error">{error}</Alert>}
            {success && (
              <Box sx={{ textAlign: 'center', fontSize: 32, mb: -2, mt: -2, animation: 'pop 0.7s' }}>
                <span role="img" aria-label="confetti">🎉</span>
                <Typography variant="subtitle1" color="success.main" fontWeight={700}>Expense Added!</Typography>
                <style>{`
                  @keyframes pop {
                    0% { transform: scale(0.7); opacity: 0; }
                    60% { transform: scale(1.2); opacity: 1; }
                    100% { transform: scale(1); opacity: 1; }
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
                    <CalendarMonthIcon color="primary" />
                  </InputAdornment>
                ),
                sx: { borderRadius: 3, background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(4px)' },
              }}
            />
            <TextField
              select
              label="Category"
              name="category"
              value={values.category}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.category && Boolean(errors.category)}
              helperText={touched.category && errors.category}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CategoryIcon color="secondary" />
                  </InputAdornment>
                ),
                sx: { borderRadius: 3, background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(4px)' },
              }}
            >
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
              ))}
            </TextField>
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
                    <AttachMoneyIcon color="success" />
                  </InputAdornment>
                ),
                sx: { borderRadius: 3, background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(4px)' },
              }}
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
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <NotesIcon color="action" />
                  </InputAdornment>
                ),
                sx: { borderRadius: 3, background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(4px)' },
              }}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={isSubmitting}
              sx={{
                py: 1.5,
                fontWeight: 700,
                fontSize: 18,
                background: 'linear-gradient(90deg, #6C63FF 60%, #00C9A7 100%)',
                color: '#fff',
                boxShadow: '0 4px 16px 0 rgba(108, 99, 255, 0.10)',
                '&:hover': {
                  background: 'linear-gradient(90deg, #00C9A7 60%, #6C63FF 100%)',
                  color: '#fff',
                },
              }}
            >
              {isSubmitting ? 'Adding...' : 'Add Expense'}
            </Button>
          </Stack>
        </Form>
      )}
    </Formik>
  );
} 