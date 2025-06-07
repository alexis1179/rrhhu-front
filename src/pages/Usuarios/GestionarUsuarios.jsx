import React, { useEffect, useState } from "react";
import Sidebar from "../../Components/Sidebar";
import {
  Button,
  Icon,
  Paper,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Table,
  TableCell,
  TableBody,
} from "@mui/material";
import { Groups, Reorder } from "@mui/icons-material";
import * as XLSX from "xlsx";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { set } from "date-fns";
import "../../Styles/GestionarUsuarios.css";
import { useNavigate } from "react-router-dom";
import url from "../../backUrl";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

export default function GestionarUsuarios() {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [dataUsuarios, setDataUsuarios] = useState();
  const [usuariosActivos, setUsuariosActivos] = useState([]);
  const [searchText, setSearchText] = useState(""); // add a state for search text
  const [filteredUsuarios, setFilteredUsuarios] = useState([]); // add a state for filtered users
  let rol = localStorage.getItem("rol") == "ROLE_ADMIN";
  //Fechas para API
  const [fecha, setFecha] = React.useState(dayjs()); // Para obtener la fecha actual
  const [mes, setMes] = useState(fecha.month() + 1); // Guardamos el mes actual
  const [mesLetras, setMesLetras] = useState(fecha.locale("es").format("MMMM")); // Guardamos el mes actual en letras
  const [year, setYear] = useState(fecha.year().toString()); // Guardamos el año actual
  const [openDialogPlanilla, setOpenDialogPlanilla] = useState(false);
  const [planillaMessage, setPlanillaMessage] = useState("");

  //Funcion para generar planillas
const generarPlanillas = async () => {
  const apiUrl = `${url}/planillas/crear/mes/${mesLetras}/anio/${year}`;
  console.log("Fetching data from:", apiUrl);
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));
  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: myHeaders,
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const message = await response.text(); // Use .text() since the response is just a string
    console.log("Generar planilla", message);

    // Set the planilla message to the response message
    setPlanillaMessage(message); // Set the message directly

    // Open the dialog to show the confirmation message
    setOpenDialogPlanilla(true);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

  useEffect(() => {
    const idOcultos = [1, 2, 3];
    obtenerUsuarios().then((respuesta) => {
      setUsuarios(
        //respuesta.filter((usuario) => !idOcultos.includes(usuario.id))
        respuesta
      );
      setDataUsuarios(
        respuesta
          .filter((usuario) => !idOcultos.includes(usuario.id))
          .map(
            ({
              password,
              planillaEmpleado,
              cuenta_planillera,
              horasDiurnas,
              horasNocturnas,
              roles,
              solicitudesDiasLibres,
              incapacidadDiasUsuarios,
              asuetoTrabajadoDiasUsuarios,
              cargaLaboralDiurnaUsuarios,
              extrasDiurnas,
              extrasNocturnas,
              ausenciaDiaUsuarios,
              vacacionesDiasUsuarios,
              salario_neto,
              ...item
            }) => item
          )
      );
      setUsuariosActivos(
        respuesta.filter(
          (usuario) =>
            usuario.estado == "Activo"
        )
      );
      setFilteredUsuarios(
        respuesta.filter(
          (usuario) =>
            usuario.estado == "Activo" 
        )
      );
    });
  }, []);

  const handleSearch = (event) => {
    const searchText = event.target.value.toLowerCase();
    setSearchText(searchText);
    const filteredUsuarios = usuarios.filter((user) =>
      user.email.toLowerCase().includes(searchText)
    );
    if (searchText == "" || searchText == null) {
      setFilteredUsuarios(usuariosActivos);
    } else {
      setFilteredUsuarios(filteredUsuarios);
    }
  };

  const exportToExcel = (data, filename) => {
    const workBook = XLSX.utils.book_new();
  
    // Define los títulos de las columnas
    const headers = [
      "ID",
      "Nombre",
      "Email",
      "Teléfono",
      "Dirección",
      "Fecha de nacimiento",
      "DUI",
      "Cargo",
      "Fecha de ingreso",
      "Salario",
      "Estado",
      "Sexo",
    ];
  
    // Mapea los datos en un formato adecuado, asegurando que cada campo esté en orden
    const formattedData = data.map((item) => [
      item.id,
      item.nombre,
      item.email,
      item.telefono,
      item.direccion,
      item.edad,
      item.dui,
      item.cargo,
      item.fecha_ingreso,
      item.salario,
      item.estado,
      item.sexo,
    ]);
  
    // Combina los encabezados y los datos
    const combinedData = [headers, ...formattedData];
  
    // Crea la hoja de cálculo usando el formato combinado
    const workSheet = XLSX.utils.aoa_to_sheet(combinedData);
  
    // Aplica estilos a los encabezados
    const headerStyle = {
      font: { bold: true, sz: 14 }, // Negrita y tamaño 14
      alignment: { horizontal: "center" }, // Centrado horizontal
    };
  
    // Aplica el estilo a las celdas de la primera fila (encabezados)
    headers.forEach((_, col) => {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
      if (!workSheet[cellAddress]) {
        workSheet[cellAddress] = { v: headers[col] }; // Asegúrate de que la celda exista
      }
      workSheet[cellAddress].s = headerStyle; // Aplica el estilo
    });
  
    // Añadir la hoja de cálculo al libro
    XLSX.utils.book_append_sheet(workBook, workSheet, "Usuarios");
  
    // Escribe el archivo
    XLSX.writeFile(workBook, `${filename}.xlsx`);
  };
  

  return (
    <>
      <div className="dashboard">
        <Sidebar />
        <div className="menu">
          <div className="content-title">
            <Groups fontSize="large" className="icon" />
            <Typography variant="h4" className="search-title">
              USUARIOS
            </Typography>
          </div>
          <div className="search-bar">
            <div className="search-left">
              <TextField
                label="Buscar usuario por email"
                variant="outlined"
                type="search"
                value={searchText}
                onChange={handleSearch}
              />
            </div>
            <div className="search-right">
              {rol ? (
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => navigate("/usuario/registrar")}
                >
                  Nuevo Usuario
                </Button>
              ) : (
                <></>
              )}
              {rol ? (
                <Button
                  variant="text"
                  color="info"
                  onClick={() => exportToExcel(dataUsuarios, "usuarios")}
                >
                  Exportar a Excel
                </Button>
              ) : (
                <></>
              )}
              {rol ? (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={generarPlanillas}
                >
                  Generar Planillas {mesLetras}
                </Button>
              ) : null}
            </div>
          </div>
          <div className="table">
            <TableContainer id="usuarioslist" component={Paper}>
              <Table
                id="usuarios"
                className="tabla"
                sx={{ "& .MuiTableCell-root": { fontSize: "18px" } }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell align="center">Nombre</TableCell>
                    <TableCell align="center">DUI</TableCell>
                    <TableCell align="center">Cargo</TableCell>
                    <TableCell align="center">Correo</TableCell>
                    <TableCell align="center">Estado</TableCell>
                    <TableCell align="center">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody id="bodyusuarios">
                  {filteredUsuarios.length > 0 ? (
                    filteredUsuarios.map((usuario) => (
                      <TableRow key={usuario.id}>
                        <TableCell align="center">{usuario.nombre}</TableCell>
                        <TableCell align="center">{usuario.dui}</TableCell>
                        <TableCell align="center">{usuario.cargo}</TableCell>
                        <TableCell align="center">{usuario.email}</TableCell>
                        <TableCell align="center">{usuario.estado}</TableCell>
                        <TableCell align="center">
                          <Icon>
                            <Reorder
                              sx={{ cursor: "pointer" }}
                              onClick={() => navigate(`/usuario/${usuario.id}`)}
                            />
                          </Icon>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        <Typography variant="h6">
                          No se encontraron usuarios con ese correo
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
        <Dialog
          open={openDialogPlanilla}
          onClose={() => setOpenDialogPlanilla(false)}
        >
          <DialogTitle>Crear planilla</DialogTitle>
          <DialogContent>
            <Typography variant="body1">{planillaMessage}</Typography>
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              onClick={() => setOpenDialogPlanilla(false)}
            >
              Aceptar
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
}

async function obtenerUsuarios() {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));
  const response = await fetch(url + "/usuarios", {
    method: "GET",
    headers: myHeaders,
  });
  const data = await response.json();
  return data;
}
