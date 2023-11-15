import { Box, Button, Chip, Grid, Paper, Table, TableBody, TableCell, TableRow, TextField, Typography } from "@mui/material";
import { grey } from '@mui/material/colors';
import '../../../assets/css/mission.css';
import { useParams } from "react-router-dom";
import { DateTimePicker, LocalizationProvider, frFR, renderTimeViewClock } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from "dayjs";
import 'dayjs/locale/fr';

export default function MissionPage(){

    const { id } = useParams();

    return(
        <div>
            <Box sx={{ flexGrow: 1 }}>
                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                    <Grid item xs={12} sm={6} md={6}>
                        <Paper style={{padding: '15px'}}>
                            <Typography variant="subtitle1" gutterBottom>
                                <strong>Détail de la mission</strong>
                            </Typography>
                            <Paper elevation={0} style={{padding: '15px', backgroundColor: grey[50]}}>
                                <Typography variant="subtitle2" gutterBottom>
                                    <strong>Mission</strong>
                                </Typography>
                                <Table aria-label="simple table">
                                    <TableBody>
                                        <TableRow
                                            key={0}
                                        >
                                            <TableCell align="right" component="th" scope="row">
                                                Type
                                            </TableCell>
                                            <TableCell align="center" width={1}>:</TableCell>
                                            <TableCell><span className="tab-info">{id}</span></TableCell>
                                        </TableRow>
                                        <TableRow
                                            key={1}
                                        >
                                            <TableCell align="right" component="th" scope="row">
                                                Date de début
                                            </TableCell>
                                            <TableCell align="center" width={1}>:</TableCell>
                                            <TableCell><span className="tab-info">12/10/2023</span></TableCell>
                                        </TableRow>
                                        <TableRow
                                            key={2}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell align="right" component="th" scope="row">
                                                Date de fin
                                            </TableCell>
                                            <TableCell align="center" width={1}>:</TableCell>
                                            <TableCell><span className="tab-info">12/10/2023</span></TableCell>
                                        </TableRow>
                                        <TableRow
                                            key={3}
                                        >
                                            <TableCell align="right" component="th" scope="row">
                                                Personne requise
                                            </TableCell>
                                            <TableCell align="center" width={1}>:</TableCell>
                                            <TableCell><span className="tab-info">3</span></TableCell>
                                        </TableRow>
                                        <TableRow
                                            key={4}
                                        >
                                            <TableCell align="right" component="th" scope="row">
                                                Compétences requises
                                            </TableCell>
                                            <TableCell align="center" width={1}>:</TableCell>
                                            <TableCell>
                                                {["Comp 1", "Comp 2", "Comp 3"].map((comp) => (
                                                    <Chip color="primary" label={comp}/>
                                                ))}

                                                {["Spec 1", "Spec 2", "Spec 3"].map((comp) => (
                                                    <Chip label={comp}/>
                                                ))}
                                                
                                            </TableCell>
                                        </TableRow>
                                        <TableRow
                                            key={5}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell align="right" component="th" scope="row">
                                                Description
                                            </TableCell>
                                            <TableCell align="center" width={1}>:</TableCell>
                                            <TableCell>
                                                <span className="tab-info">
                                                    Le symbole de copyright (©) est un symbole couramment utilisé pour indiquer 
                                                    la protection des droits d'auteur sur une œuvre originale, telle qu'un texte,
                                                    une image, une œuvre musicale, un logiciel, etc. Il est généralement suivi de
                                                    l'année de création et du nom du titulaire des droits d'auteur.
                                                </span>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </Paper>

                            <br/>
                            <Paper elevation={0} style={{padding: '15px', backgroundColor: grey[50]}}>
                                <Typography variant="subtitle2" gutterBottom>
                                    <strong>Patient</strong>
                                </Typography>
                                <Table aria-label="simple table">
                                    <TableBody>
                                        <TableRow
                                            key={6}
                                        >
                                            <TableCell align="right" component="th" scope="row">
                                                Nom
                                            </TableCell>
                                            <TableCell align="center">:</TableCell>
                                            <TableCell><span className="tab-info">Doe</span></TableCell>
                                        </TableRow>
                                        <TableRow
                                            key={7}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell align="right" component="th" scope="row">
                                                Prénom
                                            </TableCell>
                                            <TableCell align="center">:</TableCell>
                                            <TableCell><span className="tab-info">John</span></TableCell>
                                        </TableRow>
                                        <TableRow
                                            key={8}
                                        >
                                            <TableCell align="right" component="th" scope="row">
                                                Téléphone
                                            </TableCell>
                                            <TableCell align="center">:</TableCell>
                                            <TableCell><span className="tab-info">+33 7 12 34 56 78</span></TableCell>
                                        </TableRow>
                                        <TableRow
                                            key={9}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell align="right" component="th" scope="row">
                                                Adresse
                                            </TableCell>
                                            <TableCell align="center">:</TableCell>
                                            <TableCell>
                                                <span className="tab-info">
                                                    2 Rue Ernest Duvillard, 90000 Belfort
                                                </span>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </Paper>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={6} sm={6}>
                        <Paper style={{padding: '15px'}}>
                            <Typography variant="subtitle1" gutterBottom>
                                <strong>Rapport d'intervention</strong>
                            </Typography>
                            <Paper elevation={0} style={{padding: '15px', backgroundColor: grey[50]}}>
                                <form>
                                    <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                                        <Grid item xs={6}>
                                            <LocalizationProvider
                                                adapterLocale="fr"
                                                localeText={frFR.components.MuiLocalizationProvider.defaultProps.localeText}
                                                dateAdapter={AdapterDayjs}>
                                                <DateTimePicker
                                                    label="Début"
                                                    defaultValue={dayjs('2022-04-17T15:30')}
                                                    viewRenderers={{
                                                        hours: renderTimeViewClock,
                                                        minutes: renderTimeViewClock,
                                                        seconds: renderTimeViewClock,
                                                    }}
                                                />
                                            </LocalizationProvider>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <LocalizationProvider
                                                adapterLocale="fr"
                                                localeText={frFR.components.MuiLocalizationProvider.defaultProps.localeText}
                                                dateAdapter={AdapterDayjs}>
                                                <DateTimePicker
                                                    label="Fin"
                                                    defaultValue={dayjs('2022-04-17T15:30')}
                                                    viewRenderers={{
                                                        hours: renderTimeViewClock,
                                                        minutes: renderTimeViewClock,
                                                        seconds: renderTimeViewClock,
                                                    }}
                                                />
                                            </LocalizationProvider>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                label="Bilan"
                                                multiline
                                                variant="standard"
                                                defaultValue="L'intervention infirmière a été effectuée conformément au plan de soins établi par le médecin traitant. Voici un résumé des actions effectuées :

                                                Prise des Signes Vitaux :
                                                Tension artérielle : 120/80 mmHg
                                                Fréquence cardiaque : 75 bpm"
                                            />
                                        </Grid>
                                        <Grid item xs={12} style={{textAlign: 'right',}}>
                                            <Button variant="contained">Enregistrer</Button>
                                        </Grid>
                                    </Grid>
                                </form>
                            </Paper>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </div>
    )
}