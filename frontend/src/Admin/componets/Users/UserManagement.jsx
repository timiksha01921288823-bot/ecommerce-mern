import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  ButtonGroup,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Alert,
  Chip,
  Stack,
  Typography,
  IconButton,
  Menu,
  MenuItem
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SecurityIcon from '@mui/icons-material/Security';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAllUsers,
  updateUserProfile,
  deleteUserAccount,
  promoteUserToAdmin,
  removeAdminPrivilege,
  clearSuccess
} from '../../../Redux/Admin/Users/Action';

const UserManagement = () => {
  const dispatch = useDispatch();
  const { users, loading, error, success } = useSelector(state => state.adminUsers || {});
  const [editingUser, setEditingUser] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      setDialogOpen(false);
      setEditingUser(null);
      setTimeout(() => dispatch(clearSuccess()), 2000);
    }
  }, [success, dispatch]);

  const handleEditClick = (user) => {
    setEditingUser(user);
    setFormData(user);
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (editingUser) {
      dispatch(updateUserProfile({
        userId: editingUser._id,
        data: formData
      }));
    }
  };

  const handleDelete = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      dispatch(deleteUserAccount(userId));
    }
  };

  const handlePromoteAdmin = (userId) => {
    if (window.confirm('Promote this user to admin?')) {
      dispatch(promoteUserToAdmin(userId));
    }
  };

  const handleRemoveAdmin = (userId) => {
    if (window.confirm('Remove admin privilege from this user?')) {
      dispatch(removeAdminPrivilege(userId));
    }
  };

  const handleMenuOpen = (event, user) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedUser(null);
  };

  if (loading && users.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
        👥 User Management
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>Operation successful!</Alert>}

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Role</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Mobile</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Joined</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(users) && users.length > 0 ? (
              users.map((user) => (
                <TableRow key={user._id} hover>
                  <TableCell>{user.firstName} {user.lastName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Chip
                      label={user.role === 'admin' ? 'Admin' : 'Customer'}
                      color={user.role === 'admin' ? 'error' : 'default'}
                      size="small"
                      icon={user.role === 'admin' ? <SecurityIcon /> : undefined}
                    />
                  </TableCell>
                  <TableCell>{user.mobile || 'N/A'}</TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuOpen(e, user)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl && selectedUser?._id === user._id)}
                      onClose={handleMenuClose}
                    >
                      <MenuItem onClick={() => {
                        handleEditClick(user);
                        handleMenuClose();
                      }}>
                        <EditIcon sx={{ mr: 1 }} /> Edit
                      </MenuItem>
                      {user.role !== 'admin' && (
                        <MenuItem onClick={() => {
                          handlePromoteAdmin(user._id);
                          handleMenuClose();
                        }}>
                          <SecurityIcon sx={{ mr: 1 }} /> Make Admin
                        </MenuItem>
                      )}
                      {user.role === 'admin' && (
                        <MenuItem onClick={() => {
                          handleRemoveAdmin(user._id);
                          handleMenuClose();
                        }}>
                          <SecurityIcon sx={{ mr: 1 }} /> Remove Admin
                        </MenuItem>
                      )}
                      <MenuItem onClick={() => {
                        handleDelete(user._id);
                        handleMenuClose();
                      }} sx={{ color: 'error.main' }}>
                        <DeleteIcon sx={{ mr: 1 }} /> Delete
                      </MenuItem>
                    </Menu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography color="textSecondary" sx={{ py: 2 }}>
                    No users found
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            fullWidth
            label="First Name"
            value={formData.firstName || ''}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Last Name"
            value={formData.lastName || ''}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Email"
            value={formData.email || ''}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Mobile"
            value={formData.mobile || ''}
            onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserManagement;
