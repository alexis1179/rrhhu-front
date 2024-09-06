import React from "react";
import Sidebar from "../../Components/Sidebar";
import { Button, Icon, TextField, Typography } from "@mui/material";
import { Groups } from "@mui/icons-material";

import '../../Styles/Dashboard.css'

export default function GestionarUsuarios() {
    const columns =[
        {field: 'id', headerName: 'ID', width: 90},
        {field: 'name', headerName: 'Nombre', width: 150},
        {field: 'dui', headerName: 'DUI', width: 150},
        {field: 'cargo', headerName: 'Cargo', width: 100},
        {field: 'email', headerName: 'Correo', width: 150},
        {field: 'actions', headerName: 'Acciones', width: 50}

    ]

    return <>
        <div className="dashboard">
            <section className="side-section">
                <Sidebar />
            </section>
            <div className="menu">
                <div className="search-bar">
                    <div className="search-left">
                        <Groups fontSize="large" className="icon" />
                        <Typography variant="h4" className="search-title">USUARIOS CREADOS</Typography>
                    </div>
                    <div className="search-right">
                        <TextField label="Buscar usuario por ID" variant="outlined" type="search" />
                        <Button variant="contained" className="search-button">Buscar</Button>
                    </div>
                </div>

                <div className="button-bar">
                    <Button variant="contained" color="success">Nuevo Usuario</Button>
                    <Button variant="contained" color="error">Eliminar Usuario</Button>
                </div>

                <div className="table">
                    
                </div>

            </div>
        </div>
    </>
}