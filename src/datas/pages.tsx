import HomeIcon from "@mui/icons-material/Home";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import MapIcon from "@mui/icons-material/Map";
import PersonIcon from "@mui/icons-material/Person";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import CollectionsBookmarkIcon from "@mui/icons-material/CollectionsBookmark";
import AvailabilityPage from "../pages/availabilityPage/availabilityPage.tsx";
import DashboardPage from "../pages/dashboardPage/dashboardPage.tsx";
import MissionsPage from "../pages/missionsPages/missionsPage/missionsPage.tsx";
import PlanningPage from "../pages/planningPage/planningPage.tsx";
import JourneysPage from "../pages/journeysPage/journeysPage.tsx";
import MissionPage from "../pages/missionsPages/missionPage/missionPage.tsx";
import NavbarComponent from "../components/navbarComponent/navbarComponent.tsx";
import ProfilePage from "../pages/profilePage/profilePage.tsx";
import MissionsTypePage from "../pages/missionsTypePages/missionTypePage/missionTypePage.tsx";
import MissionTypeForm from "../pages/missionsTypePages/missionTypeFormPage/missionTypeForm.tsx";
import { ReactElement } from "react";

type page = {
  text: string;
  icons: ReactElement;
  path: string;
  element: ReactElement;
};

const pages: page[] = [
  {
    text: "Tableau de bord",
    icons: <HomeIcon />,
    path: "tableau_de_bord",
    element: (
      <NavbarComponent selectedIndex={0} breadcumbs={[0]}>
        <DashboardPage />
      </NavbarComponent>
    ),
  },
  {
    text: "Missions",
    icons: <AssignmentIcon />,
    path: "missionsPages",
    element: (
      <NavbarComponent selectedIndex={1} breadcumbs={[1]}>
        <MissionsPage />
      </NavbarComponent>
    ),
  },
  {
    text: "Types de mission",
    icons: <CollectionsBookmarkIcon />,
    path: "type_de_mission",
    element: (
      <NavbarComponent selectedIndex={2} breadcumbs={[2]}>
        <MissionsTypePage />
      </NavbarComponent>
    ),
  },
  {
    text: "Planning",
    icons: <CalendarMonthIcon />,
    path: "planningPage",
    element: (
      <NavbarComponent selectedIndex={3} breadcumbs={[3]}>
        <PlanningPage />
      </NavbarComponent>
    ),
  },
  {
    text: "Trajets",
    icons: <MapIcon />,
    path: "trajets",
    element: (
      <NavbarComponent selectedIndex={4} breadcumbs={[4]}>
        <JourneysPage />
      </NavbarComponent>
    ),
  },
  {
    text: "Disponibilités",
    icons: <AssignmentTurnedInIcon />,
    path: "disponibilites",
    element: (
      <NavbarComponent selectedIndex={5} breadcumbs={[5]}>
        <AvailabilityPage />
      </NavbarComponent>
    ),
  },
  {
    text: "Détails de mission",
    icons: <AssignmentIcon />,
    path: "detail_mission/:id",
    element: (
      <NavbarComponent selectedIndex={1} breadcumbs={[1, 6]}>
        <MissionPage />
      </NavbarComponent>
    ),
  },
  {
    text: "Mon profilePage",
    icons: <PersonIcon />,
    path: "profil",
    element: (
      <NavbarComponent selectedIndex={-1} breadcumbs={[7]}>
        <ProfilePage />
      </NavbarComponent>
    ),
  },
  {
    text: "Formulaire type de mission",
    icons: <CollectionsBookmarkIcon />,
    path: "mission_type_form/:id?",
    element: (
      <NavbarComponent selectedIndex={2} breadcumbs={[2, 8]}>
        <MissionTypeForm />
      </NavbarComponent>
    ),
  },
];

export default pages;
