import * as React from "react";
import Sidebar from "../../Components/Sidebar";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Grid,
  Typography,
  TextField,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Checkbox,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import dayjs from "dayjs";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import url from "../../backUrl";

export default function ResponderSolicitudes() {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCancel = () => {
    // Add your cancel logic here
    navigate(-1); // Go back to the previous page
  };
  return (
    <>
      <Sidebar> </Sidebar>
      <div className="contenido">
        <div className="form">
          <Typography variant="h4"> Registrar horario laboral</Typography>
          <Grid container spacing={2}>
            <Grid item size xs={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={["DatePicker"]}>
                  <DemoItem>
                    <DatePicker
                      label="Fecha"
                      disablePast
                      views={["year", "month", "day"]}
                      inputFormat="DD/MM/YYYY"
                      sx={{ marginTop: 0 }}
                    />
                  </DemoItem>
                </DemoContainer>
              </LocalizationProvider>
            </Grid>

            <Grid item size xs={6}>
              <FormControl fullWidth>
                <InputLabel id="Actividad-label">Actividad</InputLabel>
                <Select
                  labelId="Actividad-label"
                  label="Actividad"
                  variant="outlined"
                  name="Actividad"
                  required
                  displayEmpty
                  defaultValue={""}
                >
                  <MenuItem value="Asueto">Asueto</MenuItem>
                  <MenuItem value="Incapacidad">Incapacidad</MenuItem>
                  <MenuItem value="Jornada laboral">Jornada laboral</MenuItem>
                  <MenuItem value="Vacaciones">Vacaciones</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <FormControlLabel
                label="Asueto trabajado"
                control={<Checkbox color="success" />}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="Horas diurnas"
                variant="outlined"
                fullWidth
                required
                inputProps={{
                  type: "number",
                  step: "0.1",
                  min: "0",
                  max: "8.0",
                  pattern: "[0-8]+(.[0-9]?)?",
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Asueto"
                variant="outlined"
                fullWidth
                required
                inputProps={{
                  type: "number",
                  step: "0.1",
                  min: "0",
                  max: "8.0",
                  pattern: "[0-8]+(.[0-9]?)?",
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Horas extras diurnas"
                variant="outlined"
                fullWidth
                required
                inputProps={{
                  type: "number",
                  step: "0.1",
                  min: "0",
                  max: "4.0",
                  pattern: "[0-4]+(.[0-9]?)?",
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Horas extras nocturnas"
                variant="outlined"
                fullWidth
                required
                inputProps={{
                  type: "number",
                  step: "0.1",
                  min: "0",
                  max: "4.0",
                  pattern: "[0-4]+(.[0-9]?)?",
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Duración en días"
                variant="outlined"
                fullWidth
                required
                inputProps={{
                  type: "number",
                  step: "1",
                  min: "0",
                }}
              />
            </Grid>
          </Grid>

          <div className="buttons">
            <Button
              variant="contained"
              color="success"
              size="large"
              onClick={""}
            >
              Aceptar
            </Button>

            <Button
              variant="contained"
              color="error"
              size="large"
              onClick={handleClickOpen}
            >
              Cancelar
            </Button>
          </div>
        </div>
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"¿Estás seguro de descartar tus cambios?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Si descartas tus cambios, no podrás recuperar la información.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>No</Button>
          <Button onClick={handleCancel} autoFocus>
            Sí
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
