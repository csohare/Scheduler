import { useLayoutEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { AuthContextType, useAuth } from "../context/authProvider";
import { AppBar, Box, Button, IconButton, Toolbar } from "@mui/material";
import RocketIcon from "@mui/icons-material/Rocket";

export default function Root() {
  const { session, signIn, signOut } = useAuth() as AuthContextType;

  useLayoutEffect(() => {
    document.body.style.backgroundColor = "#222222";
  });
  const navigate = useNavigate();

  return (
    <Box width="100%" maxWidth="100%">
      <Box>
        <AppBar color="warning" position="static">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              sx={{ mr: 1 }}
              onClick={() => {
                navigate("/");
              }}
            >
              <RocketIcon fontSize="large" />
            </IconButton>
            {session?.user.role === "service_role" && (
              <Button
                onClick={() => navigate("/dashboard")}
                sx={{ color: "white", backgroundColor: "#222222" }}
              >
                Dashboard
              </Button>
            )}
            <Button
              sx={{
                color: "white",
                backgroundColor: "#222222",
                marginLeft: "auto",
              }}
              onClick={session ? signOut : signIn}
            >
              {session ? "Logout" : "Sign In"}
            </Button>
          </Toolbar>
        </AppBar>
      </Box>
      <Box>
        <Outlet />
      </Box>
    </Box>
    /*
    <div className="flex flex-col w-full">
      <div className="flex justify-center">
        <img
          className="transition ease-in-out scale-125 select-none hover:cursor-pointer hover:scale-150 duration-300"
          src="/logo.png"
          onClick={() => {
            navigate("/");
          }}
        />
      </div>
      <div>
        <Outlet />
      </div>
    </div>*/
  );
}
