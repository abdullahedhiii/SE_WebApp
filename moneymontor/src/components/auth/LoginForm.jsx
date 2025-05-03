import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button, TextField, Box, Alert, Stack, Typography } from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useUser } from '../../contexts/UserContext';

const validationSchema = Yup.object({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().min(6, 'Min 6 characters').required('Required'),
});

export default function LoginForm() {
  const navigate = useNavigate();
  const { error, setError, login,justLoggedOut } = useUser();

  return (
    <Formik
      initialValues={{ email: '', password: '' }}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting }) => {
        setError('');
        try {
          await login(values.email, values.password);
        } catch (error) {
          setError(error.message);
        }
        finally{
          setSubmitting(false);
        }
      }}
    >
      {({ values, handleChange, handleBlur, touched, errors, isSubmitting }) => (
        <Form>
          {justLoggedOut && <Alert severity="success">Logged out successfully</Alert>}
          <Stack spacing={2}>
            {error && <Alert severity="error">{error}</Alert>}
            <TextField
              label="Email"
              name="email"
              value={values.email}
              onChange={(e) => {
                handleChange(e);
                setError(null);
              }}
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
              onChange={(e) => {
                handleChange(e);
                setError(null);
              }}
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