"use client";
import { useAuth } from "../lib/auth";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
} from "@mui/material";
import { PostAdd, Category, ExitToApp, Dashboard } from "@mui/icons-material";
import { useRouter } from "next/navigation";

export default function Navigation() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <AppBar position="static" elevation={2}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              fontWeight: 700,
              cursor: "pointer",
            }}
            onClick={() => router.push("/")}
          >
            🦉 SocialOwl Blog
          </Typography>

          <Box sx={{ display: "flex", gap: 1 }}>
            {user ? (
              <>
                <Button
                  color="inherit"
                  startIcon={<Dashboard />}
                  onClick={() => router.push("/")}
                >
                  Dashboard
                </Button>
                <Button
                  color="inherit"
                  startIcon={<Category />}
                  onClick={() => router.push("/categories")}
                >
                  Categories
                </Button>
                <Button
                  color="inherit"
                  startIcon={<PostAdd />}
                  onClick={() => router.push("/posts")}
                >
                  Posts
                </Button>
                <Button
                  color="inherit"
                  startIcon={<ExitToApp />}
                  onClick={handleLogout}
                >
                  Logout ({user.name || user.email}) {/* Fallback to email */}
                </Button>
              </>
            ) : (
              <>
                <Button
                  color="inherit"
                  onClick={() => router.push("/auth/login")}
                >
                  Login
                </Button>
                <Button
                  color="inherit"
                  onClick={() => router.push("/auth/register")}
                >
                  Register
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
