import { useUser } from '../contexts/UserContext';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Box, Card, CardContent, Typography, TextField, Button, Stack, Alert, Avatar } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const AddDetails = () => {
    const { user, setUser } = useUser();
    const [info, setInfo] = useState({
        budget: user?.budget || '',
        income: user?.income || '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/');
        }
    }, [user, navigate]);

    const handleChange = (e) => {
        setInfo({ ...info, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        setSuccess('');

        
        if (!info.budget || !info.income) {
            setError('Please fill all required fields');
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/add-details/${user._id}`, 
                info, 
                { withCredentials: true }
            );
            
            
            setUser(response.data.user);
            
            setSuccess('Details added successfully');
            toast.success('Details added successfully');
            
            setTimeout(() => {
                navigate('/home');
            }, 1500);
        } catch (error) {
            console.error('Add details error:', error);
            setError(error?.response?.data?.message || 'Failed to add details');
            toast.error('Failed to add details');
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
                    maxWidth: 400,
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
                            <AddCircleOutlineIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                        </Avatar>
                        <Typography
                            variant="h5"
                            fontWeight={700}
                            color="primary.main"
                            align="center"
                            sx={{ fontFamily: 'Inter, Roboto, sans-serif', letterSpacing: 0.5 }}
                        >
                            Financial Details
                        </Typography>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            align="center"
                            mb={1}
                            sx={{ fontFamily: 'Inter, Roboto, sans-serif', fontWeight: 400 }}
                        >
                            Complete your profile to get personalized insights and budgeting help.
                        </Typography>
                        {error && <Alert severity="error" sx={{ width: '100%' }}>{error}</Alert>}
                        {success && <Alert severity="success" sx={{ width: '100%' }}>{success}</Alert>}
                        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                            <Stack spacing={2.5}>
                                <TextField
                                    label="Monthly Budget"
                                    name="budget"
                                    type="number"
                                    value={info.budget}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    inputProps={{ min: 0 }}
                                    variant="outlined"
                                    InputLabelProps={{ style: { color: '#d32f2f' } }}
                                    placeholder="Enter your monthly budget"
                                />
                                <TextField
                                    label="Monthly Income"
                                    name="income"
                                    type="number"
                                    value={info.income}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    inputProps={{ min: 0 }}
                                    variant="outlined"
                                    InputLabelProps={{ style: { color: '#d32f2f' } }}
                                    placeholder="Enter your monthly income"
                                />
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
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
                                    {isSubmitting ? 'Saving Details...' : 'Save Financial Details'}
                                </Button>
                            </Stack>
                        </Box>
                    </Stack>
                </CardContent>
            </Card>
        </Box>
    );
};

export default AddDetails;