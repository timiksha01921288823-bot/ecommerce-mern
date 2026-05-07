import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5454/api';

// ==================== THUNKS ====================

export const fetchAllUsers = createAsyncThunk(
  'admin/fetchAllUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt')}`
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch users');
    }
  }
);

export const getUserById = createAsyncThunk(
  'admin/getUserById',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users/admin/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt')}`
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch user');
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'admin/updateUserProfile',
  async ({ userId, data }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/users/admin/${userId}`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt')}`
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update user');
    }
  }
);

export const deleteUserAccount = createAsyncThunk(
  'admin/deleteUserAccount',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/users/admin/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt')}`
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to delete user');
    }
  }
);

export const promoteUserToAdmin = createAsyncThunk(
  'admin/promoteUserToAdmin',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/users/admin/${userId}/promote`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwt')}`
          }
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to promote user');
    }
  }
);

export const removeAdminPrivilege = createAsyncThunk(
  'admin/removeAdminPrivilege',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/users/admin/${userId}/remove-admin`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwt')}`
          }
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to remove admin privilege');
    }
  }
);

// ==================== SLICE ====================

const adminUsersSlice = createSlice({
  name: 'adminUsers',
  initialState: {
    users: [],
    selectedUser: null,
    loading: false,
    error: null,
    success: false
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    clearSelectedUser: (state) => {
      state.selectedUser = null;
    }
  },
  extraReducers: (builder) => {
    // Fetch All Users
    builder
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Get User By ID
    builder
      .addCase(getUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedUser = action.payload;
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update User Profile
    builder
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.selectedUser = action.payload;
        const index = state.users.findIndex(u => u._id === action.payload._id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Delete User
    builder
      .addCase(deleteUserAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUserAccount.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.users = state.users.filter(u => u._id !== state.selectedUser?._id);
        state.selectedUser = null;
      })
      .addCase(deleteUserAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Promote User to Admin
    builder
      .addCase(promoteUserToAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(promoteUserToAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const user = action.payload.user;
        const index = state.users.findIndex(u => u._id === user._id);
        if (index !== -1) {
          state.users[index] = user;
        }
        state.selectedUser = user;
      })
      .addCase(promoteUserToAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Remove Admin Privilege
    builder
      .addCase(removeAdminPrivilege.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeAdminPrivilege.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const user = action.payload.user;
        const index = state.users.findIndex(u => u._id === user._id);
        if (index !== -1) {
          state.users[index] = user;
        }
        state.selectedUser = user;
      })
      .addCase(removeAdminPrivilege.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearError, clearSuccess, clearSelectedUser } = adminUsersSlice.actions;
export default adminUsersSlice.reducer;
