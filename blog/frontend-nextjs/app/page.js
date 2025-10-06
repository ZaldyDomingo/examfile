"use client";
import { useAuth } from "../lib/auth";
import { useRouter } from "next/navigation";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
} from "@mui/material";
import {
  PostAdd,
  Category,
  Dashboard as DashboardIcon,
} from "@mui/icons-material";

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

  if (!user) {
    return null;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box textAlign="center" mb={6}>
        <Typography variant="h3" component="h1" gutterBottom color="primary">
          Welcome to SocialOwl Blog!
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Manage your categories and posts efficiently
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              height: "100%",
              transition: "transform 0.2s",
              "&:hover": { transform: "translateY(-4px)" },
            }}
          >
            <CardContent sx={{ textAlign: "center", p: 4 }}>
              <DashboardIcon
                sx={{ fontSize: 48, color: "primary.main", mb: 2 }}
              />
              <Typography variant="h5" component="h2" gutterBottom>
                Dashboard
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Overview of your blogging activities and quick access to all
                features
              </Typography>
              <Button
                variant="contained"
                onClick={() => router.push("/posts")}
                fullWidth
              >
                Get Started
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card
            sx={{
              height: "100%",
              transition: "transform 0.2s",
              "&:hover": { transform: "translateY(-4px)" },
            }}
          >
            <CardContent sx={{ textAlign: "center", p: 4 }}>
              <Category sx={{ fontSize: 48, color: "secondary.main", mb: 2 }} />
              <Typography variant="h5" component="h2" gutterBottom>
                Categories
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Organize your posts into categories for better content
                management
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => router.push("/categories")}
                fullWidth
              >
                Manage Categories
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card
            sx={{
              height: "100%",
              transition: "transform 0.2s",
              "&:hover": { transform: "translateY(-4px)" },
            }}
          >
            <CardContent sx={{ textAlign: "center", p: 4 }}>
              <PostAdd sx={{ fontSize: 48, color: "success.main", mb: 2 }} />
              <Typography variant="h5" component="h2" gutterBottom>
                Posts
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Create, edit, and manage your blog posts with rich content
              </Typography>
              <Button
                variant="contained"
                color="success"
                onClick={() => router.push("/posts")}
                fullWidth
              >
                Manage Posts
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mt: 6, p: 3, bgcolor: "background.default", borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          Quick Stats
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <Typography variant="body2" color="text.secondary">
              Welcome, {user.name}!
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="body2" color="text.secondary">
              Role: {user.role}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="body2" color="text.secondary">
              Email: {user.email}
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
