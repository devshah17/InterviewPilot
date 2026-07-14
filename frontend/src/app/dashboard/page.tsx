'use client';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { Typography, Paper, Grid, Box } from '@mui/material';

export default function DashboardPage() {
  const { user, isLoading } = useSelector((state: RootState) => state.auth);

  if (isLoading) {
    return <Typography>Loading session...</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ color: 'white' }}>
        Welcome back, {user?.name || 'Pilot'}! 🚀
      </Typography>
      <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)', mb: 4 }}>
        Ready to ace your next technical interview? Here's an overview of your progress.
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, bgcolor: '#1e1e2d', color: 'white' }}>
            <Typography variant="h6" gutterBottom color="primary">Active Topics</Typography>
            <Typography variant="h3">0</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, bgcolor: '#1e1e2d', color: 'white' }}>
            <Typography variant="h6" gutterBottom color="primary">Tests Taken</Typography>
            <Typography variant="h3">0</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, bgcolor: '#1e1e2d', color: 'white' }}>
            <Typography variant="h6" gutterBottom color="primary">Mock Interviews</Typography>
            <Typography variant="h3">0</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
