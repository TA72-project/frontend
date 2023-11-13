import Typography from "@mui/material/Typography";
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";
import Box from "@mui/material/Box";

export default function NotFoundPage() {

    const navigate = useNavigate();

    useEffect(() => {
        const token = document.cookie.split('; ').find(cookie => cookie.startsWith('token='))?.split('=')[1];
        if (token){
            navigate('/tableau_de_bord');
        }
        navigate('/login');
    }, []);

    return(
        <Box sx={{width:'100%', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center'}}>
            <Typography variant="h3">
                Page non trouvée ou innexistante
            </Typography>
            <Typography>
                Veuillez Patienter vous allez être redirigé
            </Typography>
        </Box>
    )
}