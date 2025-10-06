"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import AuthGuard from "../../../../components/AuthGuard";
import PostForm from "../../../../components/PostForm";
import { apiService } from "../../../../lib/api";
import { Container, CircularProgress, Box, Alert, Button } from "@mui/material";
import { useRouter } from "next/navigation";

export default function EditPost() {
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

  return (
    <AuthGuard>
      <PostForm post={post} />
    </AuthGuard>
  );
}
