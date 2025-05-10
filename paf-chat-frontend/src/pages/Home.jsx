
import { useEffect, useState } from "react";
import axios from "../api/axiosConfig";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
  List,
  ListItem,
  TextField,
  Button,
  Avatar,
  Skeleton,
  Fade,
  Divider,
  Paper
} from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Favorite,
  FavoriteBorder,
  Edit,
  Delete,
  ChatBubbleOutline,
  Send
} from "@mui/icons-material";
import "swiper/css";
import "swiper/css/pagination";

import { Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";


import Leftsidebar from "../components/homepage/Leftsidebar";
import RightSidebar from "../components/homepage/Rightsidebar";



export default function InstagramHomeFeed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState({});
  const [newCommentText, setNewCommentText] = useState({});
  const [likeStatus, setLikeStatus] = useState({});
  const [allUsers, setAllUsers] = useState([]);
  const [followStatus, setFollowStatus] = useState({});
  const [activeTab, setActiveTab] = useState("following");
  
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [showComments, setShowComments] = useState({});

  const { user } = useAuth();
  const navigate = useNavigate();
  const BASE_URL = "http://localhost:9090";

  useEffect(() => {
    loadPosts();
  }, [activeTab]);

  const loadPosts = () => {
    setLoading(true);
    const endpoint =
      activeTab === "all"
        ? "/posts/all"
        : activeTab === "my"
        ? "/posts/my"
        : "/posts/following";

    axios.get(endpoint).then((res) => {
      const normalized = res.data.map((p) => ({ ...p.post, user: p.user }));
      setPosts(normalized);

      // Initialize showComments state for each post
      const initialShowComments = {};
      normalized.forEach(post => {
        initialShowComments[post.id] = false;
      });
      setShowComments(initialShowComments);

      normalized.forEach((post) => {
        axios.get(`/comments/${post.id}`).then((res) => {
          setComments((prev) => ({ ...prev, [post.id]: res.data }));
        });
        axios.get(`/posts/${post.id}/like-status`).then((res) => {
          setLikeStatus((prev) => ({ ...prev, [post.id]: res.data }));
        });
      });
      setLoading(false);
    });

    axios.get("/users/all").then((res) => {
      setAllUsers(res.data);
      res.data.forEach((u) => {
        if (u.email !== user?.email) {
          axios.get(`/follow/status/${u.id}`).then((statusRes) => {
            setFollowStatus((prev) => ({
              ...prev,
              [u.id]: statusRes.data.status,
            }));
          });
        }
      });
    });
  };

  

  const handleCommentSubmit = (postId) => {
    const content = newCommentText[postId];
    if (!content) return;

    axios.post(`/comments/${postId}`, { content }).then((res) => {
      const newCommentResponse = {
        comment: res.data,
        user: {
          username: user?.username,
          email: user?.email,
          profileImage: user?.profileImage || "", // optional
        }
      };
    
      setComments((prev) => ({
        ...prev,
        [postId]: [...(prev[postId] || []), newCommentResponse],
      }));
      setNewCommentText((prev) => ({ ...prev, [postId]: "" }));
    });
  };

  const handleDelete = (commentId, postId) => {
    axios.delete(`/comments/${commentId}`).then(() => {
      setComments((prev) => ({
        ...prev,
        [postId]: prev[postId].filter((c) => c.comment.id !== commentId),
      }));
    });
  };

  const toggleLike = (postId) => {
    axios.post(`/posts/${postId}/like`).then(() => {
      axios.get(`/posts/${postId}/like-status`).then((res) => {
        setLikeStatus((prev) => ({ ...prev, [postId]: res.data }));
      });
    });
  };

  const handleFollowRequest = (userId) => {
    axios.post(`/follow/${userId}`).then(() => {
      setFollowStatus((prev) => ({ ...prev, [userId]: "PENDING" }));
    });
  };

  const handleUnfollow = (userId) => {
    axios.delete(`/follow/${userId}`).then(() => {
      setFollowStatus((prev) => ({ ...prev, [userId]: "NONE" }));
    });
  };

  
  
  const handleEditComment = (commentId, postId) => {
    axios.put(`/comments/${commentId}`, { content: editContent }).then((res) => {
      setComments((prev) => ({
        ...prev,
        [postId]: prev[postId].map((c) =>
          c.comment.id === commentId ? { ...c, comment: res.data } : c
        ),
      }));
      setEditingCommentId(null);
      setEditContent("");
    });
  };

  const toggleComments = (postId) => {
    setShowComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <Box sx={{ 
      display: "flex", 
      flexDirection: { xs: "column", md: "row" }, 
      minHeight: "100vh",
      bgcolor: "#fafafa" 
    }}>
      

      <Leftsidebar />

      <Box sx={{ 
        flex: 1, 
        maxWidth: 650, 
        mx: "auto", 
        my: { xs: 1, md: 4 }, 
        p: { xs: 0, md: 0 }, 
        width: "100%" 
      }}>
        <Paper 
          elevation={0} 
          sx={{ 
            borderRadius: { xs: 0, md: 3 }, 
            mb: 3,
            overflow: 'hidden',
            bgcolor: 'white'
          }}
        >
          <Box sx={{ 
            display: "flex", 
            justifyContent: "center", 
            borderBottom: "1px solid #efefef", 
            py: 1
          }}>
            {["following", "all", "my"].map((tab) => (
              <Button
                key={tab}
                onClick={() => setActiveTab(tab)}
                sx={{
                  textTransform: "none",
                  color: activeTab === tab ? "black" : "#8e8e8e",
                  borderBottom: activeTab === tab ? "2px solid black" : "none",
                  borderRadius: 0,
                  px: 3,
                  py: 1.5,
                  fontWeight: activeTab === tab ? 600 : 400,
                  fontSize: "0.9rem",
                  transition: "all 0.2s ease"
                }}
              >
                {tab === "following" ? "Following" : tab === "all" ? "Explore" : "My Posts"}
              </Button>
            ))}
          </Box>
        </Paper>

        <Fade in={!loading} timeout={500}>
          <Box>
            
              
           

            <Box>
              {loading ? (
                Array(3).fill().map((_, i) => (
                  <Paper key={i} elevation={0} sx={{ mb: 3, borderRadius: { xs: 0, md: 3 }, overflow: 'hidden' }}>
                    <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
                      <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
                      <Skeleton variant="text" width={120} />
                    </Box>
                    <Skeleton variant="rectangular" height={400} />
                    <Box sx={{ p: 2 }}>
                      <Skeleton variant="text" width={100} sx={{ mb: 1 }} />
                      <Skeleton variant="text" width="80%" />
                      <Skeleton variant="text" width="40%" sx={{ mb: 2 }} />
                    </Box>
                  </Paper>
                ))
              ) : (
                posts.map((post) => (
                  <Fade in key={post.id} timeout={400}>
                    <Paper 
                      elevation={0} 
                      sx={{ 
                        mb: 3, 
                        borderRadius: { xs: 0, md: 3 }, 
                        overflow: 'hidden',
                        transition: "all 0.3s ease"
                      }}
                    >
                      <Box sx={{ 
                        display: "flex", 
                        alignItems: "center", 
                        p: 2, 
                        borderBottom: "1px solid #f9f9f9" 
                      }}>
                        <Avatar
                          sx={{ 
                            mr: 1.5,
                            width: 40,
                            height: 40,
                            border: "2px solid #f5f5f5"
                          }}
                          src={post.user?.profileImage ? `${BASE_URL}${post.user.profileImage}` : undefined}
                          alt={post.user?.username}
                        >
                          {!post.user?.profileImage && post.user?.username?.charAt(0).toUpperCase()}
                        </Avatar>
                        <Typography variant="subtitle2" fontWeight="600">
                          {post.user?.username || "User"}
                        </Typography>
                      </Box>

                      {post.mediaPaths?.length > 0 && (
                        <Swiper 
                          spaceBetween={0} 
                          slidesPerView={1}
                          pagination={{
                            clickable: true,
                            dynamicBullets: true,
                          }}
                          modules={[Pagination]}
                        >
                          {post.mediaPaths.map((path, index) => (
                            <SwiperSlide key={index}>
                              <Box sx={{ position: 'relative', backgroundColor: '#f8f8f8' }}>
                                {path.toLowerCase().endsWith(".mp4") ? (
                                  <video
                                    src={`${BASE_URL}${path}`}
                                    controls
                                    style={{
                                      width: "100%",
                                      height: "auto",
                                      maxHeight: 600,
                                      objectFit: "cover",
                                    }}
                                  />
                                ) : (
                                  <img
                                    src={`${BASE_URL}${path}`}
                                    alt={`media-${index}`}
                                    style={{
                                      width: "100%",
                                      height: "auto",
                                      maxHeight: 600,
                                      objectFit: "cover",
                                    }}
                                    loading="lazy"
                                  />
                                )}
                              </Box>
                            </SwiperSlide>
                          ))}
                        </Swiper>
                      )}

                      <Box sx={{ p: 3 }}>
                        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                          <IconButton 
                            onClick={() => toggleLike(post.id)} 
                            sx={{ 
                              p: 1,
                              transition: "all 0.2s ease",
                              '&:hover': {
                                transform: 'scale(1.1)'
                              }
                            }}
                          >
                            {likeStatus[post.id]?.liked ? (
                              <Favorite sx={{ color: "#ed4956" }} />
                            ) : (
                              <FavoriteBorder />
                            )}
                          </IconButton>
                          <IconButton 
                            onClick={() => toggleComments(post.id)}
                            sx={{ 
                              p: 1,
                              transition: "all 0.2s ease",
                              '&:hover': {
                                transform: 'scale(1.1)'
                              }
                            }}
                          >
                            <ChatBubbleOutline />
                          </IconButton>
                        </Box>

                        <Typography variant="body2" fontWeight="600" sx={{ mb: 1 }}>
                          {likeStatus[post.id]?.likeCount || 0} {likeStatus[post.id]?.likeCount === 1 ? "like" : "likes"}
                        </Typography>

                        <Box sx={{ mb: 1.5 }}>
                          <Typography 
                            variant="body2" 
                            component="div"
                            sx={{ display: 'flex', gap: 1 }}
                          >
                            <Typography variant="body2" component="span" fontWeight="600" sx={{ mr: 0.5 }}>
                              {post.user?.username}
                            </Typography>
                            <span>{post.description}</span>
                          </Typography>
                        </Box>

                        {/* View all comments button */}
                        {comments[post.id]?.length > 0 && (
                          <Button 
                            onClick={() => toggleComments(post.id)}
                            sx={{ 
                              p: 0, 
                              mb: 1, 
                              textTransform: 'none',
                              color: '#8e8e8e',
                              fontSize: '0.85rem',
                              fontWeight: 400,
                              '&:hover': {
                                backgroundColor: 'transparent',
                                color: '#262626'
                              }
                            }}
                          >
                            {showComments[post.id] ? 'Hide comments' : `View all ${comments[post.id]?.length} comments`}
                          </Button>
                        )}

                        {/* Comments list */}
                        {showComments[post.id] && (
                          <List 
                            disablePadding 
                            sx={{ 
                              mt: 1,
                              mb: 2,
                              maxHeight: '200px',
                              overflowY: 'auto',
                              borderRadius: 1,
                              backgroundColor: '#f9f9f9',
                              p: 1
                            }}
                          >
                            {(comments[post.id] || []).map((item) => (
                              <ListItem 
                                key={item.comment.id} 
                                disablePadding 
                                disableGutters 
                                sx={{ 
                                  mb: 1,
                                  p: 1,
                                  borderRadius: 1,
                                  '&:hover': {
                                    backgroundColor: '#f1f1f1'
                                  }
                                }}
                              >
                                <Box sx={{ display: "flex", alignItems: "flex-start", width: "100%" }}>
                                  <Avatar
                                    sx={{ 
                                      mr: 1.5,
                                      width: 24,
                                      height: 24
                                    }}
                                    src={item.user?.profileImage ? `${BASE_URL}${item.user.profileImage}` : undefined}
                                  >
                                    {!item.user?.profileImage && item.user?.username?.charAt(0).toUpperCase()}
                                  </Avatar>
                                  
                                  {editingCommentId === item.comment.id ? (
                                    <TextField
                                      fullWidth
                                      size="small"
                                      variant="outlined"
                                      value={editContent}
                                      onChange={(e) => setEditContent(e.target.value)}
                                      onBlur={() => handleEditComment(item.comment.id, post.id)}
                                      onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                          e.preventDefault();
                                          handleEditComment(item.comment.id, post.id);
                                        }
                                      }}
                                      sx={{
                                        '& .MuiOutlinedInput-root': {
                                          borderRadius: 2
                                        }
                                      }}
                                    />
                                  ) : (
                                    <Box sx={{ flex: 1 }}>
                                      <Typography 
                                        variant="body2" 
                                        component="div"
                                        sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}
                                      >
                                        <Typography
                                          variant="body2"
                                          component="span"
                                          fontWeight="600"
                                          sx={{ mr: 0.5 }}
                                        >
                                          {item.user?.username || "User"}
                                        </Typography>
                                        <span>{item.comment.content}</span>
                                      </Typography>
                                    </Box>
                                  )}

                                  {(item.user?.email === user?.email || post.user?.email === user?.email) && (
                                    <Box display="flex">
                                      {item.user?.email === user?.email && (
                                        <IconButton
                                          size="small"
                                          onClick={() => {
                                            setEditingCommentId(item.comment.id);
                                            setEditContent(item.comment.content);
                                          }}
                                          sx={{ 
                                            p: 0.5,
                                            color: '#8e8e8e',
                                            '&:hover': {
                                              color: '#262626'
                                            }
                                          }}
                                        >
                                          <Edit fontSize="small" />
                                        </IconButton>
                                      )}
                                      <IconButton
                                        size="small"
                                        onClick={() => handleDelete(item.comment.id, post.id)}
                                        sx={{ 
                                          p: 0.5,
                                          color: '#8e8e8e',
                                          '&:hover': {
                                            color: '#ed4956'
                                          }
                                        }}
                                      >
                                        <Delete fontSize="small" />
                                      </IconButton>
                                    </Box>
                                  )}
                                </Box>
                              </ListItem>
                            ))}
                          </List>
                        )}

                        <Typography 
                          variant="caption" 
                          color="text.secondary" 
                          sx={{ 
                            display: "block",
                            fontSize: '0.75rem',
                            mt: 1
                          }}
                        >
                          {formatDate(post.createdAt)}
                        </Typography>

                        <Divider sx={{ my: 2 }} />

                        <Box sx={{ 
                          display: "flex", 
                          alignItems: "center",
                          position: 'relative'
                        }}>
                          <TextField
                            fullWidth
                            placeholder="Add a comment..."
                            variant="standard"
                            InputProps={{ 
                              disableUnderline: true,
                              sx: {
                                fontSize: '0.9rem',
                                py: 0.5
                              }
                            }}
                            value={newCommentText[post.id] || ""}
                            onChange={(e) =>
                              setNewCommentText((prev) => ({
                                ...prev,
                                [post.id]: e.target.value,
                              }))
                            }
                            onKeyPress={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                handleCommentSubmit(post.id);
                              }
                            }}
                            sx={{
                              '& .MuiInputBase-root': {
                                pr: 8
                              }
                            }}
                          />
                          <IconButton
                            onClick={() => handleCommentSubmit(post.id)}
                            disabled={!newCommentText[post.id]}
                            sx={{
                              position: 'absolute',
                              right: 0,
                              color: !newCommentText[post.id] ? "#b3dffc" : "#0095f6",
                              p: 1
                            }}
                          >
                            <Send fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>
                    </Paper>
                  </Fade>
                ))
              )}
            </Box>
          </Box>
        </Fade>
      </Box>

      <RightSidebar
        user={user}
        allUsers={allUsers}
        followStatus={followStatus}
        handleFollowRequest={handleFollowRequest}
        handleUnfollow={handleUnfollow}
      />
    </Box>
  );
}
