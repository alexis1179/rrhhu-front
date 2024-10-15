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

import "../../Styles/GestionarUsuarios.css";
import { useNavigate } from "react-router-dom";
import url from "../../backUrl";

export default function GestionarUsuarios() {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [searchText, setSearchText] = useState(""); // add a state for search text
  const [filteredUsuarios, setFilteredUsuarios] = useState([]); // add a state for filtered users
  let rol = localStorage.getItem("rol") == "ROLE_ADMIN";

  useEffect(() => {
    obtenerUsuarios().then((respuesta) => {
      setUsuarios(respuesta);
      setFilteredUsuarios(respuesta); // initialize filtered users with all users
    });
  }, []);

  const handleSearch = (event) => {
    const searchText = event.target.value.toLowerCase();
    setSearchText(searchText);
    const filteredUsuarios = usuarios.filter((user) =>
      user.email.toLowerCase().includes(searchText)
    );
    setFilteredUsuarios(filteredUsuarios);
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
              </Button>:<></>}
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
