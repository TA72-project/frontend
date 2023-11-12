import { Avatar, Divider, List, ListItemAvatar, ListItemButton, ListItemText} from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

interface ITaskCardComponentProps {
    title: string;
    start: string;
    end: string;
    url: string;
}

export default function TaskCardComponent({title, start, end, url} : ITaskCardComponentProps) {
    const navigate = useNavigate();
    return (
        <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
            <ListItemButton alignItems="flex-start" onClick={() => navigate(url)}>
                <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'gray', color: 'white' }} aria-label="recipe">
                        JD
                    </Avatar>
                </ListItemAvatar>
                <ListItemText
                    primary={title}
                    secondary={
                        <React.Fragment>
                            {"Début : " + start} <br/>
                            {"Fin :  " + end} 
                        </React.Fragment>
                    }
                />
            </ListItemButton>
            <Divider variant="inset" component="li" />
        </List>
    );
}