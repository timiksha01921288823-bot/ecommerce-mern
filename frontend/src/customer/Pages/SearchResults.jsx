import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Box, CircularProgress, Container, Typography } from '@mui/material';
import api from '../../config/api';
import HomeProductCard from '../Components/Home/HomeProductCard';

const useQuery = () => new URLSearchParams(useLocation().search);

const SearchResults = () => {
  const query = useQuery();
  const searchTerm = query.get('q') || '';
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResults = async () => {
      if (!searchTerm.trim()) {
        setProducts([]);
        return;
      }

      setLoading(true);
      setError('');
      try {
        const { data } = await api.get(`/api/products/smart-search/${encodeURIComponent(searchTerm)}`);
        setProducts(data);
      } catch (err) {
        setError(err.response?.data?.error || err.message || 'Could not complete the search.');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [searchTerm]);

  return (
    <Container sx={{ py: 10 }}>
      <Typography variant="h4" gutterBottom>
        Smart search results
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Showing results for <strong>{searchTerm}</strong>
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : !products.length ? (
        <Typography color="text.secondary" sx={{ mt: 4 }}>
          No products matched your smart search. Try a different phrase like "office wear" or "party dress".
        </Typography>
      ) : (
        <Box sx={{ display: 'grid', gap: 24, gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', mt: 4 }}>
          {products.map((product) => (
            <HomeProductCard key={product._id} product={product} />
          ))}
        </Box>
      )}
    </Container>
  );
};

export default SearchResults;
