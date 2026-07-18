'use client';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TextField, Button, Box, Typography, Alert } from '@mui/material';
import { registerSchema, RegisterFormData } from '@/schemas/auth';
import Link from 'next/link';

export default function RegisterForm() {
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '' }
  });

  const onSubmit = async (data: RegisterFormData) => {
    setServerError('');
    setSuccess(false);
    try {
      const res = await fetch('http://localhost:8000/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data)
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || 'Registration failed');
      }
      
      setSuccess(true);
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1500);
    } catch (err: any) {
      setServerError(err.message);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 3, width: '100%', maxWidth: 400, margin: 'auto', mt: 8 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Join InterviewPilot
      </Typography>
      
      {serverError && <Alert severity="error">{serverError}</Alert>}
      {success && <Alert severity="success">Account created! Redirecting...</Alert>}
      
      <Controller
        name="name"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Full Name"
            variant="outlined"
            error={!!errors.name}
            helperText={errors.name?.message}
            fullWidth
          />
        )}
      />

      <Controller
        name="email"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Email"
            variant="outlined"
            error={!!errors.email}
            helperText={errors.email?.message}
            fullWidth
          />
        )}
      />
      
      <Controller
        name="password"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Password"
            type="password"
            variant="outlined"
            error={!!errors.password}
            helperText={errors.password?.message}
            fullWidth
          />
        )}
      />
      
      <Button 
        type="submit" 
        variant="contained" 
        color="primary" 
        size="large" 
        disabled={isSubmitting}
        sx={{ mt: 2 }}
        className="MuiButton-containedPrimary"
        data-testid="submit-btn"
      >
        {isSubmitting ? 'Creating account...' : 'Create Account'}
      </Button>

      <Typography align="center" sx={{ mt: 2 }}>
        Already have an account? <Link href="/login" style={{ color: '#90caf9' }}>Sign in here</Link>
      </Typography>
    </Box>
  );
}
