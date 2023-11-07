import React, { useState } from 'react';

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Button, Grid, Paper, TextField, Typography, IconButton, InputAdornment, FormControl, InputLabel, OutlinedInput } from '@mui/material';
import { request } from '../../utils';
import { useNavigate } from 'react-router-dom';

export default function LoginPage(){
    const [formValues, setFormValues] = useState({
        mail: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const navigate = useNavigate();

    const handleLogin = React.useCallback((e: React.MouseEvent) => {
        e.preventDefault();

        request.post("/auth/login", formValues).then(() => {
            navigate("/tableau_de_bord");
        })
    }, [formValues, navigate]);

    return(
        <Grid container justifyContent="center" alignItems="center" style={{ height: '100vh' }}>
            <Grid item xs={10} sm={6} md={4} lg={2}>
                <Paper elevation={3} sx={{ padding:5, borderRadius:'15px' }}>
                    <Typography variant="h5" sx={{textAlign:'center', mb: 2}}>
                        Login
                    </Typography>
                    <form>
                        <Grid container direction="column" alignItems="center" sx={{gap: 2}}>
                            <TextField
                                label="Email"
                                variant="outlined"
                                value={formValues.mail}
                                onChange={(e) => setFormValues({...formValues, mail: e.target.value})}
                            />
                            <FormControl variant="outlined">
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
                                />
                            </FormControl>
                            <Button type="submit" variant="contained" color="primary" onClick={handleLogin}>
                                Login
                            </Button>
                        </Grid>
                    </form>
                </Paper>
            </Grid>
        </Grid>
    )
}
