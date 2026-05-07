import React, { useEffect, useState } from "react";
import {
  Grid,
  TextField,
  Button,
  Box,
  Snackbar,
  Alert,
  Container,
  Typography,
  Card,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getUser, login } from "../Redux/Auth/Action";

export default function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const jwt = localStorage.getItem("jwt");
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState("");
  const [snackBarSeverity, setSnackBarSeverity] = useState("success");
  const { auth } = useSelector((store) => store);

  const handleCloseSnackbar = () => setOpenSnackBar(false);

  useEffect(() => {
    if (jwt) {
      dispatch(getUser(jwt));
    }
  }, [jwt, dispatch]);

  useEffect(() => {
    if (auth.user) {
      setSnackBarMessage("Login Successful!");
      setSnackBarSeverity("success");
      setOpenSnackBar(true);
      setTimeout(() => {
        if (auth.user?.role === "ADMIN") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      }, 1500);
    }
  }, [auth.user, navigate]);

  useEffect(() => {
    if (auth.error) {
      setSnackBarMessage(auth.error);
      setSnackBarSeverity("error");
      setOpenSnackBar(true);
    }
  }, [auth.error]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const userData = {
      email: data.get("email"),
      password: data.get("password"),
    };

    if (!userData.email || !userData.password) {
      setSnackBarMessage("Please fill in all fields");
      setSnackBarSeverity("error");
      setOpenSnackBar(true);
      return;
    }

    dispatch(login(userData));
  };

  return (
    <Box sx={{ minHeight: "100vh", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", display: "flex", alignItems: "center", py: 4 }}>
      <Container maxWidth="sm">
        <Card
          sx={{
            p: 4,
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
            borderRadius: "12px",
          }}
        >
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Typography
              variant="h4"
              sx={{ fontWeight: 700, color: "#1a1a1a", mb: 1 }}
            >
              Welcome Back
            </Typography>
            <Typography variant="body2" sx={{ color: "#666" }}>
              Sign in to your account to continue shopping
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  required
                  id="email"
                  name="email"
                  label="Email Address"
                  fullWidth
                  type="email"
                  placeholder="you@example.com"
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  required
                  id="password"
                  name="password"
                  label="Password"
                  fullWidth
                  type="password"
                  placeholder="Enter your password"
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={auth.isLoading}
                  sx={{
                    padding: "12px 0",
                    fontSize: "1rem",
                    fontWeight: 600,
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    borderRadius: "8px",
                    textTransform: "none",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #5568d3 0%, #6a3f91 100%)",
                    },
                  }}
                >
                  {auth.isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </Grid>
            </Grid>
          </form>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mt: 3,
              pt: 3,
              borderTop: "1px solid #eee",
            }}
          >
            <Typography variant="body2" sx={{ color: "#666", mr: 1 }}>
              Don't have an account?
            </Typography>
            <Button
              onClick={() => navigate("/register")}
              sx={{
                textTransform: "none",
                color: "#667eea",
                fontWeight: 600,
                "&:hover": {
                  backgroundColor: "transparent",
                  textDecoration: "underline",
                },
              }}
            >
              Sign Up
            </Button>
          </Box>

          <Box sx={{ mt: 3, p: 2, backgroundColor: "#f5f5f5", borderRadius: "8px" }}>
            <Typography variant="caption" display="block" sx={{ color: "#999", mb: 1 }}>
              Demo Credentials:
            </Typography>
            <Typography variant="caption" display="block" sx={{ color: "#333" }}>
              <strong>Customer:</strong> test2@test.com / 12345678
            </Typography>
            <Typography variant="caption" display="block" sx={{ color: "#333" }}>
              <strong>Admin:</strong> admin@gmail.com / 12345678
            </Typography>
          </Box>
        </Card>
      </Container>

      <Snackbar open={openSnackBar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackBarSeverity}
          sx={{ width: "100%" }}
        >
          {snackBarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
