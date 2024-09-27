import React from "react";
import Sidebar from "../../Components/Sidebar";

import "../../Styles/PantallaInicioAsistencia.css";
import { Button, CardHeader, Grid, Typography } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import { useNavigate } from "react-router-dom";
import url from "../../backurl";

export default function PantallaInicioAsistencia() {
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
      </div>
    </>
  );
}
