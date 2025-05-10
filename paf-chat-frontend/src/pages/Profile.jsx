
import { useEffect, useState } from "react";
import axios from "../api/axiosConfig";
import {
  Container,
  Typography,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
  Card,
  CardContent,
  Box,
  Avatar,
  List,
  ListItem,
  ListItemText,
  Paper,
  Divider,
  Chip,
  Badge,
  Tooltip,
} from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ForumIcon from "@mui/icons-material/Forum";
import ImageIcon from "@mui/icons-material/Image";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import "swiper/css";
import { toast } from "react-toastify";
import Leftsidebar from "../components/homepage/Leftsidebar";


export default function Profile() {
  const [posts, setPosts] = useState([]);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [followRequests, setFollowRequests] = useState([]);
  const navigate = useNavigate();
  const BASE_URL = "http://localhost:9090";
  const [statuses, setStatuses] = useState([]);
  const [followCounts, setFollowCounts] = useState({
    followers: 0,
    following: 0,
  });

  const fetchFollowCounts = () => {
    axios.get("/follow/counts").then((res) => setFollowCounts(res.data));
  };

  const fetchPosts = () => {
    axios.get("/posts/my").then((res) => {
      const normalized = res.data.map((p) => ({ ...p.post, user: p.user }));
      setPosts(normalized);
    });
  };

  const fetchFollowRequests = () => {
    axios.get("/follow/requests").then((res) => setFollowRequests(res.data));
  };

  useEffect(() => {
    fetchPosts();
    fetchFollowRequests();
    fetchFollowCounts();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/posts/${id}`);
      toast.success("Post deleted");
      fetchPosts();
    } catch (err) {
      toast.error("Failed to delete post");
    } finally {
      setConfirmDeleteId(null);
    }
  };

  const handleAcceptFollow = (followId) => {
    axios.post(`/follow/accept/${followId}`).then(() => {
      toast.success("Follow request accepted");
      setFollowRequests((prev) => prev.filter((req) => req.id !== followId));
    });
  };

  

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        minHeight: "100vh",
        backgroundColor: "#f5f8ff",
        fontFamily: "'Inter', 'Poppins', sans-serif",
      }}
    >
      <Leftsidebar />
      <Container maxWidth="lg" sx={{ mt: { xs: 2, md: 4 }, pb: 6 }}>
        {/* Profile Header */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, md: 4 },
            mb: 4,
            borderRadius: "16px",
            backgroundColor: "white",
            border: "1px solid rgba(0,0,0,0.03)",
            boxShadow: "0 2px 20px rgba(0,0,0,0.05)",
            overflow: "hidden",
            position: "relative",
          }}
        >
          {/* Background pattern */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "80px",
              background: "linear-gradient(135deg,rgb(31, 223, 60) 0%,rgb(51, 255, 197) 100%)",
              opacity: 0.7,
              zIndex: 0,
            }}
          />
          
          <Box sx={{ position: "relative", zIndex: 1, pt: 4 }}>
            

            {/* Stats Display */}
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              mb={3}
              mt={4}
            >
              <Box
                display="flex"
                gap={5}
                sx={{
                  p: 3,
                  backgroundColor: "#f8faff",
                  borderRadius: "14px",
                  width: "fit-content",
                  boxShadow: "0px 2px 12px rgba(0,0,0,0.03)",
                  transition: "transform 0.2s ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0px 4px 15px rgba(0,0,0,0.05)",
                  },
                }}
              >
                <Box
                  textAlign="center"
                  sx={{
                    borderRight: "1px solid rgba(0,0,0,0.06)",
                    pr: 5,
                  }}
                >
                  <Typography variant="h4" fontWeight="700" sx={{ color: "#00d982" }}>
                    {followCounts.followers}
                  </Typography>
                  <Typography variant="body1" sx={{ color: "#64748B" }}>
                    Followers
                  </Typography>
                </Box>
                <Box textAlign="center">
                  <Typography variant="h4" fontWeight="700" sx={{ color: "#00d982" }}>
                    {followCounts.following}
                  </Typography>
                  <Typography variant="body1" sx={{ color: "#64748B" }}>
                    Following
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Paper>

        {/* Follow Requests Section */}
        {followRequests.length > 0 && (
          <Paper
            elevation={0}
            sx={{
              mb: 4,
              p: { xs: 2, md: 3 },
              borderRadius: "16px",
              backgroundColor: "white",
              border: "1px solid rgba(0,0,0,0.03)",
              boxShadow: "0 2px 20px rgba(0,0,0,0.05)",
              transition: "all 0.3s ease",
              "&:hover": {
                boxShadow: "0 4px 25px rgba(0,0,0,0.07)",
              },
            }}
          >
            <Box display="flex" alignItems="center" mb={2}>
              <Badge badgeContent={followRequests.length} color="error" sx={{ mr: 1 }}>
                <PersonAddIcon sx={{ color: "#0057D9" }} />
              </Badge>
              <Typography variant="h6" fontWeight="600" sx={{ color: "#0F172A" }}>
                Follow Requests
              </Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <List>
              {followRequests.map((req) => (
                <ListItem
                  key={req.id}
                  sx={{
                    mb: 1.5,
                    backgroundColor: "#f9faff",
                    borderRadius: "12px",
                    padding: 2,
                    transition: "all 0.2s ease",
                    "&:hover": { 
                      backgroundColor: "#f0f4ff",
                      transform: "translateX(2px)"
                    },
                  }}
                  secondaryAction={
                    <Button
                      onClick={() => handleAcceptFollow(req.id)}
                      variant="contained"
                      size="small"
                      sx={{
                        borderRadius: "10px",
                        textTransform: "none",
                        px: 2.5,
                        py: 1,
                        fontWeight: 600,
                        backgroundColor: "#0057D9",
                        boxShadow: "0 4px 10px rgba(0, 87, 217, 0.2)",
                        "&:hover": { 
                          backgroundColor: "#004FC3",
                          transform: "translateY(-2px)",
                          boxShadow: "0 6px 15px rgba(0, 87, 217, 0.25)",
                        },
                      }}
                    >
                      Accept
                    </Button>
                  }
                >
                  <Avatar 
                    sx={{ 
                      mr: 2, 
                      bgcolor: "#0057D9",
                      width: 45,
                      height: 45,
                      boxShadow: "0 2px 10px rgba(0, 87, 217, 0.2)",
                    }}
                  >
                    {req.follower.username.charAt(0).toUpperCase()}
                  </Avatar>
                  <ListItemText
                    primary={
                      <Typography fontWeight="600" sx={{ color: "#0F172A", mb: 0.5 }}>
                        {req.follower.username}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="body2" sx={{ color: "#64748B" }}>
                        {req.follower.email}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        )}

        {/* Post Controls */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
          flexDirection={{ xs: "column", sm: "row" }}
          gap={2}
        >
          <Typography 
            variant="h5" 
            fontWeight="700" 
            sx={{ 
              color: "#0F172A",
              position: "relative",
              "&:after": {
                content: '""',
                position: "absolute",
                width: "30%",
                height: "3px",
                borderRadius: "3px",
                backgroundColor: "#0057D9",
                bottom: "-8px",
                left: "0"
              }
            }}
          >
            My Posts
          </Typography>
          <Box display="flex" gap={2} flexWrap="wrap" justifyContent={{ xs: "center", sm: "flex-end" }}>
            <Button
              variant="contained"
              startIcon={<AddCircleOutlineIcon />}
              onClick={() => navigate("/add-post")}
              sx={{
                borderRadius: "12px",
                textTransform: "none",
                px: 3,
                py: 1.2,
                fontWeight: 600,
                background: "linear-gradient(135deg,rgb(31, 223, 60) 0%,rgb(51, 255, 197) 100%)",
                boxShadow: "0 4px 14px rgba(0, 87, 217, 0.25)",
                transition: "all 0.3s ease",
                "&:hover": { 
                  background: "linear-gradient(135deg,rgb(31, 223, 60) 0%,rgb(51, 255, 197) 100%)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 20px rgba(0, 87, 217, 0.35)",
                },
              }}
            >
              Add Post
            </Button>
            
          </Box>
        </Box>

        {/* Posts Grid */}
        <Grid container spacing={3}>
          {posts.map((post) => (
            <Grid item xs={12} sm={6} lg={4} key={post.id}>
              <Card
                sx={{
                  bgcolor: "white",
                  borderRadius: "16px",
                  overflow: "hidden",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                  transition: "all 0.3s ease",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
                  },
                }}
              >
                {post.mediaPaths?.length > 0 ? (
                  <Box
                    sx={{
                      position: "relative",
                      width: "100%",
                      paddingTop: "70%", // Aspect ratio
                      overflow: "hidden",
                    }}
                  >
                    <Swiper 
                      slidesPerView={1} 
                      style={{ 
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0
                      }}
                    >
                      {post.mediaPaths.map((path, idx) => (
                        <SwiperSlide key={idx}>
                          <Box
                            sx={{
                              width: "100%",
                              height: "100%",
                              overflow: "hidden",
                              position: "absolute",
                              top: 0,
                              left: 0,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              backgroundColor: "#f0f0f0",
                            }}
                          >
                            {path.toLowerCase().endsWith(".mp4") ? (
                              <video
                                src={`${BASE_URL}${path}`}
                                controls
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                  backgroundColor: "#000",
                                }}
                              />
                            ) : (
                              <img
                                src={`${BASE_URL}${path}`}
                                alt={`media-${idx}`}
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                }}
                              />
                            )}
                          </Box>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                    
                    {/* Media indicator */}
                    <Chip 
                      icon={<ImageIcon sx={{ fontSize: 16 }} />}
                      label={`${post.mediaPaths.length}`}
                      size="small"
                      sx={{
                        position: "absolute",
                        bottom: 12,
                        left: 12,
                        backgroundColor: "rgba(255,255,255,0.85)",
                        backdropFilter: "blur(4px)",
                        zIndex: 10,
                        fontWeight: 500,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      }}
                    />
                    
                    {/* Action buttons */}
                    <Box
                      sx={{
                        position: "absolute",
                        top: 12,
                        right: 12,
                        display: "flex",
                        gap: 1,
                        zIndex: 10,
                      }}
                    >
                      <Tooltip title="Edit post">
                        <IconButton
                          size="small"
                          sx={{
                            bgcolor: "rgba(255,255,255,0.9)",
                            backdropFilter: "blur(4px)",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                            "&:hover": { 
                              bgcolor: "rgba(255,255,255,1)",
                              transform: "scale(1.1)",
                            },
                            transition: "all 0.2s ease",
                          }}
                          onClick={() => navigate(`/edit-post/${post.id}`)}
                        >
                          <EditIcon fontSize="small" sx={{ color: "#0057D9" }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete post">
                        <IconButton
                          size="small"
                          sx={{
                            bgcolor: "rgba(255,255,255,0.9)",
                            backdropFilter: "blur(4px)",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                            "&:hover": { 
                              bgcolor: "rgba(255,50,50,0.1)",
                              transform: "scale(1.1)",
                            },
                            transition: "all 0.2s ease",
                          }}
                          onClick={() => setConfirmDeleteId(post.id)}
                        >
                          <DeleteIcon fontSize="small" sx={{ color: "#ff3d57" }} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                ) : (
                  <Box
                    sx={{
                      height: 40,
                      display: "flex",
                      justifyContent: "flex-end",
                      gap: 1,
                      p: 1,
                    }}
                  >
                    <Tooltip title="Edit post">
                      <IconButton
                        size="small"
                        sx={{
                          bgcolor: "rgba(0,87,217,0.08)",
                          "&:hover": { 
                            bgcolor: "rgba(0,87,217,0.15)",
                            transform: "scale(1.1)",
                          },
                          transition: "all 0.2s ease",
                        }}
                        onClick={() => navigate(`/edit-post/${post.id}`)}
                      >
                        <EditIcon fontSize="small" sx={{ color: "#0057D9" }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete post">
                      <IconButton
                        size="small"
                        sx={{
                          bgcolor: "rgba(255,61,87,0.08)",
                          "&:hover": { 
                            bgcolor: "rgba(255,61,87,0.15)",
                            transform: "scale(1.1)",
                          },
                          transition: "all 0.2s ease",
                        }}
                        onClick={() => setConfirmDeleteId(post.id)}
                      >
                        <DeleteIcon fontSize="small" sx={{ color: "#ff3d57" }} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                )}
                
                <CardContent sx={{ p: 3, flexGrow: 1 }}>
                  <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <Avatar 
                      src={post.user?.profilePicture ? `${BASE_URL}${post.user.profilePicture}` : undefined}
                      sx={{ 
                        bgcolor: "#0057D9",
                        boxShadow: "0 2px 8px rgba(0,87,217,0.2)",
                        width: 40,
                        height: 40,
                      }}
                    >
                      {post.user?.username?.charAt(0).toUpperCase() || "U"}
                    </Avatar>
                    <Typography 
                      variant="subtitle2" 
                      sx={{ 
                        color: "#64748B",
                        fontWeight: 500,
                      }}
                    >
                      {post.user?.username || "You"}
                    </Typography>
                  </Box>
                  
                  <Typography 
                    variant="h6" 
                    sx={{
                      fontWeight: "600", 
                      mb: 1.5,
                      color: "#0F172A",
                      lineHeight: 1.3,
                    }}
                  >
                    {post.title}
                  </Typography>
                  
                  <Typography
                    variant="body2"
                    sx={{ 
                      color: "#475569",
                      lineHeight: 1.7,
                      fontSize: "0.95rem",
                    }}
                  >
                    {post.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={!!confirmDeleteId}
          onClose={() => setConfirmDeleteId(null)}
          PaperProps={{
            sx: {
              borderRadius: "16px",
              p: 1,
              backdropFilter: "blur(5px)",
              boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
            },
          }}
        >
          <DialogTitle sx={{ fontWeight: 600, pt: 3, px: 3 }}>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Typography variant="h6" sx={{ color: "#0F172A" }}>
                Delete Post
              </Typography>
              <IconButton 
                size="small" 
                onClick={() => setConfirmDeleteId(null)}
                sx={{
                  bgcolor: "rgba(0,0,0,0.05)",
                  "&:hover": { bgcolor: "rgba(0,0,0,0.1)" },
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
            <Typography variant="body2" sx={{ mt: 1, color: "#64748B", fontWeight: 400 }}>
              Are you sure you want to delete this post? This action cannot be undone.
            </Typography>
          </DialogTitle>
          <DialogActions sx={{ p: 3, pt: 2 }}>
            <Button
              onClick={() => setConfirmDeleteId(null)}
              sx={{
                borderRadius: "10px",
                textTransform: "none",
                px: 3,
                py: 1,
                fontWeight: 500,
                color: "#64748B",
                "&:hover": {
                  backgroundColor: "rgba(0,0,0,0.05)",
                },
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleDelete(confirmDeleteId)}
              variant="contained"
              sx={{
                borderRadius: "10px",
                textTransform: "none",
                px: 3,
                py: 1,
                fontWeight: 600,
                bgcolor: "#ff3d57",
                "&:hover": { 
                  bgcolor: "#e0354c",
                  boxShadow: "0 4px 12px rgba(255, 61, 87, 0.3)",
                },
                transition: "all 0.2s ease",
              }}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}