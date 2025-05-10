import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import toast from "react-hot-toast";
import JoinCreateChat from "./components/JoinCreateChat";
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import Home from './pages/Home';
import Profile from './pages/Profile';
import AddPost from './pages/AddPost';
import EditPost from './pages/EditPost';
import Navbar from './components/Navbar';
import Settings from './pages/Settings';
import OAuthSuccess from './pages/OAuthSuccess';
import FollowRequests from './components/FollowRequests';
import './App.css';


import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth/AuthContext'; // ✅

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return user ? children : <Navigate to="/signin" />;
}

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: '#f9f9f9',
      paper: '#ffffff',
    },
    primary: {
      main: '#ff5f6d',
    },
    secondary: {
      main: '#ffc371',
    },
    text: {
      primary: '#1e1e1e',
      secondary: '#555',
    },
  },
  typography: {
    fontFamily: "'Poppins', 'Roboto', sans-serif",
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          letterSpacing: '0.5px',
        },
      },
    },
  },
});

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider theme={lightTheme}>
        <CssBaseline />
        <Router>
          <Navbar />
          <ToastContainer position="top-right" theme="light" />

          <Routes>
            <Route path="/" element={<Navigate to="/signin" />} />
            <Route path="/home" element={<Home />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="/add-post" element={<PrivateRoute><AddPost /></PrivateRoute>} />
            <Route path="/edit-post/:id" element={<PrivateRoute><EditPost /></PrivateRoute>} />
            <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
            <Route path="/oauth-success" element={<OAuthSuccess />} />
            <Route path="/follow-requests" element={<PrivateRoute><FollowRequests /></PrivateRoute>} />
          </Routes>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}