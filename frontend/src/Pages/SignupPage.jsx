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
import { getUser, register } from "../Redux/Auth/Action";

export default function SignupPage() {
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
      setSnackBarMessage("Account Created Successfully! Redirecting...");
      setSnackBarSeverity("success");
      setOpenSnackBar(true);
      setTimeout(() => {
        navigate("/");
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
      firstName: data.get("firstName"),
      lastName: data.get("lastName"),
      email: data.get("email"),
      password: data.get("password"),
    };

    // Validation
    if (!userData.firstName || !userData.lastName || !userData.email || !userData.password) {
      setSnackBarMessage("Please fill in all fields");
      setSnackBarSeverity("error");
      setOpenSnackBar(true);
      return;
    }

    if (userData.password.length < 6) {
      setSnackBarMessage("Password must be at least 6 characters");
      setSnackBarSeverity("error");
      setOpenSnackBar(true);
      return;
    }

    dispatch(register(userData));
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        alignItems: "center",
        py: 4,
      }}
    >
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
              Create Account
            </Typography>
            <Typography variant="body2" sx={{ color: "#666" }}>
              Join Shop With Zosh and start shopping today
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  id="firstName"
                  name="firstName"
                  label="First Name"
                  fullWidth
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  id="lastName"
                  name="lastName"
                  label="Last Name"
                  fullWidth
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
                  placeholder="At least 6 characters"
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="caption" sx={{ color: "#666" }}>
                  By creating an account, you agree to our Terms & Conditions
                </Typography>
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
                  {auth.isLoading ? "Creating Account..." : "Create Account"}
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
              Already have an account?
            </Typography>
            <Button
              onClick={() => navigate("/login")}
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
              Sign In
            </Button>
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
