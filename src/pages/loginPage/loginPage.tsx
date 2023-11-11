import {Button, Grid, Paper, TextField, Typography, IconButton, InputAdornment, FormControl, InputLabel, OutlinedInput, Divider, Alert, AlertTitle, LinearProgress} from "@mui/material";
import { useEffect, useState } from "react";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import React from "react";
import { useAuth } from "../../components/template/authProvider";

export default function LoginPage(){
    const {onLogin, onLogout, isLoggedIn} = useAuth();
    const [authError, setAuthError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    
    const [formValues, setFormValues] = useState({
        mail: '',
        password: ''
    });

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if(onLogin) {
            setLoading(true);
            onLogin(formValues.mail, formValues.password).catch(() => {
                setAuthError(true);
                setLoading(false);
            });
        }
    };

    useEffect(() => {
        const storedUser = localStorage.getItem("currentUser");
        if(storedUser && isLoggedIn && onLogout) {
            onLogout().catch(() => {});
            localStorage.removeItem("currentUser");
        }
    }, []);

    return(
        <Grid container justifyContent="center" alignItems="center" style={{ height: '100vh' }}>
            <Grid item xs={10} sm={6} md={4} lg={3}>
                <Paper elevation={3} sx={{ padding:5, borderRadius:'15px' }}>
                    <Typography variant="h5" sx={{textAlign:'center', mb: 2}}>
                        TA72 - Connexion
                    </Typography>
                    <Divider/>
                    <br/>
                    <Grid component="form" onSubmit={handleSubmit} container direction="column" alignItems="center" sx={{gap: 2}}>
                        <TextField
                            label="Email"
                            name="mail"
                            variant="outlined"
                            value={formValues.mail}
                            style={{width:'100%'}}
                            error={authError}
                            required
                            onChange={(e) => setFormValues({...formValues, mail: e.target.value})}
                        />
                        <FormControl variant="outlined" style={{width:'100%'}}>
                            <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-password"
                                type={showPassword ? 'text' : 'password'}
                                onChange={(e)=>setFormValues({...formValues, password: e.target.value})}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                label="Password"
                                name="password"
                                error={authError}
                            />
                        </FormControl>
                        {
                            authError &&
                            <Alert severity="error">
                                <AlertTitle>Erreur</AlertTitle>
                                L'email et le mot de passe ne correspondent pas.<strong>Rééssayez !</strong>
                            </Alert>
                        } 
                        <br/>                       
                        <Button type="submit" variant="contained" color="primary" disabled={loading}>
                            Connexion
                        </Button>
                        {
                            loading && <LinearProgress />
                        }
                    </Grid>
                </Paper>
            </Grid>
        </Grid>
    )
}