import { Box, Tab, Tabs} from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';
import '../../assets/css/mission.css';
import 'dayjs/locale/fr';

export default function Profile(){

    return(
        <div>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={1} onChange={() => console.log("Test")} aria-label="basic tabs example">
                    <Tab label="Compte" icon={<PersonIcon />} iconPosition="start" aria-controls= "tab1" />
                    <Tab label="Sécurité" icon={<PersonIcon />} iconPosition="start" aria-controls= "tab1"  />
                </Tabs>
            </Box>
        </div>
    )
}