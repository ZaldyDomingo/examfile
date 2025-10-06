"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiService } from "@/lib/api";
import {
  Container,
  Box,
  Typography,
  Paper,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Divider,
  Breadcrumbs,
  Link,
} from "@mui/material";
import {
  Home,
  Article,
  ArrowBack,
  Edit,
  Delete,
  CalendarToday,
  Person,
  Category as CategoryIcon,
} from "@mui/icons-material";

export default function PostDetail() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (params.id) {
      loadPost();
    }
  }, [params.id]);

  const loadPost = async () => {
    try {
      const data = await apiService.getPost(params.id);
      setPost(data);
      setError("");
    } catch (err) {
      setError("Failed to load post: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete post "${post.title}"?`))
      return;

    try {
      await apiService.deletePost(post.id);
      router.push("/posts");
    } catch (err) {
      setError("Failed to delete post: " + err.message);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "published":
        return "success";
      case "draft":
        return "warning";
      default:
        return "default";
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="50vh"
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert
          severity="error"
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => router.push("/posts")}
            >
              Back to Posts
            </Button>
          }
        >
          {error}
        </Alert>
      </Container>
    );
  }

  if (!post) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="warning">Post not found.</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Breadcrumbs */}
      <Box sx={{ mb: 2 }}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link
            color="inherit"
            onClick={() => router.push("/")}
            sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
          >
            <Home sx={{ mr: 0.5 }} fontSize="inherit" />
            Home
          </Link>
          <Link
            color="inherit"
            onClick={() => router.push("/posts")}
            sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
          >
            <Article sx={{ mr: 0.5 }} fontSize="inherit" />
            Posts
          </Link>
          <Typography color="text.primary">{post.title}</Typography>
        </Breadcrumbs>
      </Box>

      <Paper elevation={3} sx={{ p: 4 }}>
        {/* Header */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
          mb={3}
        >
          <Box flex={1}>
            <Box display="flex" alignItems="center" mb={2}>
              <ArrowBack
                sx={{ mr: 1, cursor: "pointer" }}
                onClick={() => router.push("/posts")}
              />
              <Typography
                variant="h4"
                component="h1"
                gutterBottom
                sx={{ mb: 0 }}
              >
                {post.title}
              </Typography>
            </Box>

            <Box display="flex" flexWrap="wrap" gap={2} alignItems="center">
              <Chip
                label={post.status}
                color={getStatusColor(post.status)}
                size="small"
              />
              <Chip
                icon={<CategoryIcon />}
                label={post.categoryName}
                variant="outlined"
                size="small"
              />
              <Chip
                icon={<Person />}
                label={`By ${post.authorName}`}
                variant="outlined"
                size="small"
              />
              <Chip
                icon={<CalendarToday />}
                label={new Date(post.createdAt).toLocaleDateString()}
                variant="outlined"
                size="small"
              />
            </Box>
          </Box>

          <Box display="flex" gap={1} ml={2}>
            <Button
              variant="outlined"
              startIcon={<Edit />}
              onClick={() => router.push(`/posts/edit/${post.id}`)}
            >
              Edit
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<Delete />}
              onClick={handleDelete}
            >
              Delete
            </Button>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Slug */}
        <Box mb={3}>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            URL Slug:
          </Typography>
          <Typography
            variant="body1"
            fontFamily="monospace"
            bgcolor="grey.100"
            p={1}
            borderRadius={1}
          >
            /{post.slug}
          </Typography>
        </Box>

        {/* Content */}
        <Box>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            Content:
          </Typography>
          <Paper
            variant="outlined"
            sx={{ p: 3, bgcolor: "background.default" }}
          >
            <Typography variant="body1" whiteSpace="pre-wrap">
              {post.content}
            </Typography>
          </Paper>
        </Box>

        {/* Metadata */}
        <Box mt={4} p={2} bgcolor="grey.50" borderRadius={1}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Post Metadata:
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={3}>
            <Typography variant="body2">
              <strong>Created:</strong>{" "}
              {new Date(post.createdAt).toLocaleString()}
            </Typography>
            <Typography variant="body2">
              <strong>Updated:</strong>{" "}
              {new Date(post.updatedAt).toLocaleString()}
            </Typography>
            <Typography variant="body2">
              <strong>ID:</strong> {post.id}
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
