import {
    Button,
    Grid,
    Paper,
    TextField,
    Typography,
    IconButton,
    InputAdornment,
    FormControl,
    InputLabel,
    OutlinedInput,
    Divider,
} from "@mui/material";
import {useState} from "react";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {useAuth} from "../../context/auth/authContext.ts";

export default function LoginPage() {
    const {login, formValues, setFormValues} = useAuth();
    const [showPassword, setShowPassword] = useState(false);

    return (
        <Grid container justifyContent="center" alignItems="center" style={{height: '100vh'}}>
            <Grid item xs={10} sm={6} md={4} lg={3}>
                <Paper elevation={3} sx={{padding: 5, borderRadius: '15px', gap: 2, display: 'flex', flexDirection: 'column'}}>
                    <Typography variant="h5" sx={{textAlign: 'center'}}>
                        Connexion
                    </Typography>
                    <Divider/>
                    <Grid component="form" container direction="column" alignItems="center"
                          sx={{gap: 2}}>
                        <TextField
                            label="Email"
                            name="mail"
                            variant="outlined"
                            value={formValues.mail}
                            style={{width: '100%'}}
                            required
                            onChange={(e) => setFormValues({...formValues, mail: e.target.value})}
                        />
                        <FormControl variant="outlined" style={{width: '100%'}}>
                            <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-password"
                                type={showPassword ? 'text' : 'password'}
                                onChange={(event) => setFormValues({...formValues, password: event.target.value})}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={() => setShowPassword((prevState) => !prevState)}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff/> : <Visibility/>}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                label="Password"
                                name="password"
                            />
                        </FormControl>
                        <Button type="submit" variant="contained" color="primary" onClick={login}>
                            Connexion
                        </Button>
                    </Grid>
                </Paper>
            </Grid>
        </Grid>
    )
}