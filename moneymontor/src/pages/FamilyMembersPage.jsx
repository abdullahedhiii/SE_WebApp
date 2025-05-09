import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Alert,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemIcon,
  Divider,
  Switch
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';
import EmailIcon from '@mui/icons-material/Email';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import GroupIcon from '@mui/icons-material/Group';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import VisibilityIcon from '@mui/icons-material/Visibility';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import InfoIcon from '@mui/icons-material/Info';
import AddFamilyMemberForm from '../components/family/AddFamilyMemberForm';
import { useUser } from '../contexts/UserContext';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';


const getRoleLabel = (role) => {
  const roles = {
    admin: 'Administrator',
    contributor: 'Contributor',
    viewer: 'Viewer'
  };
  return roles[role] || role;
};

const getRoleColor = (role) => {
  const colors = {
    admin: '#000',
    contributor: '#888',
    viewer: '#000',
  };
  return colors[role] || 'default';
};

const getRoleIcon = (role) => {
  switch (role) {
    case 'Organization Owner':
      return <SupervisorAccountIcon fontSize="small" />;
    case 'contributor':
      return <EditIcon fontSize="small" />;
    case 'viewer':
      return <VisibilityIcon fontSize="small" />;
    default:
      return null;
  }
};

export default function FamilyMembersPage() {
  const {details,user} = useUser();
  const [members, setMembers] = useState(details?.org_members || []);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  const handleAddMember = (newMember) => {
    setMembers(prev => [...prev, { ...newMember, status: 'pending' }]);
    showNotification('Family member added successfully!', 'success');
  };

  const handleEditMember = (memberId) => {
    
    console.log('Edit member:', memberId);
  };

  const openDeleteConfirmation = (memberId) => {
    setMemberToDelete(memberId);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteMember = () => {
    if (memberToDelete) {
      setMembers(prev => prev.filter(member => member.id !== memberToDelete));
      setIsDeleteModalOpen(false);
      setMemberToDelete(null);
      showNotification('Family member removed successfully!', 'success');
    }
  };

  const handleTogglePermission = (memberId, permission) => {
    setMembers(prev => 
      prev.map(member => 
        member.id === memberId
          ? { ...member, [permission]: !member[permission] }
          : member
      )
    );
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  return (
    <Box sx={{ minHeight: '100vh', width: '100%', p: { xs: 2, sm: 3 }, animation: 'fadeIn 1.2s' }}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: none; }
        }
      `}</style>
      
      {/* Notification */}
      {notification.show && (
        <Alert 
          severity={notification.type}
          iconMapping={{
            success: <CheckCircleOutlineIcon sx={{ color: '#000' }} />, 
            error: <CancelOutlinedIcon sx={{ color: '#000' }} />,
            warning: <WarningAmberIcon sx={{ color: '#' }} />,
            info: <InfoIcon sx={{ color: '#000' }} />,
          }}
          sx={{ 
            position: 'fixed', 
            top: 16, 
            right: 16, 
            zIndex: 9999,
            boxShadow: 3,
            borderRadius: 2
          }}
        >
          {notification.message}
        </Alert>
      )}
      
      {/* Page Header */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        mb: 4, 
        flexWrap: 'wrap', 
        justifyContent: 'space-between' 
      }}>
        <Box>
          <Typography 
            variant="h4" 
            fontWeight={700} 
            color="text.primary" 
            sx={{ fontSize: { xs: '1.5rem', md: '2rem' } }}
          >
            Family Members
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
            Manage who has access to your family finances
          </Typography>
        </Box>
        
       {user.user_type === 'organization' && <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={() => setIsAddModalOpen(true)}
          sx={{ 
            mt: { xs: 2, sm: 0 }, 
            borderRadius: 2, 
            py: 1.2, 
            px: 2.5, 
            fontWeight: 600 
          }}
        >
          Add Member
        </Button>}
      </Box>
      
      {/* Members List */}
      <Paper 
        elevation={0} 
        sx={{ 
          borderRadius: 3, 
          background: '#fff', 
          boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
          mb: 4,
          overflow: 'hidden'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', p: 3, bgcolor: 'primary.main', color: 'white' }}>
          <GroupIcon sx={{ mr: 2 }} />
          <Typography variant="h6" fontWeight={700}>
            Your Family Members
          </Typography>
        </Box>
        
        <List sx={{ width: '100%' }}>
          {members.map((member, index) => (
            <React.Fragment key={member.id}>
              <ListItem
                secondaryAction={
                  <Box>
                    {user.user_type === 'Organization' && member.organisation_role !== 'Organization Owner' && (
                      <Tooltip title="Edit">
                        <IconButton edge="end" sx={{ mr: 1 }} onClick={() => handleEditMember(member.id)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>

                    )}
                    {user.user_type === 'Organization' && member.organisation_role !== 'Organization Owner' && (
                      <Tooltip title="Remove">
                        <IconButton edge="end" onClick={() => openDeleteConfirmation(member.id)}>
                          <DeleteOutlineIcon color="error" />
                        </IconButton>
                      </Tooltip>
                    )}
                  
                  </Box>
                }
                sx={{ 
                  px: 3, 
                  py: 2, 
                  opacity: member.status === 'pending' ? 0.7 : 1 
                }}
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: member.avatarColor, fontWeight: 600 }}>
                    {member.initials || member.name.charAt(0)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                      <Typography variant="body1" fontWeight={600}>
                        {member.name}
                      </Typography>
                      <Chip 
                        icon={getRoleIcon(member.organisation_role)}
                        label={getRoleLabel(member.organisation_role)}
                        size="small"
                        color={getRoleColor(member.organisation_role)}
                        variant="outlined"
                        sx={{ fontWeight: 500, ml: 1 }}
                      />
                      {/* {member.status === 'pending' && (
                        <Chip 
                          size="small"
                          label="Invitation Pending"
                          color="warning"
                          sx={{ fontWeight: 500 }}
                        />
                      )} */}
                    </Box>
                  }
                  secondary={
                    <Box sx={{ mt: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <EmailIcon fontSize="small" sx={{ color: 'text.secondary', mr: 1, fontSize: 16 }} />
                        <Typography variant="body2" color="text.secondary">
                          {member.email}
                        </Typography>
                      </Box>
                      
                      {/* <Grid container spacing={2} sx={{ mt: 0.5 }}>
                        <Grid item xs={12} sm={6}>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Typography variant="caption" color="text.secondary">
                              Budget Editing
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              {member.allowBudgetEditing ? (
                                <CheckCircleOutlineIcon color="success" fontSize="small" sx={{ mr: 0.5 }} />
                              ) : (
                                <CancelOutlinedIcon color="error" fontSize="small" sx={{ mr: 0.5 }} />
                              )}
                              <Switch
                                edge="end"
                                size="small"
                                checked={member.allowBudgetEditing}
                                onChange={() => handleTogglePermission(member.id, 'allowBudgetEditing')}
                                disabled={member.role === 'admin'}
                              />
                            </Box>
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Typography variant="caption" color="text.secondary">
                              Expense Tracking
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              {member.allowExpenseTracking ? (
                                <CheckCircleOutlineIcon color="success" fontSize="small" sx={{ mr: 0.5 }} />
                              ) : (
                                <CancelOutlinedIcon color="error" fontSize="small" sx={{ mr: 0.5 }} />
                              )}
                              <Switch
                                edge="end"
                                size="small"
                                checked={member.allowExpenseTracking}
                                onChange={() => handleTogglePermission(member.id, 'allowExpenseTracking')}
                                disabled={member.role === 'admin'}
                              />
                            </Box>
                          </Box>
                        </Grid>
                      </Grid> */}
                    </Box>
                  }
                />
              </ListItem>
              {index < members.length - 1 && <Divider variant="inset" component="li" />}
            </React.Fragment>
          ))}
        </List>
        
        {members.length === 0 && (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              No family members added yet. Click the "Add Member" button to get started.
            </Typography>
          </Box>
        )}
      </Paper>
      
      {/* Info Card */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3, 
          borderRadius: 3, 
          background: '#fff', 
          border: '1px solid #ccc',
          boxShadow: '0 2px 12px rgba(0,0,0,0.03)',
        }}
      >
        <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
          About Family Access
        </Typography>
        <Typography variant="body2" paragraph>
          Family members can have different roles and permissions:
        </Typography>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
            <SupervisorAccountIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
            Organization Owner
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
            Full access to all features of the organization, can manage members,income, and budget
          </Typography>
        </Box>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
            <EditIcon fontSize="small" sx={{ mr: 1, color: 'success.main' }} />
            Contributor
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
            Can add and modify expenses
                     </Typography>
        </Box>
        <Box>
          <Typography variant="subtitle2" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
            <VisibilityIcon fontSize="small" sx={{ mr: 1, color: 'info.main' }} />
            Viewer
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
            Can only view financial information, no editing capabilities
          </Typography>
        </Box>
      </Paper>
      
      {/* Add Member Modal */}
      <AddFamilyMemberForm 
        open={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onSave={handleAddMember} 
      />
      
      {/* Delete Confirmation Modal */}
      <Dialog
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight={700}>
            Remove Family Member
          </Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to remove this family member? They will lose access to your financial information.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={() => setIsDeleteModalOpen(false)} 
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteMember} 
            variant="contained" 
            color="error"
            sx={{ borderRadius: 2 }}
          >
            Remove
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 