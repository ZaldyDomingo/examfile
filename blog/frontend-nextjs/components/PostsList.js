"use client";
import { useState, useEffect } from "react";
import { apiService } from "../lib/api";
import { useRouter } from "next/navigation";
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Alert,
  CircularProgress,
  Chip,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import {
  Add,
  Edit,
  Delete,
  Article,
  Visibility,
  Search,
  FilterList,
} from "@mui/icons-material";

export default function PostsList() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    status: "",
    categoryId: "",
    q: "",
    page: 0,
    size: 10,
  });
  const router = useRouter();

  useEffect(() => {
    loadPosts();
    loadCategories();
  }, [filters]);

  const loadPosts = async () => {
    try {
      const data = await apiService.getPosts(filters);
      setPosts(data.content || data); // Handle both paginated and non-paginated responses
      setError("");
    } catch (err) {
      setError("Failed to load posts: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await apiService.getCategories();
      setCategories(data);
    } catch (err) {
      console.error("Failed to load categories:", err);
    }
  };

  const handleDelete = async (id, title) => {
    if (!confirm(`Are you sure you want to delete post "${title}"?`)) return;

    try {
      await apiService.deletePost(id);
      setPosts(posts.filter((post) => post.id !== id));
      setError("");
    } catch (err) {
      setError("Failed to delete post: " + err.message);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 0, // Reset to first page when filters change
    }));
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

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Box display="flex" alignItems="center">
          <Article sx={{ mr: 1, fontSize: 32 }} color="primary" />
          <Typography variant="h4" component="h1">
            Posts
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => router.push("/posts/create")}
          size="large"
        >
          Create Post
        </Button>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            <FilterList sx={{ mr: 1, verticalAlign: "middle" }} />
            Filters
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Search posts..."
                value={filters.q}
                onChange={(e) => handleFilterChange("q", e.target.value)}
                InputProps={{
                  startAdornment: (
                    <Search sx={{ mr: 1, color: "text.secondary" }} />
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.status}
                  label="Status"
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                >
                  <MenuItem value="">All Status</MenuItem>
                  <MenuItem value="draft">Draft</MenuItem>
                  <MenuItem value="published">Published</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={filters.categoryId}
                  label="Category"
                  onChange={(e) =>
                    handleFilterChange("categoryId", e.target.value)
                  }
                >
                  <MenuItem value="">All Categories</MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Title</strong>
              </TableCell>
              <TableCell>
                <strong>Slug</strong>
              </TableCell>
              <TableCell>
                <strong>Category</strong>
              </TableCell>
              <TableCell>
                <strong>Status</strong>
              </TableCell>
              <TableCell>
                <strong>Author</strong>
              </TableCell>
              <TableCell>
                <strong>Created</strong>
              </TableCell>
              <TableCell>
                <strong>Actions</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {posts.map((post) => (
              <TableRow
                key={post.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                hover
              >
                <TableCell>
                  <Typography variant="body1" fontWeight="medium">
                    {post.title}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    /{post.slug}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={post.categoryName}
                    size="small"
                    variant="outlined"
                    color="primary"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={post.status}
                    size="small"
                    color={getStatusColor(post.status)}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{post.authorName}</Typography>
                </TableCell>
                <TableCell>
                  {new Date(post.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </TableCell>
                <TableCell>
                  <IconButton
                    color="info"
                    onClick={() => router.push(`/posts/${post.id}`)}
                    title="View post"
                  >
                    <Visibility />
                  </IconButton>
                  <IconButton
                    color="primary"
                    onClick={() => router.push(`/posts/edit/${post.id}`)}
                    title="Edit post"
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(post.id, post.title)}
                    title="Delete post"
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {posts.length === 0 && !loading && (
        <Paper sx={{ p: 4, textAlign: "center", mt: 2 }}>
          <Article sx={{ fontSize: 48, color: "text.secondary", mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            No Posts Found
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            {filters.q || filters.status || filters.categoryId
              ? "Try adjusting your filters to see more results."
              : "Get started by creating your first blog post."}
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => router.push("/posts/create")}
          >
            Create First Post
          </Button>
        </Paper>
      )}
    </Container>
  );
}
