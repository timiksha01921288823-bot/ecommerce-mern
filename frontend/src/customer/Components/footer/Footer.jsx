import { Grid, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Grid
      className='bg-slate-950 text-slate-200'
      container
      sx={{ bgcolor: 'rgb(15, 23, 42)', color: 'rgb(226, 232, 240)', py: 10, px: 4 }}
    >
      <Grid item xs={12} md={3} sx={{ mb: { xs: 6, md: 0 } }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, letterSpacing: '0.08em', mb: 3 }}>
          Shop With Zosh
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgb(148, 163, 184)' }}>
          Modern fashion curated for everyday confidence with premium details and fast, polished shopping.
        </Typography>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 700, mb: 2 }}>
          Company
        </Typography>
        <Typography variant="body2" component="p" sx={{ color: 'rgb(148, 163, 184)' }} gutterBottom>
          About
        </Typography>
        <Typography variant="body2" component="p" sx={{ color: 'rgb(148, 163, 184)' }} gutterBottom>
          Careers
        </Typography>
        <Typography variant="body2" component="p" sx={{ color: 'rgb(148, 163, 184)' }} gutterBottom>
          Press
        </Typography>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 700, mb: 2 }}>
          Support
        </Typography>
        <Typography variant="body2" component="p" sx={{ color: 'rgb(148, 163, 184)' }} gutterBottom>
          Contact
        </Typography>
        <Typography variant="body2" component="p" sx={{ color: 'rgb(148, 163, 184)' }} gutterBottom>
          Shipping
        </Typography>
        <Typography variant="body2" component="p" sx={{ color: 'rgb(148, 163, 184)' }} gutterBottom>
          Returns
        </Typography>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 700, mb: 2 }}>
          Legal
        </Typography>
        <Typography variant="body2" component="p" sx={{ color: 'rgb(148, 163, 184)' }} gutterBottom>
          Privacy
        </Typography>
        <Typography variant="body2" component="p" sx={{ color: 'rgb(148, 163, 184)' }} gutterBottom>
          Terms
        </Typography>
      </Grid>
      <Grid item xs={12} sx={{ pt: 6, textAlign: 'center', color: 'rgb(148, 163, 184)' }}>
        <Typography variant="body2">© 2026 Shop With Zosh. All rights reserved.</Typography>
      </Grid>
    </Grid>
  );
};

export default Footer;
