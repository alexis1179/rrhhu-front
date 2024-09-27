import React from "react";
import Sidebar from "../../Components/Sidebar";

import "../../Styles/RegistrarUsuario.css"
import { Button, Grid, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";

export default function RegistrarUsuario() {
    const navigate = useNavigate();
    const RegistrarUsuario = () => {
        // Aqui iria la lógica para registrar el usuario
        
        navigate("/gestionar-usuarios");
    }
    return <>
        <Sidebar />
        <div className="contenido">
            <div className="form">
                <Typography variant="h4">Registrar Nuevo Empleado</Typography>
                <Typography variant="h5">Información Personal</Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField label="Nombre Completo" variant="outlined" fullWidth />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField label="Documento de Identificación" variant="outlined" fullWidth />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField label="Correo Electrónico" variant="outlined" fullWidth />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField label="Teléfono" variant="outlined" fullWidth />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField label="Dirección" variant="outlined" fullWidth />
                    </Grid>
                </Grid>
                <Typography variant="h5">Información Laboral</Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField label="Cargo" variant="outlined" fullWidth />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField label="Salario" variant="outlined" fullWidth />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField label="Fecha de ingreso" variant="outlined" fullWidth/>
                    </Grid>
                </Grid>
                <div className="buttons">
                    <Button variant="contained" color="success" onClick={RegistrarUsuario}>
                        Registrar
                    </Button>
                    <Button variant="contained" color="error"
                        onClick={() => navigate("/gestionar-usuarios")}>
                        Cancelar
                    </Button>
                </div>

            </div>
        </div>



    </>
}