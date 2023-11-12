import { Button, Grid, Paper, TextField, Typography } from "@mui/material";
import '../../assets/css/mission.css';
import { useNavigate, useParams } from "react-router-dom";
import 'dayjs/locale/fr';
import { useEffect, useState } from "react";
import { createMissionType, getMissionType, updateMissionType } from "../../requests/missionTypes.ts";
import { formatPositiveInt } from "../../utils/formatterUtils";
import {IMissionType} from "./missionsTypePage.tsx";

export default function MissionTypeForm(){

    const {id} = useParams();
    const navigate = useNavigate();

    const [isUpdating, setIsUpdating] = useState(false);
    const [formValues, setFormValues] = useState<IMissionType>({
        name: '',
        people_required: 0,
        minutes_duration: 0,
    });

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            id != undefined ? await updateMissionType(parseInt(id), formValues.name, formValues.people_required, formValues.minutes_duration) : await createMissionType(formValues.name, formValues.people_required, formValues.minutes_duration);
            navigate('/missions_type');
        } catch (error){
            console.error(error)
        }
    };

    const loadMissionType = async (id: number): Promise<void> => {
        try{
            const response = await getMissionType(id);
            const typedResponse: { name: string; peopleRequired: number; minutesDuration: number } | null = response as { name: string; peopleRequired: number; minutesDuration: number } | null;
            if(typedResponse != null) {
                setFormValues({
                    name: typedResponse.name,
                    people_required: typedResponse.peopleRequired ? typedResponse.peopleRequired : 0,
                    minutes_duration: typedResponse.minutesDuration ? typedResponse.minutesDuration : 0
                });
            }
        } catch(error){
            console.error(error);
        }
    };

    useEffect(() => {
        if(id != undefined) {
            loadMissionType(parseInt(id));
            setIsUpdating(true);
        }
    }, [id]);

    return(
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} justifyContent={'center'}>
            <Paper style={{padding: '15px', display: 'flex', flexDirection: 'column', gap: 2}}>
                <Typography variant="h4" align="center">
                    {
                        isUpdating ? "Modification" : "Création"
                    }
                </Typography>
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
    )
}