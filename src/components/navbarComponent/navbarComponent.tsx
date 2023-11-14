import { ReactElement, useState } from 'react';
import {
    styled,
    useTheme,
    Theme,
    CSSObject,
    AppBarProps as MuiAppBarProps,
    AppBar as MuiAppBar,
    Box,
    Toolbar,
    List,
    Typography,
    Drawer as MuiDrawer,
    CssBaseline,
    Divider,
    IconButton,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Avatar,
    Button,
    Tooltip,
} from '@mui/material';

import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';

import { red, blue } from '@mui/material/colors';

import Logo from '../../assets/react.svg';
import pages from '../../datas/pages.tsx';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/auth/authContext.ts';
import PageTitleComponent from '../pageTitleComponent/pageTitleComponent.tsx';

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        }),
    }),
);

interface Props{
    children: ReactElement | string,
    selectedIndex: number,
    breadcumbs: number[]
}

interface link {
    text: string;
    icons: ReactElement;
    path: string;
}

export default function NavbarComponent({ children, selectedIndex, breadcumbs }: Props) {

    const {logout} = useAuth();
    const navigate = useNavigate();
    const theme = useTheme();

    const links: link[] = [];

    breadcumbs.forEach(b => links.push(pages[b]));
    const [open, setOpen] = useState(false);
    const [selectedTabIndex, setSelectedTabIndex] = useState(selectedIndex);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" open={open}>
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="open drawer"
                        sx={{mr: "auto", ...(open && { display: 'none' }),}}
                        onClick={handleDrawerOpen}
                    >
                        <MenuIcon/>
                    </IconButton>
                    <Typography variant="h6" noWrap sx={{ flexGrow: 1, mr: 'auto' }} component="div">
                    </Typography>
                    <Button variant="text" onClick={() => navigate("/profil")}>
                        <Avatar sx={{ bgcolor: 'white', color: 'black' }} aria-label="recipe">
                        </Avatar>
                    </Button>
                </Toolbar>
            </AppBar>
            <Drawer variant="permanent" open={open}>
                <DrawerHeader>
                    <List>
                        <ListItem>
                            <ListItemIcon>
                                <img src={Logo} alt="Logo"/>
                            </ListItemIcon>
                            <ListItemText>Projet TA72</ListItemText>
                        </ListItem>
                    </List>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </IconButton>
                </DrawerHeader>
                <Divider />
                <List>
                    {(pages.slice(0,6)).map(({text, icons, path}, index) => (
                        <ListItem key={text} disablePadding sx={{ display: 'block' }}>
                            <ListItemButton
                                onClick={() => {
                                    setSelectedTabIndex(index);
                                    navigate('/'+path)
                                }}
                                sx={{
                                    minHeight: 48,
                                    justifyContent: open ? 'initial' : 'center',
                                    backgroundColor: selectedTabIndex === index ? blue[100] : 'transparent',
                                    px: 2.5,
                                    transition: 'background-color 0.3s',
                                    '&:hover': {
                                        backgroundColor: blue[50],
                                    }
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : 'auto',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Tooltip title={text}>
                                        {icons}
                                    </Tooltip>
                                </ListItemIcon>
                                <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
                <List sx={{marginTop:'auto'}}>
                    <ListItem disablePadding sx={{ display: 'block', bgcolor: red[100] }}>
                        <ListItemButton
                            sx={{
                                minHeight: 48,
                                justifyContent: open ? 'initial' : 'center',
                                px: 2.5,
                            }}
                            onClick={logout}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: open ? 3 : 'auto',
                                    justifyContent: 'center',
                                }}
                            >
                                <PowerSettingsNewIcon/>
                            </ListItemIcon>
                            <ListItemText primary="Déconnexion" sx={{ opacity: open ? 1 : 0 }} />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <DrawerHeader />
                <PageTitleComponent links={links}></PageTitleComponent>
                {children}
            </Box>
        </Box>
    );
}
