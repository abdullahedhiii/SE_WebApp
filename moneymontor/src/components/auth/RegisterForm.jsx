import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button, TextField, Box, Alert, Stack, Typography, MenuItem } from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useUser } from '../../contexts/UserContext';

const validationSchema = Yup.object({
  name: Yup.string().required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().min(6, 'Min 6 characters').required('Required'),
  confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match').required('Required'),
  role: Yup.string().oneOf(['individual', 'organization']).required('Required'),
});

export default function RegisterForm() {
  const { error, setError, register } = useUser();
  const navigate = useNavigate();

  return (
    <Formik
      initialValues={{ name: '', email: '', password: '', confirmPassword: '', role: 'individual' }}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting }) => {
        setError('');
        try {
          await register(values.name, values.email, values.password, values.role);
          if (values.role === 'individual') {
            navigate('/home');
          } else {
            navigate('/home/register-organization');
          }
        } catch (error) {
          setError(error.message);
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ values, handleChange, handleBlur, touched, errors, isSubmitting }) => (
        <Form>
          <Stack spacing={2}>
            {error && <Alert severity="error">{error}</Alert>}
            <TextField
              label="Name"
              name="name"
              value={values.name}
              onChange={(e) => {
                handleChange(e);
                setError(null);
              }}
              onBlur={handleBlur}
              error={touched.name && Boolean(errors.name)}
              helperText={touched.name && errors.name}
              fullWidth
            />
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
            <TextField
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={values.confirmPassword}
              onChange={(e) => {
                handleChange(e);
                setError(null);
              }}
              onBlur={handleBlur}
              error={touched.confirmPassword && Boolean(errors.confirmPassword)}
              helperText={touched.confirmPassword && errors.confirmPassword}
              fullWidth
            />
            <TextField
              select
              label="Role"
              name="role"
              value={values.role}
              onChange={(e) => {
                handleChange(e);
                setError(null);
              }}
              onBlur={handleBlur}
              error={touched.role && Boolean(errors.role)}
              helperText={touched.role && errors.role}
              fullWidth
            >
              <MenuItem value="individual">Individual</MenuItem>
              <MenuItem value="organization">Organization</MenuItem>
            </TextField>
            <Button type="submit" variant="contained" color="primary" fullWidth disabled={isSubmitting}>
              {isSubmitting ? 'Registering...' : 'Register'}
            </Button>
            <Typography align="center" variant="body2">
              Already have an account? <Link to="/login">Login</Link>
            </Typography>
          </Stack>
        </Form>
      )}
    </Formik>
  );
} 