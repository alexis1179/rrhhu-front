import React from "react";
import Sidebar from "../../Components/Sidebar";
import { Button, Icon, Paper, TableContainer, TableHead, TableRow, TextField, Typography, Table, TableCell, TableBody } from "@mui/material";
import { Groups } from "@mui/icons-material";

import '../../Styles/Dashboard.css'
import { useNavigate } from "react-router-dom";

export default function GestionarUsuarios() {
    const navigate = useNavigate();
    let rol = localStorage.getItem("rol") == "admin";

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
                        : <></>}
                </div>
                <div className="table">
                    <TableContainer id="usuarioslist" component={Paper}>
                        <Table id="usuarios" className="tabla" sx={{minWidth:750}}>
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
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </div>
        </div>
    </>
}