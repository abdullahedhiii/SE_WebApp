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
  LinearProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FlagIcon from '@mui/icons-material/Flag';
import SaveIcon from '@mui/icons-material/Save';

const categories = [
  { value: 'vacation', label: 'Vacation' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'education', label: 'Education' },
  { value: 'car', label: 'Vehicle' },
  { value: 'home', label: 'Home' },
  { value: 'other', label: 'Other' }
];

const colors = [
  { value: 'primary.main', label: 'Blue' },
  { value: 'secondary.main', label: 'Purple' },
  { value: 'success.main', label: 'Green' },
  { value: 'warning.main', label: 'Yellow' },
  { value: 'error.main', label: 'Red' },
  { value: '#00C9A7', label: 'Teal' }
];

export default function AddGoalForm({ open, onClose, onSave }) {
  const [goal, setGoal] = useState({
    name: '',
    category: 'vacation',
    target: 1000,
    current: 0,
    deadline: '',
    color: 'primary.main',
    notes: ''
  });

  const [errors, setErrors] = useState({});

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
    if (!goal.target || goal.target <= 0) newErrors.target = 'Target amount must be greater than 0';
    if (goal.current > goal.target) newErrors.current = 'Current amount cannot exceed target';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onSave({
        ...goal,
        id: Date.now(), // Generate a temporary ID
        progress: Math.round((goal.current / goal.target) * 100)
      });
      onClose();
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)'
        }
      }}
    >
      <DialogTitle sx={{ 
        pb: 1, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between' 
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <FlagIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h6" fontWeight={700}>
            Add New Savings Goal
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ pt: 2 }}>
        <TextField
          fullWidth
          label="Goal Name"
          name="name"
          value={goal.name}
          onChange={handleChange}
          error={Boolean(errors.name)}
          helperText={errors.name}
          placeholder="E.g. Summer Vacation, New MacBook"
          sx={{ mb: 2.5 }}
        />
        
        <TextField
          select
          fullWidth
          label="Category"
          name="category"
          value={goal.category}
          onChange={handleChange}
          sx={{ mb: 2.5 }}
        >
          {categories.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        
        <Box sx={{ display: 'flex', gap: 2, mb: 2.5 }}>
          <TextField
            fullWidth
            label="Target Amount"
            name="target"
            type="number"
            value={goal.target}
            onChange={handleChange}
            error={Boolean(errors.target)}
            helperText={errors.target}
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
          />
          
          <TextField
            fullWidth
            label="Deadline (Optional)"
            name="deadline"
            type="date"
            value={goal.deadline}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />
        </Box>
        
        <TextField
          select
          fullWidth
          label="Color"
          name="color"
          value={goal.color}
          onChange={handleChange}
          sx={{ mb: 2.5 }}
        >
          {colors.map((option) => (
            <MenuItem key={option.value} value={option.value} sx={{ color: option.value }}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        
        <Box sx={{ mb: 2.5 }}>
          <Typography variant="subtitle2" gutterBottom>
            Initial Contribution: ${goal.current}
          </Typography>
          <Slider
            value={goal.current}
            onChange={handleSliderChange}
            min={0}
            max={goal.target}
            step={10}
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => `$${value}`}
          />
          <LinearProgress 
            variant="determinate" 
            value={(goal.current / goal.target) * 100} 
            sx={{ height: 8, borderRadius: 4, mt: 1 }} 
            color="primary"
          />
        </Box>
        
        <TextField
          fullWidth
          label="Notes (Optional)"
          name="notes"
          value={goal.notes}
          onChange={handleChange}
          multiline
          rows={2}
          placeholder="Add any additional notes about this goal"
        />
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} variant="outlined" sx={{ borderRadius: 2 }}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          startIcon={<SaveIcon />}
          sx={{ borderRadius: 2 }}
        >
          Save Goal
        </Button>
      </DialogActions>
    </Dialog>
  );
} 