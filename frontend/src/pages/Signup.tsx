import { useEffect } from "react";
import { IoIosLogIn } from "react-icons/io";
import { Box, Typography, Button } from "@mui/material";
import CustomizedInput from "../components/shared/CustomizedInput";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  console.log({ name, email, password });
  const navigate = useNavigate();
  const auth = useAuth();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  try {
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long", {
        id: "signup",
      });
      return;
    }

    // (optional but good)
    if (!name || !email) {
      toast.error("All fields are required", { id: "signup" });
      return;
    }

    toast.loading("Signing Up", { id: "signup" });

    await auth?.signup(name, email, password);

    toast.success("Signed Up Successfully", { id: "signup" });
  } catch (error) {
    console.log(error);
    toast.error("Signing Up Failed", { id: "signup" });
  }
  };
  useEffect(() => {
    if (!auth?.isAuthLoading && auth?.isLoggedIn) {
      navigate("/chat", { replace: true });
    }
  }, [auth?.isAuthLoading, auth?.isLoggedIn, navigate]);
  return (
    <Box sx={{ width: "100%", height: "100%", display: "flex", flex: 1 }}>
      <Box sx={{ padding: 8, mt: 8, display: { md: "flex", sm: "none", xs: "none" } }}>
        <img src="airobot.png" alt="Robot" style={{ width: "400px" }} />
      </Box>
      <Box
        sx={{
          display: "flex",
          flex: { xs: 1, md: 0.5 },
          justifyContent: "center",
          alignItems: "center",
          padding: 2,
          ml: "auto",
          mt: 16,
        }}
      >
        <form
          onSubmit={handleSubmit}
          style={{
            margin: "auto",
            padding: "30px",
            boxShadow: "10px 10px 20px #000",
            borderRadius: "10px",
            border: "none",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Typography
              variant="h4"
              sx={{ textAlign: "center", padding: 2, fontWeight: 600 }}
            >
              Signup
            </Typography>
            <CustomizedInput
              type="text"
              name="name"
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <CustomizedInput
              type="email"
              name="email"
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <CustomizedInput
              type="password"
              name="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              sx={{
                px: 2,
                py: 1,
                mt: 2,
                width: "400px",
                borderRadius: 2,
                bgcolor: "#00fffc",
                ":hover": {
                  bgcolor: "white",
                  color: "black",
                },
              }}
              endIcon={<IoIosLogIn />}
            >
              Signup
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default Signup;
