
import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axiosConfig";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  Stack,
  IconButton,
} from "@mui/material";
import { toast } from "react-toastify";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Leftsidebar from "../components/homepage/Leftsidebar";

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState({
    title: "",
    description: "",
    mediaPaths: [],
  });
  const [files, setFiles] = useState([]);
  const BASE_URL = "http://localhost:9090";

  useEffect(() => {
    axios
      .get(`/posts/${id}`)
      .then((res) => setPost(res.data.post)) // backend returns { post, user }
      .catch(() => {
        toast.error("Failed to load post");
        navigate("/profile");
      });
  }, [id, navigate]);

  const handleUpdate = async () => {
    if (!post.title || !post.description) {
      toast.error("Title and description are required.");
      return;
    }

    const formData = new FormData();
    formData.append("title", post.title);
    formData.append("description", post.description);
    files.forEach((file) => formData.append("files", file));

    try {
      await axios.put(`/posts/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Post updated!");
      navigate("/profile");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update post");
    }
  };

  const handleFileChange = (e) => {
    setFiles((prev) => [...prev, ...Array.from(e.target.files)]);
  };

  const handleRemoveFile = (index) => {
    const updated = [...files];
    updated.splice(index, 1);
    setFiles(updated);
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles((prev) => [...prev, ...droppedFiles]);
  }, []);

  const handleDragOver = (e) => e.preventDefault();

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f5f7fa" }}>
      <Leftsidebar />
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 4,
            backgroundColor: "white",
            border: "1px solid #e0e0e0",
          }}
        >
          <Typography variant="h5" fontWeight="600" gutterBottom sx={{ mb: 3 }}>
            ✏️ Edit Your Post
          </Typography>

          <TextField
            fullWidth
            label="Post Title"
            variant="outlined"
            margin="normal"
            value={post.title}
            onChange={(e) => setPost({ ...post, title: e.target.value })}
          />

          <TextField
            fullWidth
            label="Description"
            multiline
            rows={4}
            variant="outlined"
            margin="normal"
            value={post.description}
            onChange={(e) => setPost({ ...post, description: e.target.value })}
          />

          {/* Existing Media */}
          {post.mediaPaths?.length > 0 && (
            <>
              <Typography variant="subtitle1" sx={{ mt: 4, mb: 1, color: "#555" }}>
                Existing Media
              </Typography>
              <Stack direction="row" spacing={2} flexWrap="wrap">
                {post.mediaPaths.map((path, i) => (
                  <Box
                    key={i}
                    sx={{
                      width: 100,
                      height: 100,
                      borderRadius: 2,
                      overflow: "hidden",
                      border: "1px solid #ddd",
                    }}
                  >
                    {path.match(/\.(mp4|webm)$/i) ? (
                      <video src={`${BASE_URL}${path}`} controls style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <img
                        src={`${BASE_URL}${path}`}
                        alt="existing"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    )}
                  </Box>
                ))}
              </Stack>
            </>
          )}

          {/* Drag & Drop Upload */}
          <Box
            mt={4}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            sx={{
              p: 4,
              border: "2px dashed #ccc",
              borderRadius: 3,
              textAlign: "center",
              color: "#777",
              backgroundColor: "#f9f9f9",
              cursor: "pointer",
            }}
          >
            <Typography variant="body1" fontWeight="500">
              Drag & drop media files here or
            </Typography>
            <Button
              component="label"
              sx={{ mt: 1, textTransform: "none", borderRadius: 2 }}
              variant="outlined"
            >
              📁 Select Files
              <input type="file" hidden multiple accept="image/*,video/*" onChange={handleFileChange} />
            </Button>
          </Box>

          {/* New Upload Previews */}
          {files.length > 0 && (
            <>
              <Typography variant="subtitle1" sx={{ mt: 4, mb: 1, color: "#555" }}>
                New Uploads
              </Typography>
              <Stack direction="row" spacing={2} flexWrap="wrap">
                {files.map((file, index) => (
                  <Box
                    key={index}
                    sx={{
                      position: "relative",
                      width: 100,
                      height: 100,
                      borderRadius: 2,
                      overflow: "hidden",
                      border: "1px solid #ccc",
                    }}
                  >
                    {file.type.includes("video") ? (
                      <video
                        src={URL.createObjectURL(file)}
                        controls
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    ) : (
                      <img
                        src={URL.createObjectURL(file)}
                        alt="preview"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    )}
                    <IconButton
                      onClick={() => handleRemoveFile(index)}
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 4,
                        right: 4,
                        backgroundColor: "rgba(0,0,0,0.4)",
                        color: "white",
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </Stack>
            </>
          )}

          <Stack direction="row" spacing={2} sx={{ mt: 5 }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate("/profile")}
              sx={{
                textTransform: "none",
                borderRadius: 3,
                borderColor: "#4d7cfe",
                color: "#00d982",
                "&:hover": {
                  borderColor: "#3a6bec",
                  backgroundColor: "rgba(77, 124, 254, 0.05)",
                },
              }}
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              size="large"
              onClick={handleUpdate}
              sx={{
                flex: 1,
                py: 1.5,
                fontWeight: "bold",
                backgroundColor: "#00d982",
                textTransform: "none",
                borderRadius: 3,
                "&:hover": {
                  backgroundColor: "#00d982",
                },
              }}
            >
              💾 Save Changes
            </Button>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}
