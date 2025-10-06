"use client";
import { useState, useEffect } from "react";
import AuthGuard from "../../../components/AuthGuard";
import PostForm from "../../../components/PostForm";
import { apiService } from "../../../lib/api";
import { Container, CircularProgress, Box, Alert, Button } from "@mui/material";
import { useRouter } from "next/navigation";

export default function CreatePost() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // You can remove the post state since we're creating a new one
  // and let PostForm handle the empty form state

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
      <PostForm />
    </AuthGuard>
  );
}
