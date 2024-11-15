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
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";

export default function VisualizarPlanillaUsuario() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [data, setData] = React.useState([]);
    const [selectedPlanilla, setSelectedPlanilla] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
  const [fecha, setFecha] = React.useState(dayjs()); // Para obtener la fecha actual
  const [mes, setMes] = useState(fecha.month() + 1); // Guardamos el mes actual
  const [mesLetras, setMesLetras] = useState(fecha.locale("es").format("MMMM")); // Guardamos el mes actual en letras
  const [year, setYear] = useState(fecha.year().toString()); // Guardamos el año actual
  const [anios, setAnios] = useState([]);
  const [displayYear, setDisplayYear] = useState(year);

  const fetchData = async () => {
    const apiUrl = `${url}/planillas/${id}`;
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append(
      "Authorization",
      "Bearer " + localStorage.getItem("token")
    );
    try {
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: myHeaders,
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setData(data);
      console.log("Planillas", data); // Revisar las planillas del usuario

      // Filter the data for matches based on mes and anio
      const filteredData = data.filter(
        (item) => item.mes === mesLetras && item.anio === year
      );

      // Check for matches
      if (filteredData.length === 0) {
        // No matches found
        setDialogOpen(true);
      } else {
        // Select the item with the highest ID
        const highestIdItem = filteredData.reduce((prev, current) => {
          return prev.id > current.id ? prev : current;
        });
        setSelectedPlanilla(highestIdItem);
        console.log("HighestIdItem ", highestIdItem);
        console.log("Selected planilla ", selectedPlanilla);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id, mes, year]); // Add dependencies to ensure fetch is called when these change

  const handleDialogClose = () => {
    setDialogOpen(false);
    navigate("/dashboard"); // Navigate back to the dashboard
  };
    const formatDate = (dateString) => {
      return dayjs(dateString).locale("es").format("DD/MMMM/YYYY");
    };
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
            <Typography variant="h7">ID Usuario: {id}</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h7">
              Nombre Usuario:{" "}
              {selectedPlanilla
                ? selectedPlanilla.nombreEmpleado
                : "Sin información"}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h7">
              DUI Usuario:{" "}
              {selectedPlanilla
                ? selectedPlanilla.duiEmpleado
                : "Sin información"}
            </Typography>
          </Grid>
          <Grid item xs={5}>
            <Typography variant="h7">
              Salario base: $
              {selectedPlanilla ? selectedPlanilla.salarioBase.toFixed(2) : "0"}
            </Typography>
          </Grid>
          <Grid item xs={5}>
            <Typography variant="h7">
              Salario diario: $
              {selectedPlanilla ? selectedPlanilla.salarioDia.toFixed(2) : "0"}
            </Typography>
          </Grid>

          {/* Aquí se mostrará la información de pago de la planilla */}
          <Grid item xs={12}>
            <Typography variant="h6">
              Información de Pago - {mesLetras}
            </Typography>
            <Grid container>
              <Grid item xs={6}>
                <Typography variant="h7">
                  Fecha de inicio:{" "}
                  {selectedPlanilla
                    ? formatDate(selectedPlanilla.fechaInicio)
                    : "Sin información"}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h7">
                  Fecha de fin:{" "}
                  {selectedPlanilla
                    ? formatDate(selectedPlanilla.fechaFin)
                    : "Sin información"}
                </Typography>
              </Grid>
            </Grid>
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
                  <TableCell style={{ border: "none" }}>
                    $
                    {selectedPlanilla
                      ? selectedPlanilla.horasEDiurnas.toFixed(2)
                      : "0"}
                  </TableCell>
                  <TableCell style={{ border: "none" }}>
                    Descuento AFP
                  </TableCell>
                  <TableCell style={{ border: "none" }}>
                    ${" "}
                    {selectedPlanilla
                      ? selectedPlanilla.descuetoAfp.toFixed(2)
                      : "0"}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={{ border: "none" }}>
                    Total horas extras nocturnas
                  </TableCell>
                  <TableCell style={{ border: "none" }}>
                    ${" "}
                    {selectedPlanilla
                      ? selectedPlanilla.horasENocturnas.toFixed(2)
                      : "0"}
                  </TableCell>
                  <TableCell style={{ border: "none" }}>
                    Descuento ISSS
                  </TableCell>
                  <TableCell style={{ border: "none" }}>
                    ${" "}
                    {selectedPlanilla
                      ? selectedPlanilla.descuentoIsss.toFixed(2)
                      : "0"}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={{ border: "none" }}>
                    Total asueto trabajado
                  </TableCell>
                  <TableCell style={{ border: "none" }}>
                    ${" "}
                    {selectedPlanilla
                      ? selectedPlanilla.asuetos.toFixed(2)
                      : "0"}
                  </TableCell>
                  <TableCell style={{ border: "none" }}>
                    Descuento Renta
                  </TableCell>
                  <TableCell style={{ border: "none" }}>
                    ${" "}
                    {selectedPlanilla
                      ? selectedPlanilla.descuentoRenta.toFixed(2)
                      : "0"}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={{ border: "none" }}>
                    30% Vacaciones
                  </TableCell>
                  <TableCell colSpan={3} style={{ border: "none" }}>
                    ${" "}
                    {selectedPlanilla
                      ? selectedPlanilla.vacaciones.toFixed(2)
                      : "0"}
                  </TableCell>{" "}
                  {/* Merged cell */}
                </TableRow>
                <TableRow>
                  <TableCell style={{ border: "none" }}>
                    (-) Incapacidad
                  </TableCell>
                  <TableCell colSpan={3} style={{ border: "none" }}>
                    ${" "}
                    {selectedPlanilla
                      ? selectedPlanilla.incapacidades.toFixed(2)
                      : "0"}
                  </TableCell>{" "}
                  {/* Merged cell */}
                </TableRow>
                <TableRow>
                  <TableCell style={{ border: "none" }}>
                    (-) Ausencias
                  </TableCell>
                  <TableCell colSpan={3} style={{ border: "none" }}>
                    ${" "}
                    {selectedPlanilla
                      ? selectedPlanilla.diasAusentes.toFixed(2)
                      : "0"}
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
                    ${" "}
                    {selectedPlanilla
                      ? selectedPlanilla.totalDevengado.toFixed(2)
                      : "0"}
                  </TableCell>
                  <TableCell
                    style={{ border: "none", borderTop: "1px solid #ccc" }}
                  >
                    Total descuentos
                  </TableCell>
                  <TableCell
                    style={{ border: "none", borderTop: "1px solid #ccc" }}
                  >
                    ${" "}
                    {selectedPlanilla
                      ? selectedPlanilla.totalDescuentos.toFixed(2)
                      : "0"}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Grid>
          {/* Aquí se mostrará la información total de pago de la planilla */}
          <Grid item xs={12}>
            <Typography variant="h7">
              Total devengado: ${" "}
              {selectedPlanilla
                ? selectedPlanilla.totalDevengado.toFixed(2)
                : "0"}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h7">
              Total descuentos: - ${" "}
              {selectedPlanilla
                ? selectedPlanilla.totalDescuentos.toFixed(2)
                : "0"}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h7">
              Líquido efectivo: ${" "}
              {selectedPlanilla
                ? selectedPlanilla.liquidoPagar.toFixed(2)
                : "0"}
            </Typography>
          </Grid>
        </Grid>
      </div>

      {/* Dialog for no planillas found */}
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>No hay planillas generadas</DialogTitle>
        <DialogContent>
          <Typography>
            No hay planillas generadas para el mes {mesLetras}.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
