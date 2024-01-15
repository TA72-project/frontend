import HomeIcon from "@mui/icons-material/Home";
import MapIcon from "@mui/icons-material/Map";
import PeopleIcon from "@mui/icons-material/People";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import StarIcon from "@mui/icons-material/Star";
import PersonIcon from "@mui/icons-material/Person";
import BallotIcon from "@mui/icons-material/Ballot";
import CollectionsBookmarkIcon from "@mui/icons-material/CollectionsBookmark";
import MissionsPage from "../pages/missionsPages/missionsPage/missionsPage.tsx";
import PlanningPage from "../pages/planningPage/planningPage.tsx";
import MissionPage from "../pages/missionsPages/missionPage/missionPage.tsx";
import NavbarComponent from "../components/navbarComponent/navbarComponent.tsx";
import ProfilePage from "../pages/profilePage/profilePage.tsx";
import MissionsTypePage from "../pages/missionsTypePages/missionTypePage/missionTypePage.tsx";
import MissionTypeForm from "../pages/missionsTypePages/missionTypeFormPage/missionTypeForm.tsx";
import { ReactElement } from "react";
import SkillsPage from "../pages/skillPage/skillsPage.tsx";
import CenterPage from "../pages/CentersPage/CenterPage.tsx";
import VisitPage from "../pages/VisitsPage/VisitPage.tsx";
import UsersPage from "../pages/userPages/usersPage.tsx";
import ZonesPage from "../pages/zonePage/zonesPage.tsx";

type page = {
  text: string;
  icons: ReactElement;
  path: string;
  element: ReactElement;
};

const pages: page[] = [
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
    text: "Visites",
    icons: <BallotIcon />,
    path: "visites",
    element: (
      <NavbarComponent selectedIndex={4} breadcumbs={[4]}>
        <VisitPage />
      </NavbarComponent>
    ),
  },
  {
    text: "Compétences",
    icons: <StarIcon />,
    path: "competences",
    element: (
      <NavbarComponent selectedIndex={5} breadcumbs={[5]}>
        <SkillsPage />
      </NavbarComponent>
    ),
  },
  {
    text: "Centres",
    icons: <HomeIcon />,
    path: "Centres",
    element: (
      <NavbarComponent selectedIndex={6} breadcumbs={[6]}>
        <CenterPage />
      </NavbarComponent>
    ),
  },
  {
    text: "Zones",
    icons: <MapIcon />,
    path: "Zones",
    element: (
      <NavbarComponent selectedIndex={7} breadcumbs={[7]}>
        <ZonesPage />
      </NavbarComponent>
    ),
  },
  {
    text: "Utilisateurs",
    icons: <PeopleIcon />,
    path: "Utilisateurs",
    element: (
      <NavbarComponent selectedIndex={8} breadcumbs={[8]}>
        <UsersPage />
      </NavbarComponent>
    ),
  },
  {
    text: "Détails de mission",
    icons: <AssignmentIcon />,
    path: "detail_mission/:id",
    element: (
      <NavbarComponent selectedIndex={1} breadcumbs={[1, 9]}>
        <MissionPage />
      </NavbarComponent>
    ),
  },
  {
    text: "Mon profilePage",
    icons: <PersonIcon />,
    path: "profil",
    element: (
      <NavbarComponent selectedIndex={-1} breadcumbs={[10]}>
        <ProfilePage />
      </NavbarComponent>
    ),
  },
  {
    text: "Formulaire type de mission",
    icons: <CollectionsBookmarkIcon />,
    path: "mission_type_form/:id?",
    element: (
      <NavbarComponent selectedIndex={2} breadcumbs={[2, 11]}>
        <MissionTypeForm />
      </NavbarComponent>
    ),
  },
];

export default pages;
