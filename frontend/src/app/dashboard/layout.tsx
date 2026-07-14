'use client';
import { Box, Drawer, AppBar, Toolbar, Typography, List, ListItem, ListItemIcon, ListItemText, ListItemButton, Divider, Button } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import TopicIcon from '@mui/icons-material/Topic';
import SchoolIcon from '@mui/icons-material/School';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import LogoutIcon from '@mui/icons-material/Logout';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { logoutUser } from '@/store/slices/authSlice';
import { useRouter } from 'next/navigation';

const drawerWidth = 260;

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:8000/api/v1/auth/logout', { method: 'POST' });
      dispatch(logoutUser());
      router.push('/login');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px`, backgroundColor: '#1e1e2d' }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Dashboard
          </Typography>
          <Typography variant="body1" sx={{ mr: 2 }}>
            {user?.name || 'User'}
          </Typography>
          <Button color="inherit" onClick={handleLogout} startIcon={<LogoutIcon />}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: '#151521',
            color: 'white',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar>
          <Typography variant="h6" sx={{ color: '#90caf9', fontWeight: 'bold' }}>
            InterviewPilot
          </Typography>
        </Toolbar>
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
        <List>
          {[
            { text: 'Overview', icon: <DashboardIcon /> },
            { text: 'Topics', icon: <TopicIcon /> },
            { text: 'Learning', icon: <SchoolIcon /> },
            { text: 'Mock Interview', icon: <SmartToyIcon /> },
          ].map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton sx={{ '&:hover': { backgroundColor: 'rgba(144,202,249,0.1)' } }}>
                <ListItemIcon sx={{ color: '#90caf9' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3, pt: 10, minHeight: '100vh' }}
      >
        {children}
      </Box>
    </Box>
  );
}
