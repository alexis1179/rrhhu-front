import React, { useEffect, useState } from "react";
import Sidebar from "../../Components/Sidebar";

import "../../Styles/RegistrarUsuario.css"
import { Button, Grid, TextField, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import url from "../../backUrl";

export default function VisualizarUsuario() {
    const navigate = useNavigate();
    const { id } = useParams(); // Obtener el id del usuario desde la URL
    const [usuario, setUsuario] = useState(null); // Estado para almacenar los datos del usuario
    const [cargando, setCargando] = useState(true); // Estado para controlar la carga
    const [error, setError] = useState(false); // Estado para manejar errores
    const [edit, setEdit] = useState(false); // Estado para habilitar la edición de los campos

    useEffect(() => {
        let token = localStorage.getItem("token");
        obtenerUsuario(token, id)
            .then((data) => {
                setUsuario(data);
                setCargando(false);
            })
            .catch((error) => {
                setError("Error al obtener la información del usuario.");
                setCargando(false);
            });
    }, [id]);

    if (cargando) {
        return <Typography variant="h4">Cargando información del usuario...</Typography>; // Mostrar un mensaje de carga
    }

    if (error) {
        return <Typography variant="h4" color="error">{error}</Typography>; // Mostrar un mensaje de error si ocurre
    }

    if (!usuario) {
        return <Typography variant="h4">No se encontró la información del usuario.</Typography>;
    }

    return (
        <>
            <Sidebar />
            <div className="contenido">
                <div className="form">
                    <Typography variant="h4">Visualizar Empleado</Typography>
                    <Typography variant="h5">Información Personal</Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField label="Nombre Completo" value={usuario.nombre} variant="outlined" fullWidth disabled/>
                        </Grid>
                        <Grid item xs={4}>
                            <TextField label="Documento de Identificación" value={usuario.dui} variant="outlined" fullWidth disabled />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField label="Correo Electrónico" value={usuario.email} variant="outlined" fullWidth disabled/>
                        </Grid>
                        <Grid item xs={4}>
                            <TextField label="Teléfono" value={usuario.telefono} variant="outlined" fullWidth disabled={!edit} />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField label="Dirección" value={usuario.direccion} variant="outlined" fullWidth disabled={!edit} />
                        </Grid>
                    </Grid>
                    <Typography variant="h5">Información Laboral</Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField label="Cargo" value={usuario.cargo} variant="outlined" fullWidth disabled={!edit} />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField label="Salario" value={usuario.salario} variant="outlined" fullWidth disabled={!edit} />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField label="Fecha de ingreso" value={usuario.fecha_ingreso} variant="outlined" fullWidth disabled/>
                        </Grid>
                    </Grid>
                    <div className="buttons">
                        <Button variant="contained" color="error"
                            onClick={() => navigate("/gestionar-usuarios")}>
                            Regresar
                        </Button>
                        {edit ?
                            <Button variant="contained" color="success"
                                onClick={() => setEdit(false)}>
                                Guardar Cambios
                            </Button>
                            :
                            <Button variant="contained" color="primary"
                                onClick={() => setEdit(true)}>
                                Editar
                            </Button>
                        }
                    </div>
                </div>
            </div>
        </>
    );
}

async function obtenerUsuario(token, id) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer " + token);
    const response = await fetch(url + "/usuarios" + id, {
        method: 'GET',
        headers: myHeaders
    })
    const data = await response.json();
    return data;
}