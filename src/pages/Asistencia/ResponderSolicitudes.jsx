import React, { useEffect, useState } from "react";
import Sidebar from "../../Components/Sidebar";
import { useNavigate, useParams } from "react-router-dom";
import "../../Styles/ResponderSolicitudes.css";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import {
  Button,
  Grid,
  Typography,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import url from "../../backUrl";

export default function ResponderSolicitudes() {
  const navigate = useNavigate();
  const params = useParams();
  const idUser = params.idUser;
  const idSolicitud = params.idSolicitud;
  const [solicitud, setSolicitud] = useState(null);
  const [openDialogAprobar, setOpenDialogAprobar] = useState(false);
  const [openDialogRechazar, setOpenDialogRechazar] = useState(false);

  //Enviar Aprobado

  useEffect(() => {
    obtenerSolicitudes(idUser, idSolicitud).then((respuesta) => {
      setSolicitud(respuesta);
    });
  }, []);

  const handleConfirmAprobar = async () => {
    const apiUrl = url + "/sdiaslibres/" + idSolicitud;
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append(
      "Authorization",
      "Bearer " + localStorage.getItem("token")
    );
    const data = {
      estado: "Aprobado",
    };
    try {
      const response = await fetch(apiUrl, {
        method: "PUT",
        headers: myHeaders,
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert("Se realizó con éxito la solicitud");
        navigate("/solicitudes");
      } else {
        alert("Error al enviar la solicitud");
      }
    } catch (error) {
      alert("Error al enviar la solicitud", error);
    }
  };

  //Enviar Rechazado
  const handleConfirmRechazar = async () => {
    const apiUrl = url + "/sdiaslibres/" + idSolicitud;
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append(
      "Authorization",
      "Bearer " + localStorage.getItem("token")
    );
    const data = {
      estado: "Rechazado",
    };
    try {
      const response = await fetch(apiUrl, {
        method: "PUT",
        headers: myHeaders,
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert("Se realizó con éxito la solicitud");
        navigate("/solicitudes");
      } else {
        alert("Error al enviar la solicitud");
      }
    } catch (error) {
      alert("Error al enviar la solicitud", error);
    }
  };

  const handleOpenDialogAprobar = () => {
    setOpenDialogAprobar(true);
  };

  const handleCloseDialogAprobar = () => {
    setOpenDialogAprobar(false);
  };

  const handleOpenDialogRechazar = () => {
    setOpenDialogRechazar(true);
  };

  const handleCloseDialogRechazar = () => {
    setOpenDialogRechazar(false);
  };

  return (
    <>
      <Sidebar> </Sidebar>
      <div className="contenido">
        <div className="form">
          <Box display="flex" justifyContent="center" alignItems="center">
            <Box mr={2}>
              <EventBusyIcon fontSize="large"> </EventBusyIcon>
            </Box>
            <Typography variant="h4">
              Gestionar solicitud de días libres
            </Typography>
          </Box>

          <Grid container className="input" spacing={2}>
            <Grid item size xs={3}>
              <TextField
                label="Id de solicitud"
                value={solicitud ? solicitud.id : ""}
                variant="outlined"
                fullWidth
                disabled
              />
            </Grid>
            <Grid item size xs={9}>
              <TextField
                label="Fecha de solicitud"
                value={solicitud ? solicitud.fecha_solicitud : ""}
                variant="outlined"
                fullWidth
                disabled
              />
            </Grid>

            <Grid item size xs={6}>
              <TextField
                label="Fecha de inicio"
                value={solicitud ? solicitud.fecha_inicio : ""}
                variant="outlined"
                fullWidth
                disabled
              />
            </Grid>

            <Grid item size xs={6}>
              <TextField
                label="Fecha de finalización"
                value={solicitud ? solicitud.fecha_fin : ""}
                variant="outlined"
                fullWidth
                disabled
              />
            </Grid>
            <Grid item size xs={6}>
              <TextField
                label="Cantidad total de días"
                value={solicitud ? solicitud.cantidad_dias : ""}
                variant="outlined"
                fullWidth
                disabled
              />
            </Grid>
            <Grid item size xs={6}>
              <TextField
                label="Tipo de solicitud"
                value={solicitud ? solicitud.causa : ""}
                variant="outlined"
                fullWidth
                disabled
              />
            </Grid>
          </Grid>

          <Grid container spacing={3} justifyContent="center">
            <Grid item>
              <Button
                variant="contained"
                color="success"
                size="large"
                onClick={handleOpenDialogAprobar} // Call handleOpenDialogAprobar directly
              >
                Aprobar
              </Button>
            </Grid>

            <Grid item>
              <Button
                variant="contained"
                color="error"
                size="large"
                onClick={handleOpenDialogRechazar} // Call handleOpenDialogRechazar directly
              >
                Rechazar
              </Button>
            </Grid>

            <Grid item>
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={() => navigate("/solicitudes")}
              >
                Regresar
              </Button>
            </Grid>
          </Grid>
          <Dialog
            open={openDialogAprobar}
            onClose={handleCloseDialogAprobar}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">Aprobar solicitud</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                ¿Está seguro de aprobar la solicitud?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialogAprobar} color="primary">
                Cancelar
              </Button>
              <Button onClick={handleConfirmAprobar} color="primary" autoFocus>
                Confirmar
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog
            open={openDialogRechazar}
            onClose={handleCloseDialogRechazar}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              Rechazar solicitud
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                ¿Está seguro de rechazar la solicitud?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialogRechazar} color="primary">
                Cancelar
              </Button>
              <Button onClick={handleConfirmRechazar} color="primary" autoFocus>
                Confirmar
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
    </>
  );
}

async function obtenerSolicitudes(idUser, idSolicitud) {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));
  const response = await fetch(
    `${url}/sdiaslibres/consultar/usuario/${idUser}`,
    {
      method: "GET",
      headers: myHeaders,
    }
  );
  const data = await response.json();
  const solicitudData = data.find(
    (solicitud) => solicitud.id === parseInt(idSolicitud)
  );
  console.log(data);
  console.log(solicitudData);
  return solicitudData;
}
