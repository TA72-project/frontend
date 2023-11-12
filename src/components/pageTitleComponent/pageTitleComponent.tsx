import {Breadcrumbs, Link, Typography} from '@mui/material';

type link = {
    text: string;
    icons: JSX.Element;
    path: string;
};

interface Props {
    links: link[];
}

export default function PageTitleComponent({links}: Props) {
    return (
        <div role="presentation">
            <Breadcrumbs separator="›" aria-label="breadcrumb">
                {links.map((link: link, index: number) => (
                    <Link
                        key={index}
                        underline="hover"
                        sx={{display: 'flex', alignItems: 'center'}}
                        color="inherit"
                        href={'/' + link.path}
                    >
                        {links.length > 1 && index == links.length - 1 ? '' : link.icons}
                        {link.text}
                    </Link>
                ))}
            </Breadcrumbs><br/>
            <Typography variant='h5'>
                {links[links.length - 1].text}
            </Typography>
            <br/>
        </div>
    );
}