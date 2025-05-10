
import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Container,
  Stack,
  Divider,
  InputAdornment,
  IconButton
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import axios from "../api/axiosConfig";
import { useAuth } from "../auth/AuthContext";
import GoogleIcon from '@mui/icons-material/Google';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!email || !password) {
      toast.error("Please fill in both email and password");
      return;
    }
    try {
      const res = await axios.post("/auth/signin", { email, password });
      login(res.data.token);
      toast.success("Login successful!");
      navigate("/home");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f0f4f8' }}>
      <Container
        maxWidth="sm"
        component={motion.div}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        sx={{
          bgcolor: '#ffffff',
          mt: { xs: 8, md: 12 },
          mb: 6,
          p: 4,
          borderRadius: 4,
          boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.08)'
        }}
      >
        <Typography variant="h4" fontWeight={700} mb={1} align="center" sx={{ color: '#00d982' }}>
          Welcome Back
        </Typography>
        <Typography variant="body1" align="center" mb={4} sx={{ color: '#64748B' }}>
          Please enter your details to sign in
        </Typography>

        <Stack spacing={3}>
          <TextField
            label="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon sx={{ color: '#94A3B8' }} />
                </InputAdornment>
              )
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                backgroundColor: '#F9FAFB'
              }
            }}
          />

          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon sx={{ color: '#94A3B8' }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword((prev) => !prev)}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                backgroundColor: '#F9FAFB'
              }
            }}
          />

          <Typography
            variant="body2"
            sx={{
              textAlign: 'right',
              color: '#00d982',
              fontWeight: 600,
              cursor: 'pointer',
              '&:hover': { textDecoration: 'underline' }
            }}
          >
            Forgot password?
          </Typography>

          <Button
            variant="contained"
            fullWidth
            onClick={handleSubmit}
            sx={{
              py: 1.5,
              borderRadius: 3,
              textTransform: 'none',
              background: 'linear-gradient(135deg, #00d982, #00b8d9)',
              fontWeight: 600,
              fontSize: '1rem',
              '&:hover': {
                background: 'linear-gradient(135deg, #00c274, #00a6c2)',
                boxShadow: '0 8px 16px rgba(0, 217, 130, 0.25)'
              }
            }}
          >
            Sign In
          </Button>

          <Divider sx={{ my: 3 }}><Typography variant="body2" sx={{ color: '#94A3B8' }}>OR</Typography></Divider>

          <Button
            variant="outlined"
            fullWidth
            startIcon={<GoogleIcon />}
            sx={{
              py: 1.5,
              borderRadius: 3,
              borderColor: '#E2E8F0',
              textTransform: 'none',
              fontWeight: 500,
              '&:hover': {
                borderColor: '#00d982',
                backgroundColor: '#F1F5F9'
              }
            }}
            onClick={() => window.location.href = "http://localhost:9090/oauth2/authorization/google"}
          >
            Sign in with Google
          </Button>

          <Typography variant="body2" align="center" sx={{ mt: 3, color: '#64748B' }}>
            Don't have an account?{' '}
            <Typography
              component="span"
              sx={{
                color: '#00d982',
                fontWeight: 600,
                cursor: 'pointer',
                '&:hover': { textDecoration: 'underline' }
              }}
              onClick={() => navigate("/signup")}
            >
              Sign up
            </Typography>
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}
