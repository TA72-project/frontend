import { Box, Button, Chip, Grid, Paper, Table, TableBody, TableCell, TableRow, TextField, Typography } from "@mui/material";
import { grey } from '@mui/material/colors';
import '../../../assets/css/mission.css';
import { DateTimePicker, LocalizationProvider, frFR, renderTimeViewClock } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from "dayjs";
import 'dayjs/locale/fr';

export default function MissionPage(){

    const details = [
        {
            details: [
                { label: 'Type', value: 'Type' },
                { label: 'Date de début', value: '12/10/2023' },
                { label: 'Date de fin', value: '12/10/2023' },
                { label: 'Personne requise', value: '3' },
                { label: 'Compétences requises', value: ["Comp 1", "Comp 2", "Comp 3", "Spec 1", "Spec 2", "Spec 3"] },
                { label: 'Description', value: 'Le symbole de copyright (©) ...' }
            ],
            title: "Détail de mission"
        },
        {
            details: [
                { label: 'Nom', value: 'Doe' },
                { label: 'Prénom', value: 'John' },
                { label: 'Téléphone', value: '+33 7 12 34 56 78' },
                { label: 'Adresse', value: '2 Rue Ernest Duvillard, 90000 Belfort' }
            ],
            title: "Patient"
        },
    ];

    return(
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            <Grid item xs={12} sm={6} md={6}>
                <Paper style={{padding: '15px'}}>
                    {
                        details.map((section) => (
                            <Box key={section.title} sx={{ padding: '15px', backgroundColor: grey[50] }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                                    {section.title}
                                </Typography>
                                <Table>
                                    <TableBody>
                                        {section.details.map((item, index) => (
                                            <TableRow key={index}>
                                                <TableCell align="right" component="th" scope="row">
                                                    {item.label}
                                                </TableCell>
                                                <TableCell align="center">:</TableCell>
                                                <TableCell>
                                                    {Array.isArray(item.value) ? (
                                                        item.value.map((comp, i) => (
                                                            <Chip key={i} color={i < 3 ? "primary" : "default"} label={comp} />
                                                        ))
                                                    ) : (
                                                        item.value
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Box>
                        ))
                    }
                </Paper>
            </Grid>
            <Grid item xs={12} md={6} sm={6}>
                <Paper style={{padding: '15px'}}>
                    <Paper elevation={0} style={{padding: '15px', backgroundColor: grey[50]}}>
                        <Typography variant="subtitle1" gutterBottom>
                            <strong>Rapport d'intervention</strong>
                        </Typography>
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
    )
}