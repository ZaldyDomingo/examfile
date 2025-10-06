"use client";
import { useState } from "react";
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
} from "@mui/material";
import { Home, Category, ArrowBack } from "@mui/icons-material";

export default function CategoryForm({ category = null }) {
  const [formData, setFormData] = useState({
    name: category?.name || "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (category) {
        await apiService.updateCategory(category.id, formData);
      } else {
        await apiService.createCategory(formData);
      }
      router.push("/categories");
    } catch (err) {
      setError(err.message || "Failed to save category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
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
            onClick={() => router.push("/categories")}
            sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
          >
            <Category sx={{ mr: 0.5 }} fontSize="inherit" />
            Categories
          </Link>
          <Typography color="text.primary">
            {category ? "Edit Category" : "Create Category"}
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
              onClick={() => router.push("/categories")}
            />
            <Typography component="h1" variant="h4">
              {category ? "Edit Category" : "Create New Category"}
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Category Name"
              name="name"
              autoComplete="name"
              autoFocus
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter category name (e.g., Technology, Lifestyle, Business)"
              helperText="Choose a unique and descriptive name for your category"
            />
            <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                size="large"
                sx={{ minWidth: 120 }}
              >
                {loading ? "Saving..." : category ? "Update" : "Create"}
              </Button>
              <Button
                variant="outlined"
                onClick={() => router.push("/categories")}
                size="large"
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
