'use client';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import { useEffect } from 'react';
import { setUser, setLoading } from '@/store/slices/authSlice';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#f48fb1',
    },
  },
});

function AuthHydration({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('http://localhost:8000/api/v1/auth/me', { credentials: 'include' });
        if (res.ok) {
          const user = await res.json();
          store.dispatch(setUser(user));
        } else {
          store.dispatch(setLoading(false));
        }
      } catch (err) {
        store.dispatch(setLoading(false));
      }
    }
    checkAuth();
  }, []);

  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <AuthHydration>
          {children}
        </AuthHydration>
      </ThemeProvider>
    </Provider>
  );
}
