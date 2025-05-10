
import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
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
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import GoogleIcon from '@mui/icons-material/Google';

export default function SignUp() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [profileImage, setProfileImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const { fullName, email, password } = formData;
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!fullName || !email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("username", fullName);
      formDataToSend.append("email", email);
      formDataToSend.append("password", password);
      if (profileImage) {
        formDataToSend.append("file", profileImage);
      }

      const res = await axios.post("/auth/signup-with-image", formDataToSend);
      login(res.data.token);
      toast.success("Account created!");
      navigate("/home");
    } catch (err) {
      toast.error(err.response?.data?.message || "Sign up failed");
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
          Create Account
        </Typography>
        <Typography variant="body1" align="center" mb={4} sx={{ color: '#64748B' }}>
          Join LearnSpark and start your journey today
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <Box sx={{ position: 'relative', width: 100, height: 100 }}>
            <Avatar
              src={preview}
              sx={{
                width: 100,
                height: 100,
                boxShadow: '0 4px 14px rgba(0, 87, 217, 0.15)',
                border: '3px solid #fff'
              }}
            />
            <Button
              component="label"
              variant="contained"
              sx={{
                position: 'absolute',
                bottom: -5,
                right: -5,
                minWidth: 'unset',
                width: 36,
                height: 36,
                borderRadius: '50%',
                backgroundColor: '#00d982',
                '&:hover': { backgroundColor: '#00c274' }
              }}
            >
              <AddAPhotoIcon fontSize="small" />
              <input hidden type="file" accept="image/*" onChange={handleImageChange} />
            </Button>
          </Box>
        </Box>

        <Stack spacing={3}>
          <TextField
            label="Full Name"
            name="fullName"
            value={fullName}
            onChange={handleChange}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon sx={{ color: '#94A3B8' }} />
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
            label="Email Address"
            name="email"
            value={email}
            onChange={handleChange}
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
            name="password"
            type="password"
            value={password}
            onChange={handleChange}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon sx={{ color: '#94A3B8' }} />
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

          <Button
            fullWidth
            variant="contained"
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
            Create Account
          </Button>

          <Divider sx={{ my: 3 }}><Typography variant="body2" sx={{ color: '#94A3B8' }}>OR</Typography></Divider>

          <Button
            fullWidth
            variant="outlined"
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
          >
            Sign up with Google
          </Button>

          <Typography variant="body2" align="center" sx={{ mt: 3, color: '#64748B' }}>
            Already have an account?{' '}
            <Typography
              component="span"
              sx={{
                color: '#00d982',
                fontWeight: 600,
                cursor: 'pointer',
                '&:hover': { textDecoration: 'underline' }
              }}
              onClick={() => navigate("/signin")}
            >
              Sign in
            </Typography>
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}