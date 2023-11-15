import {ChangeEvent, useState} from 'react';
import {Box, Tab, Tabs} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import 'dayjs/locale/fr';
import AccountTabComponent from '../../components/accountComponents/accountTabComponent/accountTabComponent';
import SecurityTabComponent from "../../components/accountComponents/securityTabComponent/securityTabComponent.tsx";

export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState(0);

    const tabs = [
        {label: 'Compte', icon: <PersonIcon/>, component: <AccountTabComponent/>},
        {label: 'Sécurité', icon: <PersonIcon/>, component: <SecurityTabComponent/>},
    ];

    const handleTabChange = (_: ChangeEvent<unknown>, newValue: number) => {
        setActiveTab(newValue);
    };

    return (
        <div>
            <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                <Tabs value={activeTab} onChange={handleTabChange} aria-label="basic tabs example" centered>
                    {tabs.map((tab, index) => (
                        <Tab key={index} label={tab.label} icon={tab.icon} iconPosition="start" />
                    ))}
                </Tabs>
            </Box>
            {tabs[activeTab].component}
        </div>
    );
}