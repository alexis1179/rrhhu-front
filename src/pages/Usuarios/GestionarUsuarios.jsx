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

import "../../Styles/GestionarUsuarios.css";
import { useNavigate } from "react-router-dom";
import url from "../../backUrl";

export default function GestionarUsuarios() {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [dataUsuarios, setDataUsuarios] = useState();
  const [usuariosActivos, setUsuariosActivos] = useState([]);
  const [searchText, setSearchText] = useState(""); // add a state for search text
  const [filteredUsuarios, setFilteredUsuarios] = useState([]); // add a state for filtered users
  let rol = localStorage.getItem("rol") == "ROLE_ADMIN";

  useEffect(() => {
    obtenerUsuarios().then((respuesta) => {
      setUsuarios(respuesta);
      setDataUsuarios(respuesta.map(({password, planillaEmpleado, cuenta_planillera, horasDiurnas, horasNocturnas, roles, solicitudesDiasLibres, incapacidadDiasUsuarios, asuetoTrabajadoDiasUsuarios, cargaLaboralDiurnaUsuarios, extrasDiurnas,	extrasNocturnas,	ausenciaDiaUsuarios,	vacacionesDiasUsuarios, salario_neto, ...item}) => item));
      setUsuariosActivos(respuesta.filter((usuario) => usuario.estado == "Activo"));
      setFilteredUsuarios(respuesta.filter((usuario) => usuario.estado == "Activo"));
    });
  }, []);

  const handleSearch = (event) => {
    const searchText = event.target.value.toLowerCase();
    setSearchText(searchText);
    const filteredUsuarios = usuarios.filter((user) =>
      user.email.toLowerCase().includes(searchText)
    );
    if (searchText == "" || searchText == null) {
      setFilteredUsuarios(usuariosActivos)
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
      "Sexo"
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
      item.sexo
    ]);

    // Combina los encabezados y los datos
    const combinedData = [headers, ...formattedData];

    // Crea la hoja de cálculo usando el formato combinado
    const workSheet = XLSX.utils.aoa_to_sheet(combinedData);
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
              {rol ?
                <Button variant="contained" color="success" onClick={() => navigate("/usuario/registrar")}>
                  Nuevo Usuario
                </Button> : <></>}
              {rol ?
                <Button variant="text" color="info" onClick={() => exportToExcel(dataUsuarios, 'usuarios')}>
                  Exportar a Excel
                </Button> : <></>}
            </div>
          </div>
          <div className="table">
            <TableContainer id="usuarioslist" component={Paper}>
              <Table id="usuarios" className="tabla" sx={{ '& .MuiTableCell-root': { fontSize: '18px' } }}>
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
                              onClick={() =>
                                navigate(`/usuario/${usuario.id}`)
                              }
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
