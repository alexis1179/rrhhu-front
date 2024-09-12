import React from "react";
import Sidebar from "../../Components/Sidebar";

import "../../Styles/RegistrarUsuario.css"
import { Button, Grid, TextField, Typography } from "@mui/material";

export default function RegistrarUsuario() {

    return <>
        <div className="contenido">
            <Sidebar />
            <div className="form">
                <Typography variant="h3">
                    Registrar Nuevo Empleado
                </Typography>
                <Typography variant="h5">
                    Información Personal
                </Typography>
                <Grid container className="input" spacing={3}>
                    <Grid item xs={12}>
                        <Typography variant="body1">
                            Nombre Completo
                        </Typography>
                        <TextField fullWidth />
                    </Grid>
                    <Grid item xs={4}>
                        <Typography variant="body1">
                            Documento de Identificación
                        </Typography>
                        <TextField fullWidth />
                    </Grid>
                    
                    <Grid item xs={4}>
                        <Typography variant="body1">
                            Correo Electrónico
                        </Typography>
                        <TextField fullWidth />
                    </Grid>
                    <Grid item xs={4}>
                        <Typography variant="body1">
                            Teléfono
                        </Typography>
                        <TextField fullWidth />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="body1">
                            Dirección
                        </Typography>
                        <TextField fullWidth />
                    </Grid>
                </Grid>
                <Typography variant="h5">
                    Información Laboral
                </Typography>
                <Grid container className="input" spacing={3}>
                    <Grid item xs={6}>
                        <Typography variant="body1">
                            Cargo
                        </Typography>
                        <TextField fullWidth />
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body1">
                            Fecha de Ingreso
                        </Typography>
                        <TextField fullWidth/>
                    </Grid>
                </Grid>
                <div className="buttons">
                    <Button variant="contained" color="success" size="large">
                        Registrar
                    </Button>
                    <Button variant="contained" color="error" size="large">
                        Cancelar
                    </Button>
                </div>
            </div>
        </div>

    </>
}