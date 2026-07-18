'use client';
import { Box, Drawer, AppBar, Toolbar, Typography, List, ListItem, ListItemIcon, ListItemText, ListItemButton, Divider, Button, Avatar, Chip } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import TopicIcon from '@mui/icons-material/Topic';
import SchoolIcon from '@mui/icons-material/School';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import LogoutIcon from '@mui/icons-material/Logout';
import QuizIcon from '@mui/icons-material/Quiz';
import SettingsIcon from '@mui/icons-material/Settings';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { logoutUser } from '@/store/slices/authSlice';
import { useRouter, usePathname } from 'next/navigation';

const drawerWidth = 260;

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  
  const handleLogout = async () => {
    try {
      await fetch('http://localhost:8000/api/v1/auth/logout', { 
        method: 'POST',
        credentials: 'include' 
      });
    } catch (e) {
      console.error(e);
    }
    dispatch(logoutUser());
    router.push('/login');
  };

  const navItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Mock Interviews', icon: <QuizIcon />, path: '/dashboard/interviews' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/dashboard/settings' },
  ];

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#121212' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            bgcolor: '#1a1a2e',
            color: 'white',
            borderRight: '1px solid rgba(255,255,255,0.05)'
          },
        }}
      >
        <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h5" fontWeight="bold" sx={{ background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' } as any}>
            InterviewPilot
          </Typography>
        </Box>

        <Box sx={{ px: 3, pb: 3 }}>
          <Box sx={{ p: 2, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Avatar sx={{ bgcolor: '#2196F3', width: 40, height: 40 }}>{user?.name?.charAt(0) || 'U'}</Avatar>
              <Box>
                <Typography variant="subtitle2" fontWeight="bold">{user?.name || 'User'}</Typography>
                <Typography variant="caption" color="text.secondary">{user?.email || ''}</Typography>
              </Box>
            </Box>
            <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="caption" color="text.secondary">Study Streak</Typography>
              <Chip size="small" icon={<LocalFireDepartmentIcon sx={{ color: '#ff9800 !important' }} />} label="3 Days" sx={{ bgcolor: 'rgba(255, 152, 0, 0.1)', color: '#ff9800', fontWeight: 'bold' }} />
            </Box>
          </Box>
        </Box>

        <List sx={{ px: 2, flexGrow: 1 }}>
          {navItems.map((item) => {
            const active = pathname === item.path;
            return (
              <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
                <ListItemButton 
                  onClick={() => router.push(item.path)}
                  sx={{ 
                    borderRadius: 2, 
                    bgcolor: active ? 'rgba(33, 150, 243, 0.15)' : 'transparent',
                    color: active ? '#2196F3' : 'text.secondary',
                    '&:hover': { bgcolor: 'rgba(33, 150, 243, 0.25)', color: '#2196F3' }
                  }}
                >
                  <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={<Typography fontWeight={active ? 'bold' : 'medium'}>{item.text}</Typography>} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
        <List sx={{ px: 2, pb: 2 }}>
          <ListItem disablePadding>
            <ListItemButton 
              onClick={handleLogout}
              sx={{ borderRadius: 2, color: 'text.secondary', '&:hover': { bgcolor: 'rgba(244, 67, 54, 0.1)', color: '#f44336' } }}
            >
              <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Sign Out" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 4, bgcolor: '#121212' }}>
        {children}
      </Box>
    </Box>
  );
}
