import React, { useState } from "react";
import {
  styled,
  useTheme,
  Theme,
  CSSObject,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Drawer as MuiDrawer,
  Divider,
  IconButton,
} from "@mui/material";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { red, blue } from "@mui/material/colors";
import Logo from "../../../assets/react.svg";
import pages from "../../../datas/pages.tsx";
import { useNavigate } from "react-router-dom";
import { logout } from "../../../requests/auth.ts";
import { useAuth } from "../../../context/auth/authProvider.tsx";

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

interface DrawerComponentProps {
  handleDrawerOpen: () => void;
  open: boolean;
  selectedIndex: number;
}

export const DrawerComponent: React.FC<DrawerComponentProps> = (
  props: DrawerComponentProps,
) => {
  const { handleDrawerOpen, open, selectedIndex } = props;
  const theme = useTheme();
  const [selectedTabIndex, setSelectedTabIndex] = useState(selectedIndex);
  const navigate = useNavigate();
  const { setIsLogin, setUserInfo } = useAuth();

  return (
    <Drawer variant="permanent" open={open}>
      <DrawerHeader>
        <List>
          <ListItem>
            <ListItemIcon>
              <img src={Logo} alt="Logo" />
            </ListItemIcon>
            <ListItemText>Projet TA72</ListItemText>
          </ListItem>
        </List>
        <IconButton onClick={handleDrawerOpen}>
          {theme.direction === "rtl" ? (
            <ChevronRightIcon />
          ) : (
            <ChevronLeftIcon />
          )}
        </IconButton>
      </DrawerHeader>
      <Divider />
      <List>
        {pages.slice(0, 8).map(({ text, icons, path }, index) => (
          <ListItem key={text} disablePadding sx={{ display: "block" }}>
            <ListItemButton
              onClick={() => {
                setSelectedTabIndex(index);
                navigate("/" + path);
              }}
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                backgroundColor:
                  selectedTabIndex === index ? blue[100] : "transparent",
                px: 2.5,
                transition: "background-color 0.3s",
                "&:hover": {
                  backgroundColor: blue[50],
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : "auto",
                  justifyContent: "center",
                }}
              >
                <Tooltip title={text}>{icons}</Tooltip>
              </ListItemIcon>
              <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <List sx={{ marginTop: "auto" }}>
        <ListItem disablePadding sx={{ display: "block", bgcolor: red[100] }}>
          <ListItemButton
            sx={{
              minHeight: 48,
              justifyContent: open ? "initial" : "center",
              px: 2.5,
            }}
            onClick={() =>
              logout().then(() => {
                navigate("/login");
                setIsLogin((prevState) => !prevState);
                setUserInfo(null);
              })
            }
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: open ? 3 : "auto",
                justifyContent: "center",
              }}
            >
              <PowerSettingsNewIcon />
            </ListItemIcon>
            <ListItemText
              primary="Déconnexion"
              sx={{ opacity: open ? 1 : 0 }}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );
};
