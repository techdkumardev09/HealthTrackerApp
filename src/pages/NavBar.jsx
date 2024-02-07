import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import logo from"./logo.png";
import "./NavBar.css"

const NavBar = () => {
  return (
    <>
      <AppBar position="static">
        <Toolbar variant="dense" style={{ backgroundColor: "white"}}>
          <IconButton
            edge="start"
            color="black"
            aria-label="menu"
            sx={{ mr: 1 }}
          >
            <img src={logo} alt="logo" style={{height: '35px'}}/>
          </IconButton>
          <Typography
            variant="h4"
            style={{ color: "black", fontWeight: "bold" }}
            component="div"
          >
            Pulse
          </Typography>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default NavBar;
