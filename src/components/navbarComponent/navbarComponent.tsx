import React, {ReactElement, useState} from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import PageTitleComponent from '../pageTitleComponent/pageTitleComponent.tsx';
import pages from "../../datas/pages.tsx";
import {AppBarComponent} from "./appBarComponent/appBarComponent.tsx";
import {DrawerComponent} from "./drawerComponent/drawerComponent.tsx";

interface Props {
    children: ReactElement | string,
    selectedIndex: number,
    breadcumbs: number[]
}

interface link {
    text: string;
    icons: ReactElement;
    path: string;
}

const NavbarComponent: React.FC<Props> = (props) => {

    const {children, selectedIndex, breadcumbs} = props;

    const links: link[] = [];

    breadcumbs.forEach(b => links.push(pages[b]));
    const [open, setOpen] = useState(false);

    const handleDrawerOpen = () => {
        setOpen((prevState) => !prevState);
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBarComponent handleDrawerOpen={handleDrawerOpen} open={open} />
            <DrawerComponent handleDrawerOpen={handleDrawerOpen} open={open} selectedIndex={selectedIndex}/>
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <PageTitleComponent links={links}></PageTitleComponent>
                {children}
            </Box>
        </Box>
    );
}

export default NavbarComponent;