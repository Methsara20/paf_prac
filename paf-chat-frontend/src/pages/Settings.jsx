import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Box,
  Grid,
  Avatar,
  Divider,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "../api/axiosConfig";
import { toast } from "react-toastify";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import SaveIcon from "@mui/icons-material/Save";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { ArrowBack } from "@mui/icons-material";
export default function Settings() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    profileImage: null,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        username: user.username || "",
        email: user.email || "",
      }));
    }
  }, [user]);

  const handleUpdate = async () => {
    if (!form.username || !form.email) {
      toast.error("Username and email are required");
      return;
    }
    if (form.password && form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const formData = new FormData();
    formData.append("username", form.username);
    formData.append("email", form.email);
    if (form.password) formData.append("password", form.password);
    if (form.profileImage) formData.append("file", form.profileImage);

    try {
      await axios.put("/auth/update-profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, profileImage: file });
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 5 },
          borderRadius: 4,
          backgroundColor: "#fff",
          boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
        }}
      >
        {/* Back + Title Row */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Button
            onClick={() => navigate("/profile")}
            sx={{
              textTransform: "none",
              color: "#00e096", // green shade matching your image
              fontWeight: 500,
              fontSize: "1rem",
              display: "flex",
              alignItems: "center",
              gap: 1,
              backgroundColor: "transparent",
              boxShadow: "none",
              "&:hover": {
                backgroundColor: "transparent",
              },
            }}
          >
            <ArrowBack sx={{ fontSize: 20 }} />
            Back
          </Button>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
          <Typography variant="h4" fontWeight="600" color="#333">
            Account Settings
          </Typography>
        </Box>

        <Divider sx={{ mb: 5, backgroundColor: "rgba(0,0,0,0.06)" }} />

        <Grid container spacing={5}>
          <Grid
            item
            xs={12}
            md={4}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar
              src={
                previewImage
                  ? previewImage
                  : user?.profileImage
                  ? `http://localhost:9090${user.profileImage}`
                  : undefined
              }
              alt={user?.username}
              sx={{
                width: 180,
                height: 180,
                mb: 3,
                border: "4px solid #f5f5f5",
                fontSize: 56,
                bgcolor: "#00d982",
                boxShadow: "0 10px 25px rgba(99,102,241,0.2)",
              }}
            >
              {!previewImage &&
                !user?.profileImage &&
                user?.username?.charAt(0).toUpperCase()}
            </Avatar>

            <Button
              variant="outlined"
              component="label"
              fullWidth
              startIcon={<PhotoCamera />}
              sx={{
                color: "#00d982",
                borderColor: "#d1d5db",
                borderRadius: 2.5,
                py: 1.5,
                textTransform: "none",
                fontWeight: 500,
                "&:hover": {
                  borderColor: "#6366f1",
                  backgroundColor: "rgba(99,102,241,0.04)",
                },
              }}
            >
              Change Profile Photo
              <input
                hidden
                accept="image/*"
                type="file"
                onChange={handleImageChange}
              />
            </Button>
          </Grid>

          <Grid item xs={12} md={8}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  color="#4b5563"
                  fontWeight={500}
                  mb={1}
                >
                  Username
                </Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  value={form.username}
                  onChange={(e) =>
                    setForm({ ...form, username: e.target.value })
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon sx={{ color: "#00d982" }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      "& fieldset": { borderColor: "#d1d5db" },
                      "&:hover fieldset": { borderColor: "#6366f1" },
                      "&.Mui-focused fieldset": { borderColor: "#6366f1" },
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  color="#4b5563"
                  fontWeight={500}
                  mb={1}
                >
                  Email Address
                </Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon sx={{ color: "#00d982" }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      "& fieldset": { borderColor: "#d1d5db" },
                      "&:hover fieldset": { borderColor: "#6366f1" },
                      "&.Mui-focused fieldset": { borderColor: "#6366f1" },
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  color="#4b5563"
                  fontWeight={500}
                  mb={1}
                >
                  New Password
                </Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  type={showPassword ? "text" : "password"}
                  placeholder="Leave blank to keep current password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon sx={{ color: "#00d982" }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          edge="end"
                          onClick={() => setShowPassword(!showPassword)}
                          sx={{ color: "#9ca3af" }}
                        >
                          {showPassword ? (
                            <VisibilityOffIcon />
                          ) : (
                            <VisibilityIcon />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      "& fieldset": { borderColor: "#d1d5db" },
                      "&:hover fieldset": { borderColor: "#6366f1" },
                      "&.Mui-focused fieldset": { borderColor: "#6366f1" },
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  color="#4b5563"
                  fontWeight={500}
                  mb={1}
                >
                  Confirm New Password
                </Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your new password"
                  value={form.confirmPassword}
                  onChange={(e) =>
                    setForm({ ...form, confirmPassword: e.target.value })
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon sx={{ color: "#00d982" }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          edge="end"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          sx={{ color: "#9ca3af" }}
                        >
                          {showConfirmPassword ? (
                            <VisibilityOffIcon />
                          ) : (
                            <VisibilityIcon />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      "& fieldset": { borderColor: "#d1d5db" },
                      "&:hover fieldset": { borderColor: "#6366f1" },
                      "&.Mui-focused fieldset": { borderColor: "#6366f1" },
                    },
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Box
          sx={{
            mt: 5,
            display: "flex",
            gap: 2,
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <Button
            variant="contained"
            size="large"
            startIcon={<SaveIcon />}
            onClick={handleUpdate}
            sx={{
              flex: { xs: "auto", sm: 3 },
              bgcolor: "#00d982",
              color: "white",
              "&:hover": {
                bgcolor: "#00d982",
              },
              py: 1.5,
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              boxShadow: "0 4px 12px rgba(99,102,241,0.2)",
            }}
          >
            Save Changes
          </Button>

          <Button
            variant="outlined"
            startIcon={<DeleteOutlineIcon />}
            onClick={async () => {
              if (
                !window.confirm(
                  "Are you sure you want to delete your account? This action cannot be undone."
                )
              )
                return;

              try {
                await axios.delete("/auth/delete-account");
                toast.success("Account deleted. Goodbye!");
                localStorage.removeItem("token");
                window.location.href = "/signin";
              } catch (err) {
                toast.error(
                  err.response?.data?.message || "Account deletion failed"
                );
              }
            }}
            sx={{
              flex: { xs: "auto", sm: 2 },
              borderColor: "#ef4444",
              color: "#ef4444",
              borderRadius: 2,
              py: 1.5,
              textTransform: "none",
              fontWeight: 600,
              "&:hover": {
                borderColor: "#dc2626",
                backgroundColor: "rgba(239, 68, 68, 0.04)",
              },
            }}
          >
            Delete Account
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
