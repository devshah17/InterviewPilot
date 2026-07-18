import React, { useState } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Button, TextField, Box, Typography, IconButton, useTheme 
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAppDispatch } from '@/store/store';
import { createTopic } from '@/store/slices/topicSlice';

const topicSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  description: z.string().max(500).optional(),
});

type TopicFormData = z.infer<typeof topicSchema>;

interface Props {
  open: boolean;
  onClose: () => void;
}

const GRADIENTS = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', // Purple
  'linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)', // Pink
  'linear-gradient(120deg, #d4fc79 0%, #96e6a1 100%)', // Green
  'linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)', // Cyan
  'linear-gradient(to right, #fa709a 0%, #fee140 100%)', // Orange/Yellow
];

export function CreateTopicModal({ open, onClose }: Props) {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const [selectedGradient, setSelectedGradient] = useState(GRADIENTS[0]);

  const { control, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<TopicFormData>({
    resolver: zodResolver(topicSchema),
    defaultValues: { title: '', description: '' },
  });

  const onSubmit = async (data: TopicFormData) => {
    try {
      await dispatch(createTopic({
        ...data,
        gradient_color: selectedGradient,
        tags: [],
        icon_name: 'TopicIcon',
      })).unwrap();
      reset();
      onClose();
    } catch (error) {
      console.error('Failed to create topic', error);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      PaperProps={{
        sx: {
          background: 'rgba(30, 30, 45, 0.85)',
          backdropFilter: 'blur(16px)',
          borderRadius: 3,
          border: '1px solid rgba(255, 255, 255, 0.1)',
          minWidth: '400px'
        }
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" fontWeight="bold">Create New Topic</Typography>
        <IconButton onClick={onClose} size="small" sx={{ color: 'text.secondary' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box component="form" id="topic-form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Topic Title"
                variant="outlined"
                fullWidth
                error={!!errors.title}
                helperText={errors.title?.message}
              />
            )}
          />
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Description (Optional)"
                variant="outlined"
                fullWidth
                multiline
                rows={3}
                error={!!errors.description}
                helperText={errors.description?.message}
              />
            )}
          />
          
          <Box>
            <Typography variant="caption" color="text.secondary" gutterBottom>
              Aesthetic Gradient
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
              {GRADIENTS.map((gradient) => (
                <Box
                  key={gradient}
                  onClick={() => setSelectedGradient(gradient)}
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: gradient,
                    cursor: 'pointer',
                    border: selectedGradient === gradient ? '2px solid white' : '2px solid transparent',
                    transition: 'all 0.2s',
                    '&:hover': { transform: 'scale(1.1)' }
                  }}
                />
              ))}
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button onClick={onClose} color="inherit">Cancel</Button>
        <Button 
          type="submit" 
          form="topic-form"
          variant="contained" 
          disabled={isSubmitting}
          sx={{ background: selectedGradient, color: '#121212', fontWeight: 'bold' }}
        >
          Create Topic
        </Button>
      </DialogActions>
    </Dialog>
  );
}
