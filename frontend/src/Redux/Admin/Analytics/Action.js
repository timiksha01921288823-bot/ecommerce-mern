import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5454/api';
const ADMIN_BASE_URL = `${API_BASE_URL}/admin`;

// ==================== THUNKS ====================

export const fetchDashboardSummary = createAsyncThunk(
  'admin/fetchDashboardSummary',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${ADMIN_BASE_URL}/analytics/dashboard/summary`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt')}`
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch dashboard summary');
    }
  }
);

export const fetchSalesAnalytics = createAsyncThunk(
  'admin/fetchSalesAnalytics',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${ADMIN_BASE_URL}/analytics/sales`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt')}`
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch sales analytics');
    }
  }
);

export const fetchMonthlySales = createAsyncThunk(
  'admin/fetchMonthlySales',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${ADMIN_BASE_URL}/analytics/sales/monthly`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt')}`
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch monthly sales');
    }
  }
);

export const fetchProductAnalytics = createAsyncThunk(
  'admin/fetchProductAnalytics',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${ADMIN_BASE_URL}/analytics/products`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt')}`
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch product analytics');
    }
  }
);

export const fetchUserAnalytics = createAsyncThunk(
  'admin/fetchUserAnalytics',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${ADMIN_BASE_URL}/analytics/users`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt')}`
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch user analytics');
    }
  }
);

export const fetchCustomerBehavior = createAsyncThunk(
  'admin/fetchCustomerBehavior',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${ADMIN_BASE_URL}/analytics/customers/behavior`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt')}`
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch customer behavior');
    }
  }
);

export const fetchCategoryAnalytics = createAsyncThunk(
  'admin/fetchCategoryAnalytics',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${ADMIN_BASE_URL}/analytics/categories`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt')}`
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch category analytics');
    }
  }
);

export const fetchReviewAnalytics = createAsyncThunk(
  'admin/fetchReviewAnalytics',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${ADMIN_BASE_URL}/analytics/reviews`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt')}`
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch review analytics');
    }
  }
);

// ==================== SLICE ====================

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState: {
    dashboardSummary: null,
    salesAnalytics: null,
    monthlySales: [],
    productAnalytics: null,
    userAnalytics: null,
    customerBehavior: null,
    categoryAnalytics: [],
    reviewAnalytics: null,
    loading: false,
    error: null
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // Dashboard Summary
    builder
      .addCase(fetchDashboardSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboardSummary = action.payload;
      })
      .addCase(fetchDashboardSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Sales Analytics
    builder
      .addCase(fetchSalesAnalytics.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSalesAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.salesAnalytics = action.payload;
      })
      .addCase(fetchSalesAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Monthly Sales
    builder
      .addCase(fetchMonthlySales.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMonthlySales.fulfilled, (state, action) => {
        state.loading = false;
        state.monthlySales = action.payload;
      })
      .addCase(fetchMonthlySales.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Product Analytics
    builder
      .addCase(fetchProductAnalytics.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProductAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.productAnalytics = action.payload;
      })
      .addCase(fetchProductAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // User Analytics
    builder
      .addCase(fetchUserAnalytics.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.userAnalytics = action.payload;
      })
      .addCase(fetchUserAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Customer Behavior
    builder
      .addCase(fetchCustomerBehavior.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCustomerBehavior.fulfilled, (state, action) => {
        state.loading = false;
        state.customerBehavior = action.payload;
      })
      .addCase(fetchCustomerBehavior.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Category Analytics
    builder
      .addCase(fetchCategoryAnalytics.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategoryAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.categoryAnalytics = action.payload;
      })
      .addCase(fetchCategoryAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Review Analytics
    builder
      .addCase(fetchReviewAnalytics.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchReviewAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.reviewAnalytics = action.payload;
      })
      .addCase(fetchReviewAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearError } = analyticsSlice.actions;
export default analyticsSlice.reducer;
