

import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Tooltip,
  IconButton, Avatar
} from '@mui/material';
import {
  Home, Search, BookmarkBorder, Person,
  AddCircleOutline, Menu, Close, Add, RocketLaunch // ← Added RocketLaunch
} from '@mui/icons-material';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';


export default function Leftsidebar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const { user } = useAuth();

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMobileMenu = () => setMobileOpen(!mobileOpen);

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { icon: <Home />, text: "Home", path: "/home" },
    { icon: <Person />, text: "Profile", path: "/profile" },
  ];

  const renderNavItems = () => (
    <>
      {navItems.map((item) => (
        <Button
          key={item.path}
          component={Link}
          to={item.path}
          startIcon={item.icon}
          sx={{
            textTransform: 'none',
            color: isActive(item.path) ? '#000' : '#65676B',
            fontWeight: isActive(item.path) ? '700' : '500',
            backgroundColor: isActive(item.path) ? 'rgba(0, 217, 130, 0.1)' : 'transparent',
            borderRadius: '10px',
            py: 1.2,
            px: 2,
            justifyContent: { xs: 'center', md: 'flex-start' },
            width: '100%',
            '&:hover': {
              backgroundColor: 'rgba(0, 217, 130, 0.05)',
              transform: 'translateX(2px)'
            },
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            '& .MuiButton-startIcon': {
              marginRight: '12px',
              '& svg': {
                fontSize: '1.8rem'
              }
            }
          }}
        >
          <Box sx={{ display: { xs: 'none', md: 'block' }, ml: 1 }}>
            {item.text}
          </Box>
        </Button>
      ))}
    </>
  );

  // Mobile menu toggle button
  const mobileMenuToggle = (
    <Box 
      sx={{ 
        display: { xs: 'flex', md: 'none' }, 
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 1100,
      }}
    >
      <IconButton 
        onClick={toggleMobileMenu}
        sx={{ 
          backgroundColor: '#00d982',
          color: 'white',
          boxShadow: '0 4px 12px rgba(0, 217, 130, 0.3)',
          '&:hover': {
            backgroundColor: '#00c274',
            transform: 'scale(1.1)'
          },
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          width: 56,
          height: 56
        }}
      >
        {mobileOpen ? <Close /> : <Menu />}
      </IconButton>
    </Box>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <Box
        sx={{
          width: { xs: 0, md: 280 },
          flexShrink: 0,
          height: '100vh',
          position: 'sticky',
          top: 0,
          borderRight: '1px solid rgba(0, 0, 0, 0.05)',
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          bgcolor: '#FFFFFF',
          px: 2.5,
          py: 3,
          gap: 1.5,
          overflow: 'hidden',
        }}
      >
        {/* Logo */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: 4, 
          px: 1.5,
          '&:hover': {
            transform: 'scale(1.02)'
          },
          transition: 'transform 0.2s ease'
        }}>
          <Box sx={{
            mr: 1.5,
            p: 1,
            borderRadius: '12px',
            bgcolor: 'rgba(0, 217, 130, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <RocketLaunch sx={{ 
              color: '#00d982', 
              fontSize: 28,
            }} />
          </Box>
          <Typography
            variant="h5"
            component={Link}
            to="/home"
            sx={{
              fontFamily: "'Inter', sans-serif",
              textDecoration: 'none',
              color: '#00d982',
              fontWeight: '800',
              letterSpacing: '-0.5px',
              background: 'linear-gradient(45deg, #00d982, #00b8d9)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            LearnSpark
          </Typography>
        </Box>

        {/* Navigation Items */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 0.8,
          flexGrow: 1
        }}>
          {renderNavItems()}
        </Box>

        {/* Create New Post Button */}
        <Button
          variant="contained"
          startIcon={<AddCircleOutline sx={{ fontSize: '1.8rem' }} />}
          component={Link}
          to="/add-post"
          sx={{
            mt: 'auto',
            textTransform: 'none',
            borderRadius: '12px',
            fontWeight: '600',
            py: 1.5,
            px: 2,
            fontSize: '1rem',
            backgroundColor: '#00d982',
            color: 'white',
            '&:hover': {
              backgroundColor: '#00c274',
              boxShadow: '0 4px 12px rgba(0, 217, 130, 0.3)'
            },
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            '& .MuiButton-startIcon': {
              marginRight: '12px'
            }
          }}
        >
          <Box sx={{ display: { xs: 'none', md: 'block' } }}>
            New Post
          </Box>
        </Button>
      </Box>

      {/* Mobile Bottom Navigation */}
      <Box
        sx={{
          display: { xs: 'flex', md: 'none' },
          position: 'fixed',
          bottom: 0,
          left: 0,
          width: '100%',
          height: 72,
          backgroundColor: 'white',
          borderTop: '1px solid rgba(0, 0, 0, 0.05)',
          boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.03)',
          zIndex: 1000,
          justifyContent: 'space-around',
          alignItems: 'center',
        }}
      >
        {navItems.map((item) => (
          <Tooltip key={item.path} title={item.text} placement="top">
            <IconButton
              component={Link}
              to={item.path}
              sx={{
                color: isActive(item.path) ? '#00d982' : '#65676B',
                p: 1.5,
                '&:hover': {
                  backgroundColor: 'rgba(0, 217, 130, 0.05)',
                },
                '& svg': {
                  fontSize: '1.8rem'
                },
                transition: 'all 0.2s ease',
              }}
            >
              {item.icon}
            </IconButton>
          </Tooltip>
        ))}
      </Box>

      {/* Mobile Side Menu */}
      <Box
        sx={{
          display: { xs: mobileOpen ? 'block' : 'none', md: 'none' },
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(4px)',
          zIndex: 1050,
        }}
        onClick={toggleMobileMenu}
      />
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: '85%',
          maxWidth: 320,
          height: '100%',
          backgroundColor: 'white',
          zIndex: 1100,
          transform: mobileOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          display: { xs: 'flex', md: 'none' },
          flexDirection: 'column',
          p: 3,
          gap: 1,
          boxShadow: '-4px 0 20px rgba(0, 0, 0, 0.1)'
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          mb: 3,
          pb: 2,
          borderBottom: '1px solid rgba(0, 0, 0, 0.05)'
        }}>
          <Typography variant="h6" sx={{ fontWeight: '700', color: '#00d982' }}>
            Menu
          </Typography>
          <IconButton onClick={toggleMobileMenu} sx={{ color: '#65676B' }}>
            <Close />
          </IconButton>
        </Box>
        
        {/* Full navigation items for mobile side menu */}
        {navItems.map((item) => (
          <Button
            key={item.path}
            component={Link}
            to={item.path}
            startIcon={item.icon}
            onClick={toggleMobileMenu}
            sx={{
              textTransform: 'none',
              color: isActive(item.path) ? '#000' : '#65676B',
              fontWeight: isActive(item.path) ? '700' : '500',
              backgroundColor: isActive(item.path) ? 'rgba(0, 217, 130, 0.1)' : 'transparent',
              borderRadius: '10px',
              py: 1.5,
              px: 2,
              justifyContent: 'flex-start',
              width: '100%',
              '&:hover': {
                backgroundColor: 'rgba(0, 217, 130, 0.05)',
              },
              transition: 'all 0.2s ease',
              '& .MuiButton-startIcon': {
                marginRight: '12px',
                '& svg': {
                  fontSize: '1.8rem'
                }
              }
            }}
          >
            {item.text}
          </Button>
        ))}
        
        {/* Create Post Button in mobile menu */}
        <Button
          variant="contained"
          startIcon={<AddCircleOutline sx={{ fontSize: '1.8rem' }} />}
          component={Link}
          to="/add-post"
          onClick={toggleMobileMenu}
          sx={{
            mt: 'auto',
            textTransform: 'none',
            borderRadius: '12px',
            fontWeight: '600',
            py: 1.5,
            px: 2,
            fontSize: '1rem',
            backgroundColor: '#00d982',
            color: 'white',
            '&:hover': {
              backgroundColor: '#00c274'
            },
            transition: 'all 0.2s ease',
            '& .MuiButton-startIcon': {
              marginRight: '12px'
            }
          }}
        >
          New Post
        </Button>
      </Box>

      {mobileMenuToggle}
    </>
  );
}