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
import NavbarComponent from "../components/navbarComponent/navbarComponent.tsx";
import Profile from "../pages/profile/profile.tsx";
import MissionsTypePage from "../pages/missionsType/missionsTypePage.tsx";
import MissionTypeForm from "../pages/missionsType/missionTypeForm.tsx";
import {ReactElement} from "react";

type page = {
    text: string;
    icons: ReactElement;
    path: string;
    element: ReactElement;
};

const pages : page[] = [
    {text:'Tableau de bord',icons:<HomeIcon/>, path:'tableau_de_bord', element:<NavbarComponent selectedIndex={0} breadcumbs={[0]}><DashboardPage/></NavbarComponent>},
    {text:'Missions',icons:<AssignmentIcon/>, path:'missions', element: <NavbarComponent selectedIndex={1} breadcumbs={[1]}><MissionsPage/></NavbarComponent>},
    {text:'Type de mission',icons:<CollectionsBookmarkIcon/>, path:'missionsType', element: <NavbarComponent selectedIndex={2} breadcumbs={[2]}><MissionsTypePage/></NavbarComponent>},
    {text:'Planning',icons:<CalendarMonthIcon/>, path:'planning', element: <NavbarComponent selectedIndex={3} breadcumbs={[3]}><PlanningPage/></NavbarComponent>},
    {text:'Trajets',icons:<MapIcon/>, path:'trajets', element: <NavbarComponent selectedIndex={4} breadcumbs={[4]}><JourneysPage/></NavbarComponent>},
    {text:'Disponibilités', icons:<AssignmentTurnedInIcon/>, path:'disponibilites', element: <NavbarComponent selectedIndex={5} breadcumbs={[5]}><AvailabilityPage/></NavbarComponent>},
    {text:'Détails de mission', icons:<AssignmentIcon/>, path:'detail_mission/:id', element: <NavbarComponent selectedIndex={1} breadcumbs={[1,6]}><MissionInfoPage/></NavbarComponent>},
    {text:'Mon profile', icons:<PersonIcon/>, path:'profil', element: <NavbarComponent selectedIndex={-1} breadcumbs={[7]}><Profile/></NavbarComponent>},
    {text:'Formulaire type de mission',icons:<CollectionsBookmarkIcon/>, path:'mission_type_form/:id?', element: <NavbarComponent selectedIndex={2} breadcumbs={[2,8]}><MissionTypeForm/></NavbarComponent>},
];

export default pages;