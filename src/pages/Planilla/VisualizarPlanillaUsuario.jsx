import React, { useState, useEffect } from "react";
import Sidebar from "../../Components/Sidebar";
import { useNavigate, useParams } from "react-router-dom";
import url from "../../backUrl";
import PaymentsIcon from "@mui/icons-material/Payments";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { set } from "date-fns";
import "../../Styles/VisualizarPlanillaUsuario.css";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
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
  Box,
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

  //para setear el año y mes nuevo
  const [uniqueMonths, setUniqueMonths] = useState([]);
  const [uniqueYears, setUniqueYears] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(mesLetras); // Default to current month
  console.log("Mes", selectedMonth);
  const [selectedYear, setSelectedYear] = useState(year); // Default to current year

  //Manejo de los dropwdowns
  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

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
      console.log("Planillas", data);

      // Obtener meses y años que tenga planillas
      const months = [...new Set(data.map((item) => item.mes))];
      const years = [...new Set(data.map((item) => item.anio))];

      setUniqueMonths(months);
      setUniqueYears(years);

      // Set mes y año por defecto
      if (months.length > 0) setSelectedMonth(months[0]);
      if (years.length > 0) setSelectedYear(years[0]);

      // Seleccionar la planilla con el mes y año por defecto
      updateSelectedPlanilla(months[0], years[0], data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setDialogOpen(true);
    }
  };

  const updateSelectedPlanilla = (month, year, data) => {
    const filteredData = data.filter(
      (item) => item.mes === month && item.anio === year
    );

    if (filteredData.length === 0) {
      setDialogOpen(true);
    } else {
      const highestIdItem = filteredData.reduce((prev, current) => {
        return prev.id > current.id ? prev : current;
      });
      setSelectedPlanilla(highestIdItem);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]); 

  useEffect(() => {
    if (data.length > 0) {
      updateSelectedPlanilla(selectedMonth, selectedYear, data);
    }
  }, [selectedMonth, selectedYear, data]);

  const handleDialogClose = () => {
    setDialogOpen(false);
    navigate("/dashboard"); // Regresamos al inicio
  };
  const formatDate = (dateString) => {
    return dayjs(dateString).locale("es").format("DD/MMMM/YYYY");
  };

  const exportToPDF = () => {
    const input = document.getElementById("pdf-content");
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("l", "mm", "a4"); // Orientación horizontal
      const imgWidth = 297; // A4
      const pageHeight = pdf.internal.pageSize.height; // A4 en mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width; // calcular la altura de la imagen
      let heightLeft = imgHeight;

      let position = 0;

      // Calcular la posición de la imagen en la página
      const xPosition = (pdf.internal.pageSize.width - imgWidth) / 2;
      const yPosition = (pageHeight - imgHeight) / 2;

      // Agregar la primera página
      pdf.addImage(imgData, "PNG", xPosition, yPosition, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Agregar las páginas restantes
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", xPosition, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }


      //const dui = selectedPlanilla ? selectedPlanilla.duiEmpleado : "";
      const nombreEmpleado = selectedPlanilla
        ? selectedPlanilla.nombreEmpleado
        : "";
      pdf.save(`boleta_pago_${nombreEmpleado}_${mesLetras}_${year}.pdf`);
    });
  };
  return (
    <>
      <Sidebar />
      <div className="content">
        <div className="header-container" style={{ margin: "50px 0 10px 0" }}>
          <PaymentsIcon fontSize="large" />
          <Typography variant="h3" component="div" style={{ marginLeft: 0 }}>
            Visualizar mi boleta de pago
          </Typography>
        </div>
        <Grid item xs={12}>
          <Typography variant="h5" sx={{ margin: "20px 0" }}>
            Seleccionar Mes y Año
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <select value={selectedMonth} onChange={handleMonthChange}>
                {uniqueMonths.map((month, index) => (
                  <option key={index} value={month}>
                    {month}
                  </option>
                ))}
              </select>
            </Grid>
            <Grid item xs={6}>
              <select value={selectedYear} onChange={handleYearChange}>
                {uniqueYears.map((year, index) => (
                  <option key={index} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </Grid>
          </Grid>
        </Grid>
        <div className="body-planilla" id="pdf-content">
          <Grid container>
            <Grid item xs={12}>
              <Typography
                variant="h4"
                component="div"
                style={{ margin: "10px 0 10px 0" }}
              >
                Importaciones E y V
              </Typography>
            </Grid>

            {/* Aquí se mostrará la información personal de la planilla */}
            <Grid item xs={12}>
              <Typography variant="h5" sx={{ margin: "20px 0" }}>
                Información Personal
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Box sx={{ margin: "20px 0" }}>
                <Typography variant="h6">ID Usuario: {id}</Typography>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box sx={{ margin: "20px 0" }}>
                <Typography variant="h6">
                  Nombre Usuario:{" "}
                  {selectedPlanilla
                    ? selectedPlanilla.nombreEmpleado
                    : "Sin información"}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box sx={{ margin: "20px 0" }}>
                <Typography variant="h6">
                  DUI Usuario:{" "}
                  {selectedPlanilla
                    ? selectedPlanilla.duiEmpleado
                    : "Sin información"}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box sx={{ margin: "20px 0" }}>
                <Typography variant="h6">
                  Cargo:  {" "}
                  {selectedPlanilla
                    ? selectedPlanilla.cargoEmpleado
                    : "0"}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box sx={{ margin: "20px 0" }}>
                <Typography variant="h6">
                  Salario base: $
                  {selectedPlanilla
                    ? selectedPlanilla.salarioBase.toFixed(2)
                    : "0"}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box sx={{ margin: "20px 0" }}>
                <Typography variant="h6">
                  Salario diario: $
                  {selectedPlanilla
                    ? selectedPlanilla.salarioDia.toFixed(2)
                    : "0"}
                </Typography>
              </Box>
            </Grid>

            {/* Aquí se mostrará la información de pago de la planilla */}
            <Grid item xs={12}>
              <Typography variant="h5" sx={{ margin: "20px 0" }}>
                Información de Pago - {mesLetras}
              </Typography>
              <Grid container>
                <Grid item xs={6}>
                  <Box sx={{ margin: "20px 0" }}>
                    <Typography variant="h6">
                      Fecha de inicio:{" "}
                      {selectedPlanilla
                        ? formatDate(selectedPlanilla.fechaInicio)
                        : "Sin información"}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ margin: "20px 0" }}>
                    <Typography variant="h6">
                      Fecha de fin:{" "}
                      {selectedPlanilla
                        ? formatDate(selectedPlanilla.fechaFin)
                        : "Sin información"}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
              <Table className="tabla-planilla" size="small">
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
              <Typography variant="h6" style={{ margin: "10px 0 10px 0" }}>
                Total devengado: ${" "}
                {selectedPlanilla
                  ? selectedPlanilla.totalDevengado.toFixed(2)
                  : "0"}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" style={{ margin: "10px 0 10px 0" }}>
                Total descuentos: - ${" "}
                {selectedPlanilla
                  ? selectedPlanilla.totalDescuentos.toFixed(2)
                  : "0"}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" style={{ margin: "10px 0 10px 0" }}>
                Líquido efectivo: ${" "}
                {selectedPlanilla
                  ? selectedPlanilla.liquidoPagar.toFixed(2)
                  : "0"}
              </Typography>
            </Grid>
          </Grid>
        </div>
        <Button
          variant="contained"
          color="primary"
          onClick={exportToPDF}
          style={{ margin: "10px 0 10px 0" }}
        >
          Exportar a PDF
        </Button>
      </div>

      {/* No hay planillas */}
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
