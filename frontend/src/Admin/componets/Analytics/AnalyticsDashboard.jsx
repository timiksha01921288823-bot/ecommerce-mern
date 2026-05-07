import React, { useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchDashboardSummary,
  fetchMonthlySales,
  fetchCustomerBehavior
} from '../../../Redux/Admin/Analytics/Action';
import DashboardCards from './DashboardCards';
import SalesChart from './SalesChart';
import CustomerAnalytics from './CustomerAnalytics';

const AnalyticsDashboard = () => {
  const dispatch = useDispatch();
  const {
    dashboardSummary,
    monthlySales,
    customerBehavior,
    loading,
    error
  } = useSelector(state => state.analytics || {});

  useEffect(() => {
    dispatch(fetchDashboardSummary());
    dispatch(fetchMonthlySales());
    dispatch(fetchCustomerBehavior());
  }, [dispatch]);

  if (loading && !dashboardSummary) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
        📊 Analytics Dashboard
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* Dashboard Cards */}
      <DashboardCards summary={dashboardSummary} />

      {/* Charts Section */}
      <Grid container spacing={3} sx={{ mt: 3 }}>
        {/* Sales Chart */}
        <Grid item xs={12} lg={8}>
          <SalesChart data={monthlySales} />
        </Grid>

        {/* Customer Analytics */}
        <Grid item xs={12} lg={4}>
          <CustomerAnalytics data={customerBehavior} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default AnalyticsDashboard;
