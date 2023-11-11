import * as React from 'react';
import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import StarIcon from '@mui/icons-material/Star';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Avatar, Button, Snackbar, Tooltip } from '@mui/material';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import Logo from '../../assets/react.svg';
import pages from "../../datas/pages.tsx";
import {useNavigate} from "react-router-dom";
import { red } from '@mui/material/colors';
import { blue } from '@mui/material/colors';
import {useAuth} from "./authContextProvider";
import { link } from '../../type/common.ts';
import PageTitle from '../pagetitle/pageTitle.tsx';
import { formatUserAvatar, formatUserName } from '../../utils/formatterUtils.ts';

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
    // necessary for content to be below app bar
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
    children: JSX.Element | string,
    selectedIndex: number,
    breadcumbs: number[]
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
        props,
        ref,
    ) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function Template({ children, selectedIndex, breadcumbs }: Props) {
    const { newLogin, currentUser, isSaved, closeRecord} = useAuth();

    const links: link[] = [];
    breadcumbs.forEach(b => links.push(pages[b]));
    
    const theme = useTheme();
    const navigate = useNavigate();
    const [open, setOpen] = React.useState(false);
    const [isNewLogin, setIsNewLogin] = React.useState(newLogin);
    const [selectedTabIndex, setSelectedTabIndex] = React.useState(selectedIndex);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const handleCloseSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway' && event) {
          return;
        }
    
        setIsNewLogin(false);
    };

    React.useEffect(() => {
        const timer = setTimeout(() => {
            closeRecord(false);
        }, 3000);
        return () => clearTimeout(timer);
    }, [closeRecord]);

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <Snackbar
                open={isNewLogin}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{vertical: 'bottom', horizontal:'right' }}
            >
                <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
                    Bienvenue {formatUserName(currentUser)}
                </Alert>
            </Snackbar>
            <Snackbar
                open={isSaved}
                autoHideDuration={1000}
                anchorOrigin={{vertical: 'bottom', horizontal:'right' }}
            >
                <Alert severity="success" sx={{ width: '100%' }}>
                    Enregistrement effectué avec succès !
                </Alert>
            </Snackbar>
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
                        {formatUserName(currentUser)}
                    </Typography>
                    <StarIcon></StarIcon>
                    <Button variant="text" onClick={() => navigate("/profil")}>
                        <Avatar sx={{ bgcolor: 'white', color: 'black' }} aria-label="recipe">
                            {formatUserAvatar(currentUser)}
                        </Avatar>
                    </Button>
                    <StarIcon></StarIcon>
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
                            onClick={() => {
                                navigate('/')
                            }}
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
                <PageTitle links={links}></PageTitle>
                {children}
            </Box>
        </Box>
    );
}
