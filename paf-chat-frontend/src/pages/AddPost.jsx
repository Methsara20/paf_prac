import { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  IconButton,
  Stack,
  LinearProgress,
} from "@mui/material";
import axios from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { toast } from "react-toastify";

export default function AddPost() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!title || !description || files.length === 0) {
      toast.error("All fields and at least one image are required.");
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    files.forEach((file) => formData.append("files", file));

    try {
      await axios.post("/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Post created!");
      navigate("/profile");
    } catch (err) {
      toast.error(err.response?.data?.message || "Post upload failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles([...files, ...selectedFiles]);
  };

  const handleRemoveFile = (index) => {
    const updated = [...files];
    updated.splice(index, 1);
    setFiles(updated);
  };

  return (
    <Container
      maxWidth="md"
      sx={{
        py: 5,
        background: "linear-gradient(160deg, #f5f7fa 0%, #e4e8ed 100%)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mb: 3,
          cursor: "pointer",
        }}
        onClick={() => navigate(-1)}
      >
        <ArrowBackIcon sx={{ color: "#00d982", mr: 1 }} />
        <Typography variant="body1" sx={{ color: "#00d982", fontWeight: 500 }}>
          Back
        </Typography>
      </Box>

      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 5 },
          borderRadius: 4,
          background: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(8px)",
          boxShadow: "0 8px 32px rgba(31, 38, 135, 0.05)",
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          fontWeight="bold"
          sx={{
            color: "#00d982",
            position: "relative",
            display: "inline-block",
            mb: 4,
            "&:after": {
              content: '""',
              position: "absolute",
              width: "60%",
              height: "4px",
              borderRadius: "2px",
              backgroundColor: "#00d982",
              bottom: "-10px",
              left: "0",
            },
          }}
        >
          Create New Post
        </Typography>

        <TextField
          fullWidth
          label="Title"
          variant="outlined"
          margin="normal"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{
            mb: 3,
            "& .MuiOutlinedInput-root": {
              "&.Mui-focused fieldset": {
                borderColor: "#2196f3",
              },
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: "#2196f3",
            },
          }}
        />

        <TextField
          fullWidth
          label="Description"
          variant="outlined"
          margin="normal"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          multiline
          rows={4}
          sx={{
            mb: 3,
            "& .MuiOutlinedInput-root": {
              "&.Mui-focused fieldset": {
                borderColor: "#2196f3",
              },
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: "#2196f3",
            },
          }}
        />

        <Box
          sx={{
            mt: 3,
            mb: 4,
            p: 3,
            borderRadius: 2,
            border: "2px dashed #2196f3",
            backgroundColor: "rgba(33, 150, 243, 0.05)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="body1" mb={2} color="text.secondary">
            Upload your images here
          </Typography>

          <Button
            component="label"
            variant="contained"
            startIcon={<PhotoCamera />}
            sx={{
              backgroundColor: "#00d982",
              borderRadius: 8,
              px: 3,
              py: 1,
              textTransform: "none",
              fontWeight: 600,
              boxShadow: "0 4px 15px rgba(33, 150, 243, 0.3)",
              "&:hover": {
                backgroundColor: "#00d982",
                boxShadow: "0 6px 20px rgba(33, 150, 243, 0.4)",
              },
            }}
          >
            Select Images
            <input
              type="file"
              accept="image/*,video/*"
              hidden
              multiple
              onChange={handleFileChange}
            />
          </Button>
        </Box>

        {/* Image Previews */}
        {files.length > 0 && (
          <Box mb={4}>
            <Typography
              variant="subtitle1"
              fontWeight="medium"
              gutterBottom
              color="text.secondary"
            >
              {files.length} {files.length === 1 ? "image" : "images"} selected
            </Typography>

            <Stack
              direction="row"
              spacing={2}
              mt={2}
              sx={{ flexWrap: "wrap", gap: 2 }}
            >
              {files.map((file, index) => (
                <Box
                  key={index}
                  sx={{
                    position: "relative",
                    width: 100,
                    height: 100,
                    borderRadius: 2,
                    overflow: "hidden",
                    border: "1px solid #e0e0e0",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                    transition: "transform 0.2s",
                    "&:hover": {
                      transform: "scale(1.05)",
                    },
                  }}
                >
                  {file.type.startsWith("video/") ? (
                    <video
                      src={URL.createObjectURL(file)}
                      controls
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: 8,
                      }}
                    />
                  ) : (
                    <img
                      src={URL.createObjectURL(file)}
                      alt="preview"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  )}
                  <IconButton
                    size="small"
                    onClick={() => handleRemoveFile(index)}
                    sx={{
                      position: "absolute",
                      top: 4,
                      right: 4,
                      backgroundColor: "rgba(255,255,255,0.9)",
                      color: "#f44336",
                      "&:hover": {
                        backgroundColor: "white",
                        color: "#d32f2f",
                      },
                      width: 24,
                      height: 24,
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}
            </Stack>
          </Box>
        )}

        {isSubmitting && (
          <Box sx={{ width: "100%", mb: 3 }}>
            <LinearProgress color="primary" />
          </Box>
        )}

        <Button
          fullWidth
          variant="contained"
          disabled={isSubmitting}
          sx={{
            mt: 2,
            py: 1.5,
            background: "#00d982",
            fontWeight: "600",
            borderRadius: 8,
            textTransform: "none",
            fontSize: "1rem",
            letterSpacing: 0.5,
            boxShadow: "0 4px 15px rgba(33, 150, 243, 0.35)",
            "&:hover": {
              background: "#00d982",
              boxShadow: "0 6px 20px rgba(33, 150, 243, 0.45)",
            },
          }}
          onClick={handleSubmit}
        >
          {isSubmitting ? "Uploading..." : "Create Post"}
        </Button>
      </Paper>
    </Container>
  );
}
