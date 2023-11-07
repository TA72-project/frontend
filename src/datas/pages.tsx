import HomeIcon from "@mui/icons-material/Home";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import MapIcon from "@mui/icons-material/Map";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import AvailabilityPage from "../pages/availability/availabilityPage.tsx";
import DashboardPage from "../pages/dashboard/dashboardPage.tsx";
import MissionsPage from "../pages/missions/missionsPage.tsx";
import PlanningPage from "../pages/planning/planningPage.tsx";
import JourneysPage from "../pages/journeys/journeysPage.tsx";

const pages = [
  {
    text: "Tableau de bord",
    icons: <HomeIcon />,
    path: "tableau_de_bord",
    element: <DashboardPage />,
  },
  {
    text: "Missions",
    icons: <AssignmentIcon />,
    path: "missions",
    element: <MissionsPage />,
  },
  {
    text: "Planning",
    icons: <CalendarMonthIcon />,
    path: "planning",
    element: <PlanningPage />,
  },
  {
    text: "Trajets",
    icons: <MapIcon />,
    path: "trajets",
    element: <JourneysPage />,
  },
  {
    text: "Disponibilités",
    icons: <AssignmentTurnedInIcon />,
    path: "disponibilites",
    element: <AvailabilityPage />,
  },
];
export default pages;
