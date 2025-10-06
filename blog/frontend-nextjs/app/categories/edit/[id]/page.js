"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import AuthGuard from "../../../../components/AuthGuard";
import CategoryForm from "../../../../components/CategoryForm";
import { apiService } from "../../../../lib/api";
import { Container, CircularProgress, Box, Alert, Button } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useRouter } from "next/navigation";

export default function EditCategory() {
  const params = useParams();
  const router = useRouter();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadCategory();
  }, [params.id]);

  const loadCategory = async () => {
    try {
      const categories = await apiService.getCategories();
      const foundCategory = categories.find(
        (cat) => cat.id === parseInt(params.id)
      );
      if (foundCategory) {
        setCategory(foundCategory);
      } else {
        setError("Category not found");
      }
    } catch (err) {
      setError("Failed to load category: " + err.message);
    } finally {
      setLoading(false);
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
              onClick={() => router.push("/categories")}
            >
              Back to Categories
            </Button>
          }
        >
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <AuthGuard>
      <CategoryForm category={category} />
    </AuthGuard>
  );
}
