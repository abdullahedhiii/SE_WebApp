import { useUser } from '../../contexts/UserContext';
import * as Yup from 'yup';
import { Formik, Form } from 'formik';  
import { TextField, Button, Box, Alert, Stack, Typography, Card, CardContent, Avatar } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import BusinessIcon from '@mui/icons-material/Business';

const RegisterOrganisation = () => {
    const { user, setUser } = useUser();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validationSchema = Yup.object({
        name: Yup.string().required('Organisation name is required').min(2, 'Name must be at least 2 characters'),
        description: Yup.string(),
    });

    console.log(user,'on register organisation');
    const handleSubmit = async (values) => {
        if (!user?._id) {
            setError('You must be logged in to create an organisation');
            navigate('/');
            return;
        }

        setIsSubmitting(true);
        setError('');
        
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/create-organization/${user._id}`, 
                values, 
                { withCredentials: true }
            );
            console.log(response.data,'on register organisation');
            const updatedUser = {
                ...user,
                organisation: response.data.organization
            };
            console.log(updatedUser,'on register organisation');
            localStorage.setItem('user', JSON.stringify(updatedUser));
            
            setUser(updatedUser);
            
            navigate('/home');
        } catch (err) {
            console.error('Organisation registration error:', err);
            setError(err?.response?.data?.message || 'Failed to create organisation. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'rgba(255, 0, 32, 0.03)',
                background: {
                    xs: 'linear-gradient(135deg, #fff 60%, #ffe5e5 100%)',
                    md: 'linear-gradient(120deg, #fff 70%, #fff0f0 100%)',
                },
            }}
        >
            <Card
                elevation={0}
                sx={{
                    p: { xs: 3, sm: 4 },
                    minWidth: 320,
                    maxWidth: 450,
                    borderRadius: 5,
                    boxShadow: '0 8px 32px 0 rgba(255,0,32,0.10)',
                    background: '#fff',
                    border: '1.5px solid #ffe5e5',
                }}
            >
                <CardContent sx={{ p: 0 }}>
                    <Stack spacing={3} alignItems="center">
                        <Avatar
                            sx={{
                                bgcolor: 'secondary.main',
                                width: 64,
                                height: 64,
                                mb: 1,
                                boxShadow: '0 2px 8px 0 rgba(255,0,32,0.10)',
                            }}
                        >
                            <BusinessIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                        </Avatar>
                        
                        <Typography
                            variant="h5"
                            fontWeight={700}
                            color="primary.main"
                            align="center"
                            sx={{ fontFamily: 'Inter, Roboto, sans-serif', letterSpacing: 0.5 }}
                        >
                            Register Your Organisation
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            align="center"
                            mb={1}
                            sx={{ fontFamily: 'Inter, Roboto, sans-serif', fontWeight: 400 }}
                        >
                            Create an organisation to manage expenses and budgets
                        </Typography>

                        {error && (
                            <Alert severity="error" sx={{ width: '100%' }}>
                                {error}
                            </Alert>
                        )}

                        <Formik
                            initialValues={{ 
                                name: '',
                                description: ''
                            }}
                            validationSchema={validationSchema}
                            onSubmit={handleSubmit}
                        >
                            {({ values, handleChange, handleBlur, touched, errors }) => (
                                <Form style={{ width: '100%' }}>
                                    <Stack spacing={2.5} width="100%">
                                        <TextField
                                            fullWidth
                                            id="name"
                                            name="name"
                                            label="Organisation Name"
                                            value={values.name}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.name && Boolean(errors.name)}
                                            helperText={touched.name && errors.name}
                                            variant="outlined"
                                            InputLabelProps={{ style: { color: '#d32f2f' } }}
                                        />

                                        <TextField
                                            fullWidth
                                            id="description"
                                            name="description"
                                            label="Description (Optional)"
                                            value={values.description}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.description && Boolean(errors.description)}
                                            helperText={touched.description && errors.description}
                                            variant="outlined"
                                            multiline
                                            rows={3}
                                            InputLabelProps={{ style: { color: '#d32f2f' } }}
                                        />

                                        <Button
                                            type="submit"
                                            variant="contained"
                                            fullWidth
                                            disabled={isSubmitting}
                                            sx={{
                                                mt: 1.5,
                                                py: 1.2,
                                                fontWeight: 700,
                                                fontSize: '1.1rem',
                                                borderRadius: 3,
                                                boxShadow: '0 4px 16px 0 rgba(255,0,32,0.10)',
                                                background: 'linear-gradient(90deg, #d32f2f 60%, #ff1744 100%)',
                                                color: '#fff',
                                                textTransform: 'none',
                                                '&:hover': {
                                                    background: 'linear-gradient(90deg, #b71c1c 60%, #d32f2f 100%)',
                                                },
                                            }}
                                        >
                                            {isSubmitting ? 'Creating...' : 'Create Organisation'}
                                        </Button>
                                    </Stack>
                                </Form>
                            )}
                        </Formik>
                    </Stack>
                </CardContent>
            </Card>
        </Box>
    );
};

export default RegisterOrganisation;
