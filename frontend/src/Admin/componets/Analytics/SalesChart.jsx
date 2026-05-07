import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box
} from '@mui/material';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const SalesChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader title="Sales Overview" />
        <CardContent>
          <Typography color="textSecondary" align="center">
            No sales data available
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const chartData = data.map(item => ({
    month: item.month,
    sales: item.sales,
    orders: item.orders,
    delivered: item.delivered
  }));

  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader title="📈 Monthly Sales Overview" />
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip
              formatter={(value) => {
                if (typeof value === 'number' && value > 999) {
                  return `₹${(value / 1000).toFixed(1)}K`;
                }
                return value;
              }}
            />
            <Legend />
            <Bar dataKey="sales" fill="#4CAF50" name="Revenue (₹)" />
            <Bar dataKey="orders" fill="#2196F3" name="Orders" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default SalesChart;
