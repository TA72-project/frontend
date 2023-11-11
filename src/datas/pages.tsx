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
import Template from "../components/template/template.tsx";
import Profile from "../pages/profile/profile.tsx";
import MissionsTypePage from "../pages/missions_type/missionsTypePage.tsx";
import MissionTypeForm from "../pages/missions_type/missionTypeForm.tsx";

type page = {
    text: string;
    icons: JSX.Element;
    path: string;
    element: JSX.Element;
};

const pages : page[] = [
    {text:'Tableau de bord',icons:<HomeIcon/>, path:'tableau_de_bord', element:<Template selectedIndex={0} breadcumbs={[0]}><DashboardPage/></Template>},
    {text:'Missions',icons:<AssignmentIcon/>, path:'missions', element: <Template selectedIndex={1} breadcumbs={[1]}><MissionsPage/></Template>},
    {text:'Type de mission',icons:<CollectionsBookmarkIcon/>, path:'missions_type', element: <Template selectedIndex={2} breadcumbs={[2]}><MissionsTypePage/></Template>},
    {text:'Planning',icons:<CalendarMonthIcon/>, path:'planning', element: <Template selectedIndex={3} breadcumbs={[3]}><PlanningPage/></Template>},
    {text:'Trajets',icons:<MapIcon/>, path:'trajets', element: <Template selectedIndex={4} breadcumbs={[4]}><JourneysPage/></Template>},
    {text:'Disponibilités', icons:<AssignmentTurnedInIcon/>, path:'disponibilites', element: <Template selectedIndex={5} breadcumbs={[5]}><AvailabilityPage/></Template>},
    {text:'Détails de mission', icons:<AssignmentIcon/>, path:'detail_mission/:id', element: <Template selectedIndex={1} breadcumbs={[1,6]}><MissionInfoPage/></Template>},
    {text:'Mon profile', icons:<PersonIcon/>, path:'profil', element: <Template selectedIndex={-1} breadcumbs={[7]}><Profile/></Template>},
    {text:'Formulaire type de mission',icons:<CollectionsBookmarkIcon/>, path:'mission_type_form/:id?', element: <Template selectedIndex={2} breadcumbs={[2,8]}><MissionTypeForm/></Template>},
];

export default pages;