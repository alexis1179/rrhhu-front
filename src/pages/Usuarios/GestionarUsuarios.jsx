import React, { useEffect, useState } from "react";
import Sidebar from "../../Components/Sidebar";
import { Button, Icon, Paper, TableContainer, TableHead, TableRow, TextField, Typography, Table, TableCell, TableBody } from "@mui/material";
import { Groups, Reorder } from "@mui/icons-material";

import '../../Styles/Dashboard.css'
import { useNavigate } from "react-router-dom";
import url from "../../backUrl";

export default function GestionarUsuarios() {
    const navigate = useNavigate();
    const [usuarios, setUsuarios] = useState([]);

    let rol = localStorage.getItem("rol") == "ROLE_ADMIN";

    useEffect(() => {
        obtenerUsuarios().then(respuesta => {
            setUsuarios(respuesta);
        }
        )
    }, [])

    return <>
        <div className="dashboard">
            <Sidebar />
            <div className="menu">
                <div className="search-bar">
                    <div className="search-left">
                        <Groups fontSize="large" className="icon" />
                        <Typography variant="h5" className="search-title">USUARIOS CREADOS</Typography>
                    </div>
                    <div className="search-right">
                        <TextField label="Buscar usuario por email" variant="outlined" type="search" />
                        <Button variant="contained" className="search-button">Buscar</Button>
                    </div>
                </div>
                <div className="button-bar">
                    <Button variant="contained" color="success" onClick={() => navigate("/registrar-usuario")}>Nuevo Usuario</Button>
                    {rol ?
                        <Button variant="contained" color="error">Eliminar Usuario</Button>
                        : <>
                            <Button variant="contained" color="error" disabled>Eliminar Usuario</Button>
                        </>}
                </div>
                <div className="table">
                    <TableContainer id="usuarioslist" component={Paper}>
                        <Table id="usuarios" className="tabla" sx={{ minWidth: 750 }}>
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
                                {usuarios.map((usuario) => (
                                    <TableRow key={usuario.id}>
                                        <TableCell align="center">{usuario.nombre}</TableCell>
                                        <TableCell align="center">{usuario.dui}</TableCell>
                                        <TableCell align="center">{usuario.cargo}</TableCell>
                                        <TableCell align="center">{usuario.email}</TableCell>
                                        <TableCell align="center">
                                            <Icon>
                                                <Reorder sx={{ cursor: "pointer" }} onClick={() => navigate(`/usuarios/${usuario.id}`)} />
                                            </Icon>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </div>
        </div>
    </>
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