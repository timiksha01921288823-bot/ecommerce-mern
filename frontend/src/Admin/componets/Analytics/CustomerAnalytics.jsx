import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Stack,
  Chip,
  Divider
} from '@mui/material';
import PieChartIcon from '@mui/icons-material/PieChart';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PersonIcon from '@mui/icons-material/Person';

const CustomerAnalytics = ({ data }) => {
  if (!data) {
    return (
      <Card>
        <CardHeader title="Customer Analytics" />
        <CardContent>
          <Typography color="textSecondary" align="center">
            No customer data available
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const stats = [
    {
      label: 'Total Customers',
      value: data.totalCustomers || 0,
      icon: <PersonIcon sx={{ color: '#2196F3' }} />
    },
    {
      label: 'Repeat Customers',
      value: data.repeatCustomers || 0,
      icon: <TrendingUpIcon sx={{ color: '#4CAF50' }} />
    },
    {
      label: 'Retention Rate',
      value: `${data.retentionRate || 0}%`,
      icon: <PieChartIcon sx={{ color: '#FF9800' }} />
    }
  ];

  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader title="👥 Customer Analytics" />
      <CardContent>
        <Stack spacing={3}>
          {/* Customer Stats */}
          <Box>
            {stats.map((stat, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                  {stat.icon}
                  <Typography variant="body2" color="textSecondary">
                    {stat.label}
                  </Typography>
                </Stack>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {stat.value}
                </Typography>
              </Box>
            ))}
          </Box>

          <Divider />

          {/* Top Customers */}
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 2 }}>
              Top 5 Customers (Lifetime Value)
            </Typography>
            {data.topCustomers && data.topCustomers.length > 0 ? (
              <List dense>
                {data.topCustomers.slice(0, 5).map((customer, index) => (
                  <ListItem key={index} sx={{ py: 0.5 }}>
                    <ListItemText
                      primary={
                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="body2">
                            #{index + 1} Customer
                          </Typography>
                          <Chip
                            label={`₹${(customer.totalSpent || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        </Stack>
                      }
                      secondary={
                        <Typography variant="caption">
                          {customer.orderCount} order(s)
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="textSecondary" align="center">
                No customer data available
              </Typography>
            )}
          </Box>

          <Divider />

          {/* Avg Lifetime Value */}
          <Box>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
              Average Customer Lifetime Value
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#4CAF50' }}>
              ₹{(data.avgLifetimeValue || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default CustomerAnalytics;
