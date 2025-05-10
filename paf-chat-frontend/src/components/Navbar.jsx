import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Box,
  Badge,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "../api/axiosConfig";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const [notiAnchorEl, setNotiAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);

  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const initials = user?.username?.charAt(0)?.toUpperCase() || "U";

  // 🔁 Fetch notifications every 10 seconds
  useEffect(() => {
    let interval;
    if (user) {
      const fetchNotifications = () => {
        axios
          .get("/notifications")
          .then((res) => setNotifications(res.data))
          .catch(() => setNotifications([]));
      };

      fetchNotifications(); // initial
      interval = setInterval(fetchNotifications, 10000);
    }

    return () => clearInterval(interval);
  }, [user]);

  // ✅ Mark all as read
  const handleOpenNotifications = (e) => {
    setNotiAnchorEl(e.currentTarget);

    axios.put("/notifications/mark-read").then(() => {
      setNotifications(notifications.map((n) => ({ ...n, read: true })));
    });
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <AppBar position="sticky" color="default" elevation={1}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Logo */}
        <Typography
          variant="h6"
          sx={{
            cursor: user ? "pointer" : "not-allowed",
            opacity: user ? 1 : 0.5,
          }}
          onClick={() => {
            if (user) navigate("/home");
          }}
        >
          {/* SkillShare */}
        </Typography>

        {/* Right Side */}
        {user ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Button onClick={() => navigate("/learning-plans")}>
              {/* Learning */}
            </Button>

            {/* 🔔 Notifications */}
            <IconButton
              onClick={handleOpenNotifications}
              sx={{ color: "black" }}
            >
              <Badge badgeContent={unreadCount} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>

            <Menu
              anchorEl={notiAnchorEl}
              open={Boolean(notiAnchorEl)}
              onClose={() => setNotiAnchorEl(null)}
              PaperProps={{
                sx: {
                  bgcolor: "#2c2c2c",
                  color: "#fff",
                  width: 300,
                },
              }}
            >
              {notifications.length === 0 ? (
                <MenuItem disabled>No notifications</MenuItem>
              ) : (
                notifications.map((noti, i) => (
                  <MenuItem
                    key={i}
                    sx={{
                      whiteSpace: "normal",
                      fontWeight: noti.read ? "normal" : "bold",
                    }}
                  >
                    {noti.message}
                  </MenuItem>
                ))
              )}
            </Menu>

            {/* 👤 User Menu */}
            <IconButton onClick={handleMenuOpen}>
              <Avatar
                sx={{ width: 56, height: 56, mr: 2 }}
                src={
                  user.profileImage
                    ? `http://localhost:9090${user.profileImage}`
                    : undefined
                }
                alt={user.username}
              >
                {!user.profileImage && user.username?.charAt(0).toUpperCase()}
              </Avatar>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={!!anchorEl}
              onClose={handleMenuClose}
            >
              <MenuItem
                onClick={() => {
                  handleMenuClose();
                  navigate("/profile");
                }}
              >
                Profile
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleMenuClose();
                  navigate("/settings");
                }}
              >
                Settings
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleMenuClose();
                  logout();
                  navigate("/signin");
                }}
              >
                Logout
              </MenuItem>
            </Menu>
          </Box>
        ) : (
          <Button onClick={() => navigate("/signin")}>Login</Button>
        )}
      </Toolbar>
    </AppBar>
  );
}
