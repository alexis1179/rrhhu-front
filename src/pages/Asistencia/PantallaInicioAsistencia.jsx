import React from "react";
import Sidebar from "../../Components/Sidebar";

import "../../Styles/PantallaInicioAsistencia.css";
import {
  Button,
  Icon,
  Grid,
  Paper,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Table,
  TableCell,
  TableBody,
} from "@mui/material";

import { Groups, Reorder } from "@mui/icons-material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import { useNavigate } from "react-router-dom";
import url from "../../backurl";

export default function PantallaInicioAsistencia() {
  const navigate = useNavigate();
  const [solicitudesDiasLibres, setSolicitudesDiasLibres] = useState([]);

  let rol = localStorage.getItem("rol") == "ROLE_ADMIN";

  useEffect(() => {
    obtenerSolicitudesDiasLibres().then((respuesta) => {
      setSolicitudesDiasLibres(respuesta);
    });
  }, []);

  return (
    <>
      <Sidebar />
      <div className="contenido">
        <Card>
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              Asistencia
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Recuerda hacer la carga diaria de tus horas trabajadas.
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small">Cargar horas</Button>
            <Button size="small">Ver historial de asistencia</Button>
          </CardActions>
        </Card>

        <div className="table">
          <TableContainer id="solicitudesDiasLibresList" component={Paper}>
            <Table
              id="solicitudesDiasLibres"
              className="tabla"
              sx={{ minWidth: 750 }}
            >
              <TableHead>
                <TableRow>
                  <TableCell align="center">Nombre</TableCell>
                  <TableCell align="center">DUI</TableCell>
                  <TableCell align="center">Cargo</TableCell>
                  <TableCell align="center">Correo</TableCell>
                  <TableCell align="center">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody id="bodyusuarios">
                {solicitudesDiasLibres.map((usuario) => (
                  <TableRow key={usuario.id}>
                    <TableCell align="center">{usuario.nombre}</TableCell>
                    <TableCell align="center">{usuario.dui}</TableCell>
                    <TableCell align="center">{usuario.cargo}</TableCell>
                    <TableCell align="center">{usuario.email}</TableCell>
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
      </div>
    </>
  );
}
async function obtenerSolicitudesDiasLibres() {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));
  const response = await fetch(url + "/solicitudes", {
    method: "GET",
    headers: myHeaders,
  });
  const data = await response.json();
  console.log(data);
  return data;
}
