import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Link } from "@mui/material";

export default function NotFoundPage() {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
      }}
    >
      <Typography variant="h3">Page non trouvée ou inexistante</Typography>
      <Typography>
        <Link href="/planningPage">Retourner sur le planning</Link>
      </Typography>
    </Box>
  );
}
