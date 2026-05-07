import { useState } from 'react';
import { Box, Button, Grid, Paper, TextField, Typography } from '@mui/material';
import api from '../../../config/api';

const StyleAssistant = () => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('Ask me anything about styling, payment, or order support.');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    if (!query.trim()) {
      setError('Please enter a question.');
      return;
    }

    setIsLoading(true);
    try {
      const { data } = await api.post('/api/chatbot', { message: query });
      setResponse(data.answer || 'I could not find a helpful response right now.');
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Unable to connect to AI assistant.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box className="px-4 lg:px-20 py-10 bg-gray-50 min-h-screen">
      <Paper sx={{ p: 4, maxWidth: 900, margin: '0 auto' }} elevation={3}>
        <Typography variant="h4" gutterBottom>
          Style AI Assistant
        </Typography>
        <Typography sx={{ mb: 3, color: 'text.secondary' }}>
          Get fast outfit recommendations, checkout guidance, and custom styling tips.
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Ask the assistant"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                fullWidth
                multiline
                minRows={2}
                disabled={isLoading}
              />
            </Grid>
            <Grid item>
              <Button type="submit" variant="contained" disabled={isLoading}>
                {isLoading ? 'Thinking...' : 'Ask Style AI'}
              </Button>
            </Grid>
          </Grid>
        </form>

        {error ? (
          <Typography color="error" sx={{ mt: 3 }}>
            {error}
          </Typography>
        ) : null}

        <Box sx={{ mt: 4, p: 3, backgroundColor: '#fafafa', borderRadius: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Assistant Response
          </Typography>
          <Typography>{response}</Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default StyleAssistant;
