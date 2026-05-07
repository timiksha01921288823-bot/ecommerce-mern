import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Stack
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

const DashboardCards = ({ summary }) => {
  if (!summary) {
    return null;
  }

  const { sales, users, products, customers } = summary;

  const cards = [
    {
      title: 'Total Revenue',
      value: `₹${(sales?.totalRevenue || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`,
      icon: <TrendingUpIcon sx={{ fontSize: 40, color: '#4CAF50' }} />,
      bgColor: '#E8F5E9',
      borderColor: '#4CAF50'
    },
    {
      title: 'Total Orders',
      value: sales?.totalOrders || 0,
      icon: <ShoppingCartIcon sx={{ fontSize: 40, color: '#2196F3' }} />,
      bgColor: '#E3F2FD',
      borderColor: '#2196F3'
    },
    {
      title: 'Total Users',
      value: users?.totalUsers || 0,
      icon: <PeopleIcon sx={{ fontSize: 40, color: '#FF9800' }} />,
      bgColor: '#FFF3E0',
      borderColor: '#FF9800'
    },
    {
      title: 'Active Users',
      value: users?.activeUsers || 0,
      icon: <LocalShippingIcon sx={{ fontSize: 40, color: '#9C27B0' }} />,
      bgColor: '#F3E5F5',
      borderColor: '#9C27B0'
    },
    {
      title: 'Avg Order Value',
      value: `₹${(sales?.averageOrderValue || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`,
      icon: <ShoppingCartIcon sx={{ fontSize: 40, color: '#FF5722' }} />,
      bgColor: '#FFEBEE',
      borderColor: '#FF5722'
    },
    {
      title: 'Repeat Customers',
      value: `${(customers?.retentionRate || 0)}%`,
      icon: <PeopleIcon sx={{ fontSize: 40, color: '#00BCD4' }} />,
      bgColor: '#E0F2F1',
      borderColor: '#00BCD4'
    }
  ];

  return (
    <Grid container spacing={2}>
      {cards.map((card, index) => (
        <Grid item xs={12} sm={6} lg={4} key={index}>
          <Card
            sx={{
              height: '100%',
              border: `2px solid ${card.borderColor}`,
              backgroundColor: card.bgColor,
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: `0 8px 16px rgba(0,0,0,0.1)`
              }
            }}
          >
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="flex-start">
                <Box sx={{ pt: 1 }}>
                  {card.icon}
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography
                    color="textSecondary"
                    gutterBottom
                    sx={{ fontSize: '0.85rem', fontWeight: 600 }}
                  >
                    {card.title}
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 'bold', fontSize: '1.5rem' }}
                  >
                    {card.value}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default DashboardCards;
