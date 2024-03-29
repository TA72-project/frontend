import React from "react";
import {
  styled,
  AppBarProps as MuiAppBarProps,
  AppBar as MuiAppBar,
  Toolbar,
  IconButton,
  Typography,
  Avatar,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useAuth } from "../../../context/auth/authProvider.tsx";

const drawerWidth = 240;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

interface AppBarComponentProps {
  handleDrawerOpen: () => void;
  open: boolean;
}

export const AppBarComponent: React.FC<AppBarComponentProps> = ({
  handleDrawerOpen,
  open,
}) => {
  const { userInfo } = useAuth();

  return (
    <AppBar position="fixed" open={open}>
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="open drawer"
          sx={{ mr: "auto", ...(open && { display: "none" }) }}
          onClick={handleDrawerOpen}
        >
          <MenuIcon />
        </IconButton>
        <Typography
          variant="h6"
          noWrap
          sx={{ flexGrow: 1, mr: "auto" }}
          component="div"
        ></Typography>
        <Avatar>{userInfo && userInfo?.fname[0] + userInfo?.lname[0]}</Avatar>
      </Toolbar>
    </AppBar>
  );
};
