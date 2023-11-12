import HomeIcon from "@mui/icons-material/Home";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import MapIcon from "@mui/icons-material/Map";
import PersonIcon from "@mui/icons-material/Person";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark';
import AvailabilityPage from "../pages/availability/availabilityPage.tsx";
import DashboardPage from "../pages/dashboard/dashboardPage.tsx";
import MissionsPage from "../pages/missions/missionsPage.tsx";
import PlanningPage from "../pages/planning/planningPage.tsx";
import JourneysPage from "../pages/journeys/journeysPage.tsx";
import MissionInfoPage from "../pages/missions/missionInfoPage.tsx";
import TemplateComponent from "../components/templateComponent/templateComponent.tsx";
import Profile from "../pages/profile/profile.tsx";
import MissionsTypePage from "../pages/missions_type/missionsTypePage.tsx";
import MissionTypeForm from "../pages/missions_type/missionTypeForm.tsx";
import {ReactElement} from "react";

type page = {
    text: string;
    icons: ReactElement;
    path: string;
    element: ReactElement;
};

const pages : page[] = [
    {text:'Tableau de bord',icons:<HomeIcon/>, path:'tableau_de_bord', element:<TemplateComponent selectedIndex={0} breadcumbs={[0]}><DashboardPage/></TemplateComponent>},
    {text:'Missions',icons:<AssignmentIcon/>, path:'missions', element: <TemplateComponent selectedIndex={1} breadcumbs={[1]}><MissionsPage/></TemplateComponent>},
    {text:'Type de mission',icons:<CollectionsBookmarkIcon/>, path:'missions_type', element: <TemplateComponent selectedIndex={2} breadcumbs={[2]}><MissionsTypePage/></TemplateComponent>},
    {text:'Planning',icons:<CalendarMonthIcon/>, path:'planning', element: <TemplateComponent selectedIndex={3} breadcumbs={[3]}><PlanningPage/></TemplateComponent>},
    {text:'Trajets',icons:<MapIcon/>, path:'trajets', element: <TemplateComponent selectedIndex={4} breadcumbs={[4]}><JourneysPage/></TemplateComponent>},
    {text:'Disponibilités', icons:<AssignmentTurnedInIcon/>, path:'disponibilites', element: <TemplateComponent selectedIndex={5} breadcumbs={[5]}><AvailabilityPage/></TemplateComponent>},
    {text:'Détails de mission', icons:<AssignmentIcon/>, path:'detail_mission/:id', element: <TemplateComponent selectedIndex={1} breadcumbs={[1,6]}><MissionInfoPage/></TemplateComponent>},
    {text:'Mon profile', icons:<PersonIcon/>, path:'profil', element: <TemplateComponent selectedIndex={-1} breadcumbs={[7]}><Profile/></TemplateComponent>},
    {text:'Formulaire type de mission',icons:<CollectionsBookmarkIcon/>, path:'mission_type_form/:id?', element: <TemplateComponent selectedIndex={2} breadcumbs={[2,8]}><MissionTypeForm/></TemplateComponent>},
];

export default pages;