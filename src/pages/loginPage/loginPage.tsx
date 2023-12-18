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
import { useCallback, useState } from "react";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { login } from "../../requests/auth.ts";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth/authProvider.tsx";
import { getMe } from "../../requests/managers.ts";

export default function LoginPage() {
  const navigate = useNavigate();
  const { setIsLogin, setUserInfo } = useAuth();
  const [formValues, setFormValues] = useState<{
    mail: string;
    password: string;
  }>({
    mail: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      login(formValues.mail, formValues.password).then(() => {
        navigate("/tableau_de_bord");
        setIsLogin((prevState) => !prevState);
        getMe().then((value) => {
          setUserInfo(value);
        });
      });
    },
    [formValues, navigate, setIsLogin, setUserInfo],
  );

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      style={{ height: "100vh" }}
    >
      <Grid item xs={10} sm={6} md={4} lg={3}>
        <Paper
          elevation={3}
          sx={{
            padding: 5,
            borderRadius: "15px",
            gap: 2,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography variant="h5" sx={{ textAlign: "center" }}>
            Connexion
          </Typography>
          <Divider />
          <Grid
            component="form"
            container
            direction="column"
            alignItems="center"
            sx={{ gap: 2 }}
          >
            <TextField
              label="Email"
              name="mail"
              variant="outlined"
              value={formValues.mail}
              style={{ width: "100%" }}
              required
              onChange={(e) =>
                setFormValues({ ...formValues, mail: e.target.value })
              }
            />
            <FormControl variant="outlined" style={{ width: "100%" }}>
              <InputLabel htmlFor="outlined-adornment-password">
                Password
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                type={showPassword ? "text" : "password"}
                onChange={(event) =>
                  setFormValues({ ...formValues, password: event.target.value })
                }
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword((prevState) => !prevState)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
                name="password"
              />
            </FormControl>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              onClick={handleLogin}
            >
              Connexion
            </Button>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
}
