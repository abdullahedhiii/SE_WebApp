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
  IconButton,
  Avatar,
  FormControl,
  FormControlLabel,
  Switch
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';
import { useUser } from '../../contexts/UserContext';
import Alert from '@mui/material/Alert';
const roles = [
  
  { value: 'contributor', label: 'Contributor' },
  { value: 'viewer', label: 'Viewer (Read-only)' },
];

const avatarColors = [
  '#6C63FF', 
  '#00C9A7', 
  '#FFD93D', 
  '#FF6B6B', 
  '#4DACFF', 
  '#43A047', 
];

export default function AddFamilyMemberForm({ open, onClose, onSave }) {
  const {user,fetchUserDetails} = useUser();
  const [member, setMember] = useState({
    name: '',
    email: '',
    role: 'contributor',
    avatarColor: avatarColors[0],
    allowBudgetEditing: true,
    allowExpenseTracking: true,
    notes: ''
  });

  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMember(prev => ({ ...prev, [name]: value }));
    setError(null);
    
  };

  const handleSwitchChange = (e) => {
    const { name, checked } = e.target;
    setMember(prev => ({ ...prev, [name]: checked }));
  };

  const handleAvatarColorChange = (color) => {
    setMember(prev => ({ ...prev, avatarColor: color }));
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const validate = () => {

    
    if (!member?.email?.trim()) {
      setError('Email is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(member?.email)) {
      setError('Please enter a valid email address');
    }
    
      return 1
  };

  const handleSubmit = async () => {
    if (validate()) {
      setLoading(true);
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/add-user-to-organization/${user.organisation}`, {
          email: member.email,
          organisation_role: member.role,
          avatarColor: member.avatarColor
        });

        await fetchUserDetails();
      onSave({
        ...member,
        id: Date.now(), 

        initials: getInitials(member.name),
      });
      onClose();
    }
    catch(error){
      console.log(error);
      setError(error.response.data.message);
    }
    finally{
      setLoading(false);
    }
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
          <PersonAddIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h6" fontWeight={700}>
            Add Family Member
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ pt: 2 }}>
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
          <Avatar 
            sx={{ 
              width: 80, 
              height: 80, 
              bgcolor: member.avatarColor,
              fontSize: '1.8rem',
              fontWeight: 700,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
            }}
          >
            {getInitials(member.name) || <AccountCircleIcon fontSize="large" />}
          </Avatar>
        </Box>
        
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center', gap: 1 }}>
          {avatarColors.map((color) => (
            <Box
              key={color}
              onClick={() => handleAvatarColorChange(color)}
              sx={{
                width: 24,
                height: 24,
                bgcolor: color,
                borderRadius: '50%',
                cursor: 'pointer',
                border: member.avatarColor === color ? '2px solid #000' : '2px solid transparent',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.1)',
                },
              }}
            />
          ))}
        </Box>
        
        {/* <TextField
          fullWidth
          label="Name"
          name="name"
          value={member.name}
          onChange={handleChange}
          error={Boolean(errors.name)}
          helperText={errors.name}
          placeholder="Full Name"
          sx={{ mb: 2.5 }}
        /> */}
        
        <TextField
          fullWidth
          label="Email Address"
          name="email"
          type="email"
          value={member.email}
          onChange={handleChange}
          error={Boolean(error)}
          helperText={error}
          placeholder="email@example.com"
          sx={{ mb: 2.5 }}
        />
        
        <TextField
          select
          fullWidth
          label="Role"
          name="role"
          value={member.role}
          onChange={handleChange}
          sx={{ mb: 2.5 }}
        >
          {roles.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        
        {/* <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
          Permissions
        </Typography>
         */}
        {/* <FormControl component="fieldset" sx={{ width: '100%' }}>
          <FormControlLabel
            control={
              <Switch 
                checked={member.allowBudgetEditing} 
                onChange={handleSwitchChange} 
                name="allowBudgetEditing" 
                color="primary"
              />
            }
            label="Allow Budget Editing"
          />
          
          <FormControlLabel
            control={
              <Switch 
                checked={member.allowExpenseTracking} 
                onChange={handleSwitchChange} 
                name="allowExpenseTracking" 
                color="primary"
              />
            }
            label="Allow Expense Tracking"
          />
        </FormControl> */}
        
        {/* <TextField
          fullWidth
          label="Notes (Optional)"
          name="notes"
          value={member.notes}
          onChange={handleChange}
          multiline
          rows={2}
          placeholder="Additional information about this member"
          sx={{ mt: 2 }}
        /> */}
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} variant="outlined" sx={{ borderRadius: 2 }}>
          Cancel
        </Button>
        <Button 
          disabled={loading}
          onClick={handleSubmit} 
          variant="contained" 
          startIcon={<PersonAddIcon />}
          sx={{ borderRadius: 2 }}
        >
          {loading ? <CircularProgress size={20} /> : 'Add Member'}
          {/* {error && <Alert severity="error">{error}</Alert>} */}
          {/* {success && <Alert severity="success">{success}</Alert>} */}
        </Button>
      </DialogActions>
    </Dialog>
  );
} 