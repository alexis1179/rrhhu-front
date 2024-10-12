import React, { useEffect, useState } from "react";
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
import "dayjs/locale/es";

import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import url from "../../backUrl";

export default function ResponderSolicitudes() {
  const navigate = useNavigate();
  /* const [open, setOpen] = React.useState(false);*/
  const [actividad, setActividad] = React.useState("");
  const [guardar, setGuardar] = React.useState(false);
  const [asuetoTrabajado, setAsuetoTrabajado] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [asuetosTrabajados, setAsuetosTrabajados] = React.useState(0);
  const [cargaLaboralDiurna, setCargaLaboralDiurna] = React.useState(0);
  const [extrasDiurnas, setExtrasDiurnas] = React.useState(0);
  const [extrasNocturnas, setExtrasNocturnas] = React.useState(0);
  const [fecha, setFecha] = React.useState(dayjs());

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleValidarGuardar = () => {
    setGuardar(true);
  };

  const handleCerrarGuardar = () => {
    setGuardar(false);
  };
  const handleCancel = () => {
    
    navigate(-1); // Regresar a la página anterior
  };

  const handleChangeActividad = (event) => {
    setActividad(event.target.value);
  };

  const handleChangeAsuetos = (event) => {
    setAsuetosTrabajados(event.target.value);
  };
  const handleChangeCargaLarboralDiurna = (event) => {
    setCargaLaboralDiurna(event.target.value);
  };
  const handleChangeHorasExtrasDiurna = (event) => {
    setExtrasDiurnas(event.target.value);
  };

  const handleChangeHorasExtrasNocturna = (event) => {
    setExtrasNocturnas(event.target.value);
  };

  const handleChangeAsuetoTrabajado = (event) => {
    setAsuetoTrabajado(event.target.checked);
  };
  const handleGuardar = async () => {
    if (asuetosTrabajados > 0) {
      registrarAsuetosTrabajados(
        asuetosTrabajados,
        fecha.locale("es").format("MMMM"),
        fecha.format("YYYY")
      );
    }
    if (cargaLaboralDiurna > 0) {
      registrarHorasDiurnas(
        parseFloat(cargaLaboralDiurna),
        fecha.locale("es").format("MMMM"),
        fecha.format("YYYY")
      );
    }
    if (extrasDiurnas > 0) {
      registrarHorasExtrasDiurnas(
        extrasDiurnas,
        fecha.locale("es").format("MMMM"),
        fecha.format("YYYY")
      );
    }
    if (extrasNocturnas > 0) {
      registrarHorasExtrasNocturnas(
        extrasNocturnas,
        fecha.locale("es").format("MMMM"),
        fecha.format("YYYY")
      );
    }
    handleCerrarGuardar();
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
                      value={fecha}
                      onChange={(newValue) => setFecha(newValue)}
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
                  value={actividad}
                  onChange={handleChangeActividad}
                >
                  <MenuItem value="Asueto">Asueto</MenuItem>
                  <MenuItem value="Incapacidad">Incapacidad</MenuItem>
                  <MenuItem value="Jornada laboral">Jornada laboral</MenuItem>
                  <MenuItem value="Vacaciones">Vacaciones</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {actividad === "Asueto" && (
              <>
                <Grid item xs={6}>
                  <FormControlLabel
                    label="Asueto trabajado"
                    control={
                      <Checkbox
                        color="success"
                        checked={asuetoTrabajado}
                        onChange={handleChangeAsuetoTrabajado}
                      />
                    }
                  />
                </Grid>
                {asuetoTrabajado && (
                  <>
                    <Grid item xs={6}>
                      <TextField
                        label="Asueto"
                        variant="outlined"
                        fullWidth
                        required
                        value={asuetosTrabajados}
                        onChange={handleChangeAsuetos}
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
                        value={extrasDiurnas}
                        onChange={handleChangeHorasExtrasDiurna}
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
                        value={extrasNocturnas}
                        onChange={handleChangeHorasExtrasNocturna}
                        inputProps={{
                          type: "number",
                          step: "0.1",
                          min: "0",
                          max: "4.0",
                          pattern: "[0-4]+(.[0-9]?)?",
                        }}
                      />
                    </Grid>
                  </>
                )}
              </>
            )}
            {actividad === "Incapacidad" && (
              <>
                <Grid item xs={6}>
                  <TextField
                    label="Cantidad de días"
                    variant="outlined"
                    fullWidth
                    required
                    inputProps={{
                      type: "number",
                      min: "1",
                      max: "30",
                      pattern: "[1-9]+([0-9]?)?",
                    }}
                  />
                </Grid>
              </>
            )}
            {actividad === "Jornada laboral" && (
              <>
                <Grid item xs={6}>
                  <TextField
                    label="Horas diurnas"
                    variant="outlined"
                    fullWidth
                    required
                    value={cargaLaboralDiurna}
                    onChange={handleChangeCargaLarboralDiurna}
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
                    value={extrasDiurnas}
                    onChange={handleChangeHorasExtrasDiurna}
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
                    value={extrasNocturnas}
                    onChange={handleChangeHorasExtrasNocturna}
                    inputProps={{
                      type: "number",
                      step: "0.1",
                      min: "0",
                      max: "4.0",
                      pattern: "[0-4]+(.[0-9]?)?",
                    }}
                  />
                </Grid>
              </>
            )}
          </Grid>

          <div className="buttons">
            <Button
              variant="contained"
              color="success"
              size="large"
              onClick={handleValidarGuardar}
            >
              Registrar
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

      <Dialog
        open={guardar}
        onClose={handleCerrarGuardar}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"¿Estás seguro de guardar tus horas?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Se guardarán las horas seleccionadas.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCerrarGuardar}>Cancelar</Button>
          <Button onClick={handleGuardar} autoFocus>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

async function registrarAsuetosTrabajados(asuetosTrabajados, mes, year) {
  const userId = localStorage.getItem("UserId");
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));

  const data = {
    cantidad_horas: asuetosTrabajados,
    mes: mes,
    año: year,
  };

  const response = await fetch(url + "/asuetos-trabajados/crear/" + userId, {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify(data),
  });
  return response;
}

async function registrarHorasDiurnas(cargaLaboralDiurna, mes, year) {
  const userId = localStorage.getItem("UserId");
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));
  const data = {
    cantidad_horas: cargaLaboralDiurna,
    mes: mes,
    año: year,
  };

  const response = await fetch(url + "/carga-laboral-diurna/crear/" + userId, {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify(data),
  });
  return response;
}

async function registrarHorasExtrasDiurnas(extrasDiurnas, mes, year) {
  const userId = localStorage.getItem("UserId");
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));
  const data = {
    cantidad_horas: extrasDiurnas,
    mes: mes,
    año: year,
  };

  const response = await fetch(url + "/extras-diurnas/crear/" + userId, {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify(data),
  });
  return response;
}

async function registrarHorasExtrasNocturnas(extrasNocturnas, mes, year) {
  const userId = localStorage.getItem("UserId");
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));
  const data = {
    cantidad_horas: extrasNocturnas,
    mes: mes,
    año: year,
  };

  const response = await fetch(url + "/extras-nocturnas/crear/" + userId, {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify(data),
  });
  return response;
}
