import React from "react";
import {
  AppBar,
  IconButton,
  Toolbar,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import Logo from "../../assets/react.svg";
import { useState } from "react";
import pages from "../../datas/pages.tsx";
import { useNavigate } from "react-router-dom";

export default function NavBar() {
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();
  const handleDrawerOpen = () => {
    setOpen((prevState)=>!prevState);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/auth/logout", {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
        navigate("/login");
      } else {
        console.error("Échec de la déconnexion");
      }
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
    }
  }

  return (
    <React.Fragment>
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="burgermenu"
            sx={{ mr: "auto" }}
            onClick={handleDrawerOpen}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer anchor="left" open={open} onClose={handleDrawerOpen}>
        <div style={{ height: 64 }} />
        <List>
          <ListItem>
            <ListItemIcon>
              <img src={Logo} alt="Logo" />
            </ListItemIcon>
            <ListItemText>TA72</ListItemText>
          </ListItem>
        </List>
        <Divider />
        <List>
          {pages.map(({ text, icons, path }) => (
            <ListItem key={text} disablePadding>
              <ListItemButton onClick={() => navigate("/" + path)}>
                <ListItemIcon>{icons}</ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <List sx={{ marginTop: "auto" }}>
          <ListItem disablePadding>
            <ListItemButton onClick={handleLogout}>
              <ListItemIcon>
                <PowerSettingsNewIcon />
              </ListItemIcon>
              <ListItemText primary="Déconnexion" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
    </React.Fragment>
  );
}
