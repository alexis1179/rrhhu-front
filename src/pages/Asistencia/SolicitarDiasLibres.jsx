import * as React from "react";
import Sidebar from "../../Components/Sidebar";

import dayjs from "dayjs";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Select, MenuItem, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import url from "../../backUrl";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import "../../Styles/SolicitarDiasLibres.css";
import "dayjs/locale/es";
import {
  Button,
  Grid,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from "@mui/material";

const tomorrow = dayjs().add(1, "day");
const afterTomorrow = dayjs().add(2, "day");

export default function SolicitarDiasLibres() {
  const navigate = useNavigate();
  const [fechaSolicitud] = React.useState(dayjs());
  const [startDate, setStartDate] = React.useState(tomorrow);
  const [endDate, setEndDate] = React.useState(afterTomorrow);
  const [daysDiff, setDaysDiff] = React.useState(0);
  const [error, setError] = React.useState(null);
  const [causa, setCausa] = React.useState("");
  const [endDateDisabled, setEndDateDisabled] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  //Validar la cantidad de días
  React.useEffect(() => {
    const diff = endDate.diff(startDate, "days");
    setDaysDiff(diff);
    if (diff < 1) {
      setError("La cantidad de días debe ser igual o mayor a 1");
    } else {
      setError(null);
    }
  }, [startDate, endDate]);

  //Al cambiar la causa de las vacaciones
  const handleCausaChange = (event) => {
    const selectedCausa = event.target.value;
    setCausa(selectedCausa);

    if (selectedCausa === "Vacaciones") {
      setEndDateDisabled(true);
      setEndDate(startDate.add(15, "days"));
    } else if (selectedCausa === "Permiso por maternidad") {
      setEndDateDisabled(true);
      setEndDate(startDate.add(103, "days"));
    } else if (selectedCausa === "Permiso por paternidad") {
      setEndDateDisabled(true);
      setEndDate(startDate.add(60, "days"));
    } else if (selectedCausa === "") {
      setEndDateDisabled(true);
      setEndDate(afterTomorrow);
    } else {
      setEndDateDisabled(false);
      setEndDate(startDate.add(1, "days"));
    }
  };

  //Al clickear el boton de guardar ser valida que los campos esten completos
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (error) {
      alert(error);
    } else if (!startDate || !endDate || !causa) {
      alert("Por favor, complete todos los campos obligatorios");
    } else {
      setOpen(true);
    }
  };

  //Confirmar en el cuadro de dialogo
  const handleConfirm = async () => {
    const userId = localStorage.getItem("UserId");
    const apiUrl = url + "/sdiaslibres/crear/" + userId;
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append(
      "Authorization",
      "Bearer " + localStorage.getItem("token")
    );
    const data = {
      fecha_solicitud: fechaSolicitud.format("DD/MM/YYYY"),
      fecha_inicio: startDate.format("DD/MM/YYYY"),
      fecha_fin: endDate.format("DD/MM/YYYY"),
      cantidad_dias: daysDiff,
      mes: startDate.locale("es").format("MMMM"),
      año: startDate.format("YYYY"),
      causa: causa,
      estado: "Pendiente",
    };

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert("Se realizó con éxito la solicitud");
        // Reset fields to default values
        setStartDate(tomorrow);
        setEndDate(afterTomorrow);
        setCausa("");
        setDaysDiff(0);
        setError(null);
      } else {
        alert("Error al enviar la solicitud");
      }
    } catch (error) {
      alert("Error al enviar la solicitud", error);
    }
    setOpen(false);
  };

  //Cerrar el cuadro de dialogo
  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <>
      <Sidebar />
      <div className="contenido">
        <div className="form">
          <Box display="flex" justifyContent="center" alignItems="center">
            <Box mr={2}>
              <EventBusyIcon fontSize="large"> </EventBusyIcon>
            </Box>
            <Typography variant="h4"> Solicitud de días libres</Typography>
          </Box>

          <Grid container className="input" spacing={2}>
            <Grid item size xs={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={["DatePicker"]}>
                  <DemoItem>
                    <Typography variant="h6">Fecha de inicio</Typography>
                    <DatePicker
                      value={startDate}
                      onChange={(newValue) => setStartDate(newValue)}
                      disablePast
                      views={["year", "month", "day"]}
                      inputFormat="DD/MM/YYYY"
                    />
                  </DemoItem>
                </DemoContainer>
              </LocalizationProvider>
            </Grid>

            <Grid item size xs={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={["DatePicker"]}>
                  <DemoItem>
                    <Typography variant="h6">Fecha de finalización</Typography>
                    <DatePicker
                      value={endDate}
                      onChange={(newValue) => setEndDate(newValue)}
                      disablePast
                      views={["year", "month", "day"]}
                      inputFormat="DD/MM/YYYY"
                      disabled={endDateDisabled}
                    />
                  </DemoItem>
                </DemoContainer>
              </LocalizationProvider>
            </Grid>

            <Grid item size xs={6}>
              <Typography variant="h6">Tipo de solicitud:</Typography>
              <Select
                value={causa}
                onChange={handleCausaChange}
                displayEmpty
                inputProps={{ "aria-label": "Tipo de solicitud" }}
              >
                <MenuItem value="">Seleccione un tipo de solicitud</MenuItem>
                <MenuItem value="Vacaciones">Vacaciones</MenuItem>
                <MenuItem value="Permiso por maternidad">
                  Permiso por maternidad
                </MenuItem>
                <MenuItem value="Permiso por paternidad">
                  Permiso por paternidad
                </MenuItem>
                <MenuItem value="Permiso por emergencia familiar">
                  Permiso por emergencia familiar
                </MenuItem>
                <MenuItem value="Enfermedad">Permiso por enfermedad</MenuItem>
                <MenuItem value="Permiso por defunción">
                  {" "}
                  Permiso por defunción
                </MenuItem>
              </Select>
            </Grid>

            <Grid item size xs={4}>
              {/* <TextField
                label="Cantidad total de días"
                value={daysDiff}
                variant="outlined"
                fullWidth
                disabled
              />*/}
              <Typography variant="h6">Cantidad de días:</Typography>
              <Typography variant="h6">{daysDiff}</Typography>
              {error && (
                <Typography variant="body2" color="error">
                  {error}
                </Typography>
              )}
            </Grid>
          </Grid>

          <div className="buttons">
            <Button
              variant="contained"
              color="success"
              size="large"
              onClick={handleSubmit}
            >
              Guardar
            </Button>

            <Dialog open={open} onClose={handleCancel}>
              <DialogTitle>
                ¿Estás seguro de continuar con tu solicitud?
              </DialogTitle>
              <DialogContent>
                <p>¿Estás seguro de que deseas enviar tu solicitud?</p>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCancel}>Cancelar</Button>
                <Button onClick={handleConfirm}>Confirmar</Button>
              </DialogActions>
            </Dialog>

            <Button
              variant="contained"
              color="error"
              size="large"
              onClick={() => navigate("/inicio-asistencia")}
            >
              Cancelar
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
