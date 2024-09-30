import React, { useEffect, useState } from "react";
import Sidebar from "../../Components/Sidebar";

import "../../Styles/PantallaInicioAsistencia.css";
import {
  Button,
  Icon,
  Paper,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Table,
  TableCell,
  TableBody,
} from "@mui/material";

import { Reorder } from "@mui/icons-material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import { useNavigate } from "react-router-dom";
import url from "../../backurl";

export default function PantallaInicioAsistencia() {
  const navigate = useNavigate();
  const [solicitudesDiasLibres, setSolicitudesDiasLibres] = useState([]);

  let UserId = localStorage.getItem("UserId");
  console.log(UserId);
  useEffect(() => {
    obtenerSolicitudesDiasLibres().then((respuesta) => {
      setSolicitudesDiasLibres(respuesta);
    });
  }, []);

  return (
    <>
      <Sidebar />
      <div className="card-container">
        <Card className="card" sx={{ minWidth: 900 }}>
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              Asistencia
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Recuerda hacer la carga diaria de tus horas trabajadas.
            </Typography>
          </CardContent>
          <CardActions sx={{ justifyContent: "space-between" }}>
            <Button size="small">Cargar horas</Button>
            <Button size="small">Ver historial de asistencia</Button>
          </CardActions>
        </Card>

        <Card className="card" sx={{ minWidth: 900 }}>
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              Solicitud de días libres
            </Typography>

            <CardActions sx={{ justifyContent: "space-between" }}>
              <Button
                size="small"
                onClick={() => navigate("/solicitar-dias-libres")}
              >
                Solicitar días libres
              </Button>
              <Button size="small">Gestionar solicitudes</Button>
            </CardActions>

            <div className="table">
              <TableContainer id="solicitudesDiasLibresList" component={Paper}>
                <Table
                  id="solicitudesDiasLibres"
                  className="tabla"
                  sx={{ minWidth: 750 }}
                >
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">Id Solicitud</TableCell>
                      <TableCell align="center">
                        Fecha de la Solicitud
                      </TableCell>
                      <TableCell align="center">Fecha de inicio </TableCell>
                      <TableCell align="center">
                        Fecha de finalización
                      </TableCell>
                      <TableCell align="center">Estado</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody id="bodySolicitudesDiasLibres">
                    {solicitudesDiasLibres.map((solicitudesDias) => (
                      <TableRow key={solicitudesDias.id}>
                        <TableCell align="center">
                          {solicitudesDias.id}
                        </TableCell>
                        <TableCell align="center">
                          {solicitudesDias.fecha_solicitud}
                        </TableCell>
                        <TableCell align="center">
                          {solicitudesDias.fecha_inicio}
                        </TableCell>
                        <TableCell align="center">
                          {solicitudesDias.fecha_fi}
                        </TableCell>
                        <TableCell align="center">
                          {solicitudesDias.estado}
                        </TableCell>
                        <TableCell align="center">
                          <Icon>
                            <Reorder sx={{ cursor: "pointer" }} />
                          </Icon>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
async function obtenerSolicitudesDiasLibres() {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));
  const response = await fetch(
    url + "/sdiaslibres/consultar/usuario/" + localStorage.getItem("UserId"),
    {
      method: "GET",
      headers: myHeaders,
    }
  );
  const data = await response.json();
  console.log(data);
  return data;
}
