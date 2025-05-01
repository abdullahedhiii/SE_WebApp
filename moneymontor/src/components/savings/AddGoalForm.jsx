import React, { useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField, 
  Button, 
  Box, 
  Typography, 
  MenuItem, 
  InputAdornment,
  Slider,
  IconButton,
  LinearProgress,
  Autocomplete,
  Stack,
  Chip
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FlagIcon from '@mui/icons-material/Flag';
import SaveIcon from '@mui/icons-material/Save';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CategoryIcon from '@mui/icons-material/Category';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import descriptionIcon from '@mui/icons-material/description';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import { useUser } from '../../contexts/UserContext';
import axios from 'axios';

// Default categories if user has none
const defaultCategories = [
  'Vacation', 
  'Electronics', 
  'Education', 
  'Vehicle', 
  'Home', 
  'Emergency Fund',
  'Retirement',
  'Wedding',
  'Other'
];

const colors = [
  { value: '#d32f2f', label: 'Red' },
  { value: '#000000', label: 'Black' },
  { value: '#2e7d32', label: 'Green' },
  { value: '#1976d2', label: 'Blue' },
  { value: '#ed6c02', label: 'Orange' },
  { value: '#9c27b0', label: 'Purple' }
];

export default function AddGoalForm({ open, onClose, onSave }) {
  const {details, user, fetchUserDetails} = useUser();
  const [goal, setGoal] = useState({
    name: '',
    category: '',
    target: 1000,
    current: 0,
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    color: '#d32f2f',
    description: ''
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Use categories from user details or fall back to defaults
  const categoryOptions = details?.goalCategories || defaultCategories;

  // Field style for consistent UI
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGoal(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSliderChange = (event, newValue) => {
    setGoal(prev => ({ ...prev, current: newValue }));
  };

  const validate = () => {
    const newErrors = {};
    if (!goal.name.trim()) newErrors.name = 'Name is required';
    if (!goal.category.trim()) newErrors.category = 'Category is required';
    if (!goal.target || goal.target <= 0) newErrors.target = 'Target amount must be greater than 0';
    if (goal.current > goal.target) newErrors.current = 'Current amount cannot exceed target';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async() => {
    if (validate()) {
      setSubmitting(true);
      try {
        const response = await axios.post(
          `Rs.{import.meta.env.VITE_API_URL}/api/add-goal/Rs.{user._id}`,
          goal,
          {withCredentials: true}
        );
        onSave({
          ...goal,
          id: Date.now(), // Generate a temporary ID
          progress: Math.round((goal.current / goal.target) * 100)
        });
        fetchUserDetails();
        onClose();
      } catch(error) {
        console.error("Error saving goal:", error);
        setErrors({ submit: 'Failed to save the goal. Please try again.' });
      } finally {
        setSubmitting(false);
      }
    }
  };

  // Calculate progress percentage
  const progressPercentage = goal.target > 0 ? Math.round((goal.current / goal.target) * 100) : 0;

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
          overflow: 'visible'
        }
      }}
    >
      <DialogTitle sx={{ 

        py: 2,
        px: 3,
        bgcolor: '#d32f2f',
        color: 'white',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <FlagIcon sx={{ mr: 1.5 ,mb:2 }} />
          <Typography variant="h6" fontWeight={700}>
            Create New Savings Goal
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ color: 'white' }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ pt: 8, px: 3 }}>
        {errors.submit && (
          <Box sx={{ 
            mb: 2, 
            p: 1.5, 
            borderRadius: 2, 
            bgcolor: 'rgba(211, 47, 47, 0.08)', 
            color: '#d32f2f', 
            border: '1px solid rgba(211, 47, 47, 0.2)' 
          }}>
            <Typography variant="body2">{errors.submit}</Typography>
          </Box>
        )}
      
        <TextField
          fullWidth
          label="Goal Name"
          name="name"
          value={goal.name}
          onChange={handleChange}
          error={Boolean(errors.name)}
          helperText={errors.name}
          placeholder="E.g. Summer Vacation, New MacBook"
          sx={{ ...fieldStyle, mb: 2.5 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FlagIcon sx={{ color: '#d32f2f' }} />
              </InputAdornment>
            ),
          }}
        />
        
        <Autocomplete
          freeSolo
          options={categoryOptions}
          value={goal.category}
          onChange={(event, newValue) => {
            setGoal(prev => ({ ...prev, category: newValue || '' }));
            if (errors.category) {
              setErrors(prev => ({ ...prev, category: '' }));
            }
          }}
          onInputChange={(event, newInputValue) => {
            setGoal(prev => ({ ...prev, category: newInputValue || '' }));
            if (errors.category) {
              setErrors(prev => ({ ...prev, category: '' }));
            }
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Category"
              name="category"
              error={Boolean(errors.category)}
              helperText={errors.category}
              fullWidth
              sx={{ ...fieldStyle, mb: 2.5 }}
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
        
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2.5 }}>
          <TextField
            fullWidth
            label="Target Amount"
            name="target"
            type="number"
            value={goal.target}
            onChange={handleChange}
            error={Boolean(errors.target)}
            helperText={errors.target}
            sx={fieldStyle}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AttachMoneyIcon sx={{ color: '#2e7d32' }} />
                </InputAdornment>
              ),
            }}
          />
          
          <TextField
            fullWidth
            label="Deadline"
            name="endDate"
            type="date"
            value={goal.endDate}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            sx={fieldStyle}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CalendarMonthIcon sx={{ color: '#d32f2f' }} />
                </InputAdornment>
              ),
            }}
          />
        </Stack>
        
        <TextField
          select
          fullWidth
          label="Color Theme"
          name="color"
          value={goal.color}
          onChange={handleChange}
          sx={{ ...fieldStyle, mb: 2.5 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <ColorLensIcon sx={{ color: goal.color }} />
              </InputAdornment>
            ),
          }}
        >
          {colors.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ 
                  width: 16, 
                  height: 16, 
                  borderRadius: '50%', 
                  bgcolor: option.value, 
                  mr: 1.5,
                  border: '1px solid rgba(0,0,0,0.1)'
                }} />
                {option.label}
              </Box>
            </MenuItem>
          ))}
        </TextField>
        
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="subtitle2" fontWeight={600}>
              Initial Contribution
            </Typography>
            <Typography variant="subtitle2" color={goal.color}>
              Rs.{goal.current} of Rs.{goal.target}
            </Typography>
          </Box>
          
          <Slider
            value={goal.current}
            onChange={handleSliderChange}
            min={0}
            max={goal.target}
            step={10}
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => `Rs.Rs.{value}`}
            sx={{ 
              color: goal.color,
              '& .MuiSlider-thumb': {
                width: 18,
                height: 18,
                '&:hover, &.Mui-focusVisible': {
                  boxShadow: `0 0 0 8px Rs.{goal.color}20`,
                },
              },
            }}
          />
          
          <Box sx={{ mt: 1, position: 'relative' }}>
            <LinearProgress 
              variant="determinate" 
              value={progressPercentage}
              sx={{ 
                height: 8, 
                borderRadius: 4,
                bgcolor: 'rgba(0,0,0,0.05)',
                '& .MuiLinearProgress-bar': {
                  bgcolor: goal.color,
                  borderRadius: 4,
                }
              }}
            />
            <Chip 
              label={`${progressPercentage}%`} 
              size="small"
              sx={{ 
                position: 'absolute',
                right: 0,
                top: -10,
                height: 24,
                fontSize: 12,
                fontWeight: 600,
                bgcolor: goal.color,
                color: 'white',
                minWidth: 40,
                display: progressPercentage > 0 ? 'flex' : 'none'
              }}
            />
          </Box>
        </Box>
        
        <TextField
          fullWidth
          label="description"
          name="description"
          value={goal.description}
          onChange={handleChange}
          multiline
          rows={2}
          placeholder="Add any additional description about this goal"
          sx={fieldStyle}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.5 }}>
                <descriptionIcon sx={{ color: '#757575' }} />
              </InputAdornment>
            ),
          }}
        />
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 3, pt: 1 }}>
        <Button 
          onClick={onClose} 
          variant="outlined" 
          sx={{ 
            borderRadius: 2,
            borderColor: 'rgba(255, 255, 255, 0.2)',
            color: 'text.secondary',
            '&:hover': {
              borderColor: 'rgba(0,0,0,0.5)', 
              bgcolor: 'rgba(0,0,0,0.03)'
            }
          }}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          startIcon={<SaveIcon />}
          disabled={submitting}
          sx={{ 
            borderRadius: 2,
            bgcolor: '#d32f2f',
            boxShadow: '0 4px 12px rgba(211, 47, 47, 0.2)',
            fontWeight: 600,
            px: 3,
            '&:hover': {
              bgcolor: '#b71c1c',
              boxShadow: '0 6px 16px rgba(211, 47, 47, 0.3)',
            }
          }}
        >
          {submitting ? 'Saving...' : 'Save Goal'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}