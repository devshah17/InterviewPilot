'use client';
import { useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { Typography, Grid, Paper, Box, Button, CircularProgress, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { fetchTopics, deleteTopic } from '@/store/slices/topicSlice';
import { CreateTopicModal } from '@/components/dashboard/CreateTopicModal';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import TopicIcon from '@mui/icons-material/Topic';

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { topics, loading } = useAppSelector((state) => state.topics);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchTopics());
  }, [dispatch]);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Welcome back, {user?.name?.split(' ')[0] || 'Pilot'}! 🚀
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={() => setModalOpen(true)}
          sx={{ borderRadius: 2, textTransform: 'none', px: 3 }}
        >
          New Topic
        </Button>
      </Box>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
          <CircularProgress />
        </Box>
      ) : topics.length === 0 ? (
        <Paper sx={{ p: 8, textAlign: 'center', bgcolor: 'rgba(30, 30, 45, 0.4)', backdropFilter: 'blur(10px)', borderRadius: 4, border: '1px dashed rgba(255,255,255,0.2)' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>No topics found</Typography>
          <Typography variant="body2" color="text.disabled" mb={3}>Create your first topic to start your mock interview journey.</Typography>
          <Button variant="outlined" startIcon={<AddIcon />} onClick={() => setModalOpen(true)}>Create Topic</Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {topics.map((topic) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={topic.id}>
              <Paper 
                sx={{ 
                  p: 3, 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  background: 'rgba(30, 30, 45, 0.6)', 
                  backdropFilter: 'blur(12px)',
                  borderTop: `4px solid transparent`,
                  borderImage: `${topic.gradient_color} 1`,
                  borderRadius: 2,
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                  }
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box sx={{ p: 1, borderRadius: 2, background: topic.gradient_color, color: '#121212', display: 'flex' }}>
                    <TopicIcon />
                  </Box>
                  <IconButton size="small" onClick={() => dispatch(deleteTopic(topic.id))} sx={{ opacity: 0.5, '&:hover': { opacity: 1, color: 'error.main' } }}>
                    <DeleteOutlinedIcon fontSize="small" />
                  </IconButton>
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 2, mb: 1 }}>{topic.title}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1, mb: 2 }}>
                  {topic.description || 'No description provided.'}
                </Typography>
                <Typography variant="caption" color="text.disabled">
                  Created {new Date(topic.created_at).toLocaleDateString()}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      <CreateTopicModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </Box>
  );
}
