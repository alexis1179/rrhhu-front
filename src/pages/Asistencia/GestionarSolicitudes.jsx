import React, { useEffect, useState } from "react";
import Sidebar from "../../Components/Sidebar";
import { Icon, Paper, TableContainer, TableHead, TableRow, Typography, Table, TableCell, TableBody } from "@mui/material";
import { AddCircle, EventAvailable } from "@mui/icons-material";

import '../../Styles/Dashboard.css'
import { useNavigate } from "react-router-dom";
import url from "../../backUrl";

export default function GestionarSolicitudes() {
    const navigate = useNavigate();
    const [solicitudes, setSolicitudes] = useState([]);
    const [usuarios, setUsuarios] = useState([]);

    let rol = localStorage.getItem("rol") == "ROLE_ADMIN";

    useEffect(() => {
        obtenerSolicitudes().then(respuesta => {
            setSolicitudes(respuesta);
        }
        )
        obtenerUsuarios().then(respuesta => {
            setUsuarios(respuesta);
        }
        )
    }, [])

    return (
      <>
        <div className="dashboard">
          <Sidebar />
          <div className="menu">
            <div className="search-bar">
              <div className="search-left">
                <EventAvailable fontSize="large" className="icon" />
                <Typography variant="h5" className="search-title">
                  REVISIÓN SOLICITUDES DE DÍAS LIBRES
                </Typography>
              </div>
            </div>

            <div className="table">
              <TableContainer id="solicitudeslist" component={Paper}>
                <Table
                  id="solicitudes"
                  className="tabla"
                  sx={{ minWidth: 750 }}
                >
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">ID</TableCell>
                      <TableCell align="center">Nombre</TableCell>
                      <TableCell align="center">Fecha de inicio</TableCell>
                      <TableCell align="center">
                        Fecha de finalización
                      </TableCell>
                      <TableCell align="center">Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody id="bodysolicitudes">
                    {solicitudes.map((solicitud) => (
                      <TableRow key={solicitud.id}>
                        <TableCell align="center">{solicitud.id}</TableCell>
                        <TableCell align="center">
                          {solicitud.usuario_id}
                        </TableCell>
                        <TableCell align="center">
                          {solicitud.fecha_inicio}
                        </TableCell>
                        <TableCell align="center">
                          {solicitud.fecha_fin}
                        </TableCell>
                        <TableCell align="center">
                          <Icon>
                            <AddCircle
                              sx={{ cursor: "pointer", color: "green" }}
                              onClick={() => navigate("/responder-solicitudes")}
                            />
                          </Icon>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </div>
            <Sidebar />
            <div className="menu">
                <div className="search-bar">
                    <div className="search-left">
                        <EventAvailable fontSize="large" className="icon" />
                        <Typography variant="h5" className="search-title">REVISIÓN SOLICITUDES DE DÍAS LIBRES</Typography>
                    </div>
                </div>
                <div className="table">
                    <TableContainer id="solicitudeslist" component={Paper}>
                        <Table id="solicitudes" className="tabla" sx={{ minWidth: 750 }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center">ID</TableCell>
                                    <TableCell align="center">Nombre</TableCell>
                                    <TableCell align="center">Fecha de inicio</TableCell>
                                    <TableCell align="center">Fecha de finalización</TableCell>
                                    <TableCell align="center">Acciones</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody id="bodysolicitudes">
                                {solicitudes.map((solicitud) => {
                                    const usuario = usuarios.find(usuario => usuario.id === solicitud.usuario_id);
                                    return (
                                        <TableRow key={solicitud.id}>
                                            <TableCell align="center">{solicitud.id}</TableCell>
                                            <TableCell align="center">{usuario ? usuario.nombre : "Usuario no encontrado"}</TableCell>
                                            <TableCell align="center">{solicitud.fecha_inicio}</TableCell>
                                            <TableCell align="center">{solicitud.fecha_fin}</TableCell>
                                            <TableCell align="center">
                                                <Icon>
                                                    <AddCircle sx={{ cursor: "pointer", color: "green" }} onClick={() => navigate("/dashboard")} />
                                                </Icon>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </div>
        </div>
      </>
    );
}

async function obtenerSolicitudes() {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));
    const response = await fetch(url + "/solicitudes", {
        method: 'GET',
        headers: myHeaders
    })
    const data = await response.json();
    console.log(data);
    return data;
}

async function obtenerUsuarios() {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));
    const response = await fetch(url + "/usuarios", {
        method: 'GET',
        headers: myHeaders
    })
    const data = await response.json();
    console.log(data);
    return data;
}