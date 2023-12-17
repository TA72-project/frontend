import {
  Box,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import "dayjs/locale/fr";
import { useParams } from "react-router-dom";
import { getMission } from "../../../requests/missions";
import { DetailsArrayItem } from "../../../utils/types";
import { useEffect, useState } from "react";
import {
  formatAddress,
  formatDate,
  formatNumberToTime,
} from "../../../utils/formatUtils";

export default function MissionPage() {
  const idMission = useParams().id;
  const [missionInfo, setMissionInfo] = useState<DetailsArrayItem>({
    details: [],
    title: "",
  });
  const [patientInfo, setPatientInfo] = useState<DetailsArrayItem>({
    details: [],
    title: "",
  });

  const loadMission = async () => {
    try {
      if (idMission) {
        const response = await getMission(parseInt(idMission));
        if (response) {
          setMissionInfo({
            details: [
              {
                label: "Type de la mission",
                value: response.mission_type.name,
              },
              { label: "Date de début", value: formatDate(response.start) },
              { label: "Date de fin", value: formatDate(response.end) },
              { label: "Personne requise", value: response.people_required },
              {
                label: "Durée",
                value: formatNumberToTime(response.minutes_duration),
              },
              {
                label: "Fréquence",
                value: (response.recurrence_days || 0) + " jours",
              },
              {
                label: "Description",
                value: response.desc,
              },
            ],
            title: "Mission",
          });
          setPatientInfo({
            details: [
              { label: "Nom", value: response.patient.lname },
              { label: "Prénom", value: response.patient.fname },
              { label: "Téléphone", value: response.patient.phone },
              { label: "Mail", value: response.patient.mail },
              {
                label: "Adresse",
                value: formatAddress(response.patient.address),
              },
            ],
            title: "Patient",
          });
        }
      }
    } catch (error) {
      console.error("Erreur lors de la récupération de la mission", error);
    }
  };

  useEffect(() => {
    loadMission();
  }, [idMission]);

  if (missionInfo.title == "" || patientInfo.title == "") {
    return <div>{"Page is loading ..."}</div>;
  }

  return (
    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
      <Grid item xs={12} sm={6} md={6}>
        <Paper style={{ padding: "5px" }}>
          <Box
            key={missionInfo.title}
            sx={{ padding: "10px", backgroundColor: grey[50] }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
              {missionInfo.title}
            </Typography>
            <Table>
              <TableBody>
                {missionInfo.details.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell align="right" component="th" scope="row">
                      {item.label}
                    </TableCell>
                    <TableCell align="center">:</TableCell>
                    <TableCell>{item.value}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </Paper>
      </Grid>
      <Grid item xs={12} md={6} sm={6}>
        <Paper style={{ padding: "5px" }}>
          <Box
            key={patientInfo.title}
            sx={{ padding: "10px", backgroundColor: grey[50] }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
              {patientInfo.title}
            </Typography>
            <Table>
              <TableBody>
                {patientInfo.details.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell align="right" component="th" scope="row">
                      {item.label}
                    </TableCell>
                    <TableCell align="center">:</TableCell>
                    <TableCell>{item.value}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
}
