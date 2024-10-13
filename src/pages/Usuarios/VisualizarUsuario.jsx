import React, { useEffect, useState } from "react";
import Sidebar from "../../Components/Sidebar";
import Loading from "../../Components/Loading";
import "../../Styles/RegistrarUsuario.css"
import { Button, Grid, TextField, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import url from "../../backUrl";

export default function VisualizarUsuario() {
    const navigate = useNavigate();
    const { id } = useParams(); 
    const [usuario, setUsuario] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(false); 
    const [edit, setEdit] = useState(false);

    // Estados para los campos editables
    const [nombre, setNombre] = useState("");
    const [dui, setDui] = useState("");
    const [email, setEmail] = useState("");
    const [telefono, setTelefono] = useState("");
    const [direccion, setDireccion] = useState("");
    const [cargo, setCargo] = useState("");
    const [salario, setSalario] = useState("");

    // Estado para los valores originales
    const [valoresOriginales, setValoresOriginales] = useState({});

    useEffect(() => {
        let token = localStorage.getItem("token");
        obtenerUsuario(token, id)
            .then((data) => {
                setUsuario(data);
                
                // Guardar los valores originales
                setValoresOriginales({
                    nombre: data.nombre,
                    dui: data.dui,
                    email: data.email,
                    telefono: data.telefono,
                    direccion: data.direccion,
                    cargo: data.cargo,
                    salario: data.salario,
                });

                // Establecer los valores iniciales en los campos
                setNombre(data.nombre);
                setDui(data.dui);
                setEmail(data.email);
                setTelefono(data.telefono);
                setDireccion(data.direccion);
                setCargo(data.cargo);
                setSalario(data.salario);
                setCargando(false);
            })
            .catch((error) => {
                setError("Error al obtener la información del usuario.");
                setCargando(false);
            });
    }, [id]);

    const handleSave = () => {
        // Lógica para guardar los cambios
        setEdit(false);
    };

    const handleCancel = () => {
        // Restaurar los valores originales
        setNombre(valoresOriginales.nombre);
        setDui(valoresOriginales.dui);
        setEmail(valoresOriginales.email);
        setTelefono(valoresOriginales.telefono);
        setDireccion(valoresOriginales.direccion);
        setCargo(valoresOriginales.cargo);
        setSalario(valoresOriginales.salario);
        setEdit(false);
    };

    if (error) {
        return <Typography variant="h4" color="error">{error}</Typography>;
    }

    return (
        <>
            <Sidebar />
            {cargando ? <Loading /> :
                <div className="contenido">
                    {!usuario ? (
                        <Typography variant="h4">No se encontró la información del usuario.</Typography>
                    ) : (
                        <div className="form">
                            {edit?
                            <Typography variant="h4">Editar Empleado</Typography>:
                            <Typography variant="h4">Visualizar Empleado</Typography>}
                            <Typography variant="h5">Información Personal</Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Nombre Completo"
                                        value={nombre}
                                        onChange={(e) => setNombre(e.target.value)}
                                        variant="outlined"
                                        fullWidth
                                        disabled={!edit}
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField
                                        label="Documento de Identificación"
                                        value={dui}
                                        onChange={(e) => setDui(e.target.value)}
                                        variant="outlined"
                                        fullWidth
                                        disabled={!edit}
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField
                                        label="Correo Electrónico"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        variant="outlined"
                                        fullWidth
                                        disabled={!edit}
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField
                                        label="Teléfono"
                                        value={telefono}
                                        onChange={(e) => setTelefono(e.target.value)}
                                        variant="outlined"
                                        fullWidth
                                        disabled={!edit}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Dirección"
                                        value={direccion}
                                        onChange={(e) => setDireccion(e.target.value)}
                                        variant="outlined"
                                        fullWidth
                                        disabled={!edit}
                                    />
                                </Grid>
                            </Grid>
                            <Typography variant="h5">Información Laboral</Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Cargo"
                                        value={cargo}
                                        onChange={(e) => setCargo(e.target.value)}
                                        variant="outlined"
                                        fullWidth
                                        disabled={!edit}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Salario"
                                        value={salario}
                                        onChange={(e) => setSalario(e.target.value)}
                                        variant="outlined"
                                        fullWidth
                                        disabled={!edit}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Fecha de ingreso"
                                        value={usuario.fecha_ingreso}
                                        variant="outlined"
                                        fullWidth
                                        disabled
                                    />
                                </Grid>
                            </Grid>
                            <div className="buttons">
                                {edit ? (
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={handleCancel} // Cancelar edición
                                    >
                                        Cancelar
                                    </Button>
                                ) : (
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => navigate("/usuarios")} // Regresar sin editar
                                    >
                                        Regresar
                                    </Button>
                                )}
                                
                                {edit ? (
                                    <Button
                                        variant="contained"
                                        color="success"
                                        onClick={handleSave} // Guardar cambios
                                    >
                                        Guardar Cambios
                                    </Button>
                                ) : (
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => setEdit(true)} // Activar edición
                                    >
                                        Editar
                                    </Button>
                                )}
                                {edit ? (
                                    <Button
                                        variant="contained"
                                        color="error"
                                        onClick={() => setEdit(false)}
                                    >
                                        Deshabilitar usuario
                                    </Button>
                                ) : null}
                            </div>
                        </div>
                    )}
                </div>
            }
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
    });
    const data = await response.json();
    return data;
}
