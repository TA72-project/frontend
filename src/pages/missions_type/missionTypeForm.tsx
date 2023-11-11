import { Box, Button, Grid, Paper, TextField, Typography } from "@mui/material";
import '../../assets/css/mission.css';
import { useNavigate, useParams } from "react-router-dom";
import 'dayjs/locale/fr';
import { useEffect, useState } from "react";
import { createMissionType, getMissionType, updateMissionType } from "../../hook/missionType";
import { formatPositiveInt } from "../../utils/formatterUtils";
import { useAuth } from "../../components/template/authProvider";

interface missionTypeApi {
    name: string,
    people_required: number,
    minutes_duration: number,
}

export default function MissionTypeForm(){
    const {closeRecord} = useAuth();
    const {id} = useParams();
    const navigate = useNavigate();
    const [formValues, setFormValues] = useState<missionTypeApi>({
        name: '',
        people_required: 0,
        minutes_duration: 0,
    });
    const [isUpdating, setIsUpdating] = useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const res = id != undefined ? await updateMissionType(parseInt(id), formValues) : await createMissionType(formValues);
        if(res === 200) {
            closeRecord(true);
            navigate('/missions_type');
        }
    };

    const loadMissionType = async (id: number): Promise<void> => {
        const result = await getMissionType(id);
        if(result != null) {
            setFormValues({
                name: result.name,
                people_required: result.peopleRequired ? result.peopleRequired : 0,
                minutes_duration: result.minutesDuration ? result.minutesDuration : 0
            });
        }            
    };

    useEffect(() => {
        if(id != undefined) {
            loadMissionType(parseInt(id));
            setIsUpdating(true);
        }        
    }, [id]);

    return(
        <div>
            <Box sx={{ flexGrow: 1 }}>
                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} justifyContent={'center'}>
                    <Grid item xs={12} md={6} sm={6}>
                        <Paper style={{padding: '15px',boxShadow: 'rgba(0, 0, 0, 0.04) 0px 5px 22px, rgba(0, 0, 0, 0.03) 0px 0px 0px 0.5px'}}>
                            <Typography variant="h5" gutterBottom align="center" component="div">
                                <strong>
                                    {
                                        isUpdating ? "Modification" : "Création" 
                                    }
                                </strong>
                            </Typography>
                            <br/>
                            <Grid component="form" onSubmit={handleSubmit} container direction="column" alignItems="center" style={{paddingBottom: '20px'}} sx={{gap: 2}}>
                                <TextField
                                    label="Désignation"
                                    name="name"
                                    variant="outlined"
                                    style={{width:'100%'}}
                                    value={formValues.name}
                                    onChange={(e) => setFormValues({...formValues, name: e.target.value})}
                                />
                                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} justifyContent={'center'}>
                                    <Grid item xs={6}>
                                        <TextField
                                            label="Durée (Min)"
                                            name="minute_duration"
                                            variant="outlined"
                                            style={{width:'100%'}}
                                            type="number"
                                            value={formValues.minutes_duration}
                                            onChange={(e) => setFormValues({...formValues, minutes_duration: formatPositiveInt(e.target.value)})}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            label="Intervenant(s)"
                                            name="people_required"
                                            variant="outlined"
                                            style={{width:'100%'}}
                                            type="number"
                                            value={formValues.people_required}
                                            onChange={(e) => setFormValues({...formValues, people_required: formatPositiveInt(e.target.value)})}
                                        />
                                    </Grid>
                                </Grid>
                                <br/>            
                                <Button type="submit" variant="contained" color="primary">
                                    Valider
                                </Button>
                            </Grid>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </div>
    )
}