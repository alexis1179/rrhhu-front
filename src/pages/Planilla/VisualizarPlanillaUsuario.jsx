import React, { useState, useEffect } from "react";
import Sidebar from "../../Components/Sidebar";
import { useNavigate, useParams } from "react-router-dom";
import url from "../../backUrl";
import PaymentsIcon from "@mui/icons-material/Payments";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { set } from "date-fns";
import "../../Styles/VisualizarPlanillaUsuario.css";

import {
  Button,
  Grid,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";

export default function VisualizarPlanillaUsuario() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [data, setData] = React.useState([]);
  const [fecha, setFecha] = React.useState(dayjs()); // Para obtener la fecha actual
  const [mes, setMes] = useState(fecha.month() + 1); // Guardamos el mes actual
  const [mesLetras, setMesLetras] = useState(fecha.locale("es").format("MMMM")); // Guardamos el mes actual en letras
  const [year, setYear] = useState(fecha.year().toString()); // Guardamos el año actual
  const [anios, setAnios] = useState([]);
  const [displayYear, setDisplayYear] = useState(year);

  const fetchData = async () => {
    const apiUrl = `${url}/planilla/${id}`;
    console.log("Fetching data from:", apiUrl); // Log the URL
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append(
          "Authorization",
          "Bearer " + localStorage.getItem("token")
        );
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: myHeaders,
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setData(data);
      console.log("DATA", data); // Log the fetched data
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id, mes, year]); // Add dependencies to ensure fetch is called when these change

  return (
    <>
      <Sidebar />
      <div className="content">
        <div className="header-container">
          <PaymentsIcon fontSize="large" />
          <Typography variant="h4" component="div" style={{ marginLeft: 0 }}>
            Visualizar mi boleta de pago
          </Typography>
        </div>
        <Grid container>
          <Grid item xs={12}>
            <Typography variant="h5" component="div" style={{ marginLeft: 8 }}>
              Importaciones E y V
            </Typography>
          </Grid>

          {/* Aquí se mostrará la información personal de la planilla */}
          <Grid item xs={12}>
            <Typography variant="h6">Información Personal</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h7">ID empleado: {id}</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h7">
              Nombre empleado: {data.nombreEmpleado}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h7">
              DUI empleado: {data.duiEmpleado}
            </Typography>
          </Grid>
          <Grid item xs={5}>
            <Typography variant="h7">
              Salario base: ${data.salarioBase}
            </Typography>
          </Grid>
          <Grid item xs={5}>
            <Typography variant="h7">
              Salario diario: ${data.salarioDia}
            </Typography>
          </Grid>

          {/* Aquí se mostrará la información de pago de la planilla */}
          <Grid item xs={12}>
            <Typography variant="h6">
              Información de Pago - {mesLetras}
            </Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell
                    align="center"
                    colSpan={2}
                    className="table-header-cell"
                  >
                    Devengado
                  </TableCell>
                  <TableCell
                    align="center"
                    colSpan={2}
                    className="table-header-cell"
                  >
                    Descuentos
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell style={{ border: "none" }}>
                    Total horas extras diurnas
                  </TableCell>
                  <TableCell style={{ border: "none" }}>{id}</TableCell>
                  <TableCell style={{ border: "none" }}>
                    Descuento AFP
                  </TableCell>
                  <TableCell style={{ border: "none" }}>{id}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={{ border: "none" }}>
                    Total horas extras nocturnas
                  </TableCell>
                  <TableCell style={{ border: "none" }}>{id}</TableCell>
                  <TableCell style={{ border: "none" }}>
                    Descuento ISSS
                  </TableCell>
                  <TableCell style={{ border: "none" }}>{id}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={{ border: "none" }}>
                    Total asueto trabajado
                  </TableCell>
                  <TableCell style={{ border: "none" }}>{id}</TableCell>
                  <TableCell style={{ border: "none" }}>
                    Descuento Renta
                  </TableCell>
                  <TableCell style={{ border: "none" }}>{id}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={{ border: "none" }}>
                    30% Vacaciones
                  </TableCell>
                  <TableCell colSpan={3} style={{ border: "none" }}>
                    {id}
                  </TableCell>{" "}
                  {/* Merged cell */}
                </TableRow>
                <TableRow>
                  <TableCell style={{ border: "none" }}>
                    (-) Incapacidad
                  </TableCell>
                  <TableCell colSpan={3} style={{ border: "none" }}>
                    {id}
                  </TableCell>{" "}
                  {/* Merged cell */}
                </TableRow>
                <TableRow>
                  <TableCell style={{ border: "none" }}>
                    (-) Ausencias
                  </TableCell>
                  <TableCell colSpan={3} style={{ border: "none" }}>
                    {id}
                  </TableCell>{" "}
                  {/* Merged cell */}
                </TableRow>
                <TableRow>
                  <TableCell
                    style={{ border: "none", borderTop: "1px solid #ccc" }}
                  >
                    Total devengado
                  </TableCell>
                  <TableCell
                    style={{ border: "none", borderTop: "1px solid #ccc" }}
                  >
                    {id}
                  </TableCell>
                  <TableCell
                    style={{ border: "none", borderTop: "1px solid #ccc" }}
                  >
                    Total descuentos
                  </TableCell>
                  <TableCell
                    style={{ border: "none", borderTop: "1px solid #ccc" }}
                  >
                    {id}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Grid>
          {/* Aquí se mostrará la información total de pago de la planilla */}
          <Grid item xs={12}>
            <Typography variant="h7">Total devengado: $ {id}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h7">Total descuentos: -$ {id}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h7">Líquido efectivo: $ {id}</Typography>
          </Grid>
        </Grid>
      </div>
    </>
  );
}
