'use client';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TextField, Button, Box, Typography, Alert } from '@mui/material';
import { loginSchema, LoginFormData } from '@/schemas/auth';
import Link from 'next/link';

export default function LoginForm() {
  const [serverError, setServerError] = useState('');
  
  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' }
  });

  const onSubmit = async (data: LoginFormData) => {
    setServerError('');
    try {
      const res = await fetch('http://localhost:8000/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data)
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || 'Login failed');
      }
      
      window.location.href = '/dashboard';
    } catch (err: any) {
      setServerError(err.message);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 3, width: '100%', maxWidth: 400, margin: 'auto', mt: 8 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Sign In to InterviewPilot
      </Typography>
      
      {serverError && <Alert severity="error">{serverError}</Alert>}
      
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
        {isSubmitting ? 'Signing in...' : 'Sign In'}
      </Button>

      <Typography align="center" sx={{ mt: 2 }}>
        Don't have an account? <Link href="/register" style={{ color: '#90caf9' }}>Register here</Link>
      </Typography>
    </Box>
  );
}
