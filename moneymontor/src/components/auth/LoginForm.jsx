import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button, TextField, Box, Alert, Stack, Typography } from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../services/AuthContext';

const validationSchema = Yup.object({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().min(6, 'Min 6 characters').required('Required'),
});

export default function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = React.useState('');

  return (
    <Formik
      initialValues={{ email: '', password: '' }}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting }) => {
        setError('');
        // Fake API call
        setTimeout(() => {
          if (values.email === 'user@example.com' && values.password === 'password') {
            login({ email: values.email, role: 'individual' });
            navigate('/');
          } else {
            setError('Invalid credentials');
          }
          setSubmitting(false);
        }, 800);
      }}
    >
      {({ values, handleChange, handleBlur, touched, errors, isSubmitting }) => (
        <Form>
          <Stack spacing={2}>
            {error && <Alert severity="error">{error}</Alert>}
            <TextField
              label="Email"
              name="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.email && Boolean(errors.email)}
              helperText={touched.email && errors.email}
              fullWidth
              autoFocus
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.password && Boolean(errors.password)}
              helperText={touched.password && errors.password}
              fullWidth
            />
            <Button type="submit" variant="contained" color="primary" fullWidth disabled={isSubmitting}>
              {isSubmitting ? 'Logging in...' : 'Login'}
            </Button>
            <Typography align="center" variant="body2">
              Don&apos;t have an account? <Link to="/register">Register</Link>
            </Typography>
          </Stack>
        </Form>
      )}
    </Formik>
  );
} 