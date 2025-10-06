"use client";
import { useState, useEffect } from "react";
import { apiService } from "@/lib/api";
import { useRouter } from "next/navigation";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  Breadcrumbs,
  Link,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from "@mui/material";
import { Home, Article, ArrowBack, Save, Cancel } from "@mui/icons-material";

export default function PostForm({ post = null }) {
  const [formData, setFormData] = useState({
    title: post?.title || "",
    slug: post?.slug || "",
    content: post?.content || "",
    status: post?.status || "draft",
    categoryId: post?.categoryId || "",
  });
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await apiService.getCategories();
      setCategories(data);
      // Set default category if none selected and categories exist
      if (!formData.categoryId && data.length > 0) {
        setFormData((prev) => ({ ...prev, categoryId: data[0].id }));
      }
    } catch (err) {
      setError("Failed to load categories: " + err.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Auto-generate slug from title
    if (name === "title" && !post) {
      const generatedSlug = value
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
      setFormData((prev) => ({ ...prev, slug: generatedSlug }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (
      !formData.title ||
      !formData.slug ||
      !formData.content ||
      !formData.categoryId
    ) {
      setError("Please fill in all required fields");
      return;
    }

    setLoading(true);

    try {
      if (post) {
        await apiService.updatePost(post.id, formData);
      } else {
        await apiService.createPost(formData);
      }
      router.push("/posts");
    } catch (err) {
      setError(err.message || "Failed to save post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
      {/* Breadcrumbs */}
      <Box sx={{ mt: 3, mb: 2 }}>
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
          <Typography color="text.primary">
            {post ? "Edit Post" : "Create Post"}
          </Typography>
        </Breadcrumbs>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: "100%", mt: 2 }}>
          <Box display="flex" alignItems="center" mb={3}>
            <ArrowBack
              sx={{ mr: 1, cursor: "pointer" }}
              onClick={() => router.push("/posts")}
            />
            <Typography component="h1" variant="h4">
              {post ? "Edit Post" : "Create New Post"}
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="title"
                  label="Post Title"
                  name="title"
                  autoComplete="title"
                  autoFocus
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter a compelling title for your post"
                  helperText="This will be displayed as the main headline"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="slug"
                  label="URL Slug"
                  name="slug"
                  autoComplete="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  placeholder="url-friendly-slug"
                  helperText="Unique identifier for the post URL"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel id="status-label">Status</InputLabel>
                  <Select
                    labelId="status-label"
                    id="status"
                    name="status"
                    value={formData.status}
                    label="Status"
                    onChange={handleChange}
                  >
                    <MenuItem value="draft">Draft</MenuItem>
                    <MenuItem value="published">Published</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel id="category-label">Category</InputLabel>
                  <Select
                    labelId="category-label"
                    id="categoryId"
                    name="categoryId"
                    value={formData.categoryId}
                    label="Category"
                    onChange={handleChange}
                  >
                    {categories.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="content"
                  label="Content"
                  name="content"
                  multiline
                  rows={12}
                  value={formData.content}
                  onChange={handleChange}
                  placeholder="Write your post content here..."
                  helperText="Support for Markdown or HTML can be added later"
                />
              </Grid>
            </Grid>

            <Box
              sx={{
                mt: 4,
                display: "flex",
                gap: 2,
                justifyContent: "flex-end",
              }}
            >
              <Button
                variant="outlined"
                startIcon={<Cancel />}
                onClick={() => router.push("/posts")}
                size="large"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={<Save />}
                disabled={loading}
                size="large"
                sx={{ minWidth: 120 }}
              >
                {loading ? "Saving..." : post ? "Update" : "Create"}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
