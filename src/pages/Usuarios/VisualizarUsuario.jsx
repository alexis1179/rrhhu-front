import React, { useEffect, useState } from "react";
import Sidebar from "../../Components/Sidebar";
import Loading from "../../Components/Loading";
import "../../Styles/RegistrarUsuario.css";
import {
  Button,
  Grid,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import url from "../../backUrl";

export default function VisualizarUsuario() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);
  const [edit, setEdit] = useState(false);
  const [openDialogEstado, setOpenDialogEstado] = useState(false);
  const [deshabilitarUsuario, setDeshabilitarUsuario] = useState(false);
  const [habilitarUsuario, setHabilitarUsuario] = useState(false);
  // Estados para los campos editables
  const [nombre, setNombre] = useState("");
  const [dui, setDui] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const [cargo, setCargo] = useState("");
  const [salario, setSalario] = useState("");
  const [estado, setEstado] = useState("");
  const [password, setPassword] = useState("");
  const [fecha_nacimiento, setFechaNacimiento] = useState("");
  const [sexo, setSexo] = useState("");
  const [fecha_ingreso, setFechaIngreso] = useState("");
  const [rol, setRol] = useState("");

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
          estado: data.estado,
          password: data.password,
          fecha_nacimiento: data.edad,
          sexo: data.sexo,
          fecha_ingreso: data.fecha_ingreso,
          rol: data.roles[0].name,
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
        setEstado(data.estado);
        setPassword(data.password);
        setFechaNacimiento(data.edad);
        setSexo(data.sexo);
        setFechaIngreso(data.fecha_ingreso);
        setRol(data.roles[0].name);
      })
      .catch((error) => {
        setError("Error al obtener la información del usuario.");
        setCargando(false);
      });

    if (estado == "Inactivo") {
      setHabilitarUsuario(true);
      setDeshabilitarUsuario(false);
      console.log("Habilitar: ", habilitarUsuario);
    } else {
      setHabilitarUsuario(false);
      setDeshabilitarUsuario(true);
      console.log("Deshabilitar: ", deshabilitarUsuario);
    }
  }, [id]);

  const handleSave = () => {
    modificarUsuario(
      id,
      estado,
      nombre,
      email,
      password,
      direccion,
      telefono,
      fecha_nacimiento,
      dui,
      cargo,
      fecha_ingreso,
      salario
    );
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
    return (
      <Typography variant="h4" color="error">
        {error}
      </Typography>
    );
  }

  const handleCambiarEstadoUsuario = () => {
    if (deshabilitarUsuario) {
      modificarUsuario(
        id,
        "Inactivo",
        nombre,
        email,
        password,
        direccion,
        telefono,
        fecha_nacimiento,
        dui,
        cargo,
        fecha_ingreso,
        salario,
        sexo,
        rol
      );
    }
    if (habilitarUsuario) {
      modificarUsuario(
        id,
        "Activo",
        nombre,
        email,
        password,
        direccion,
        telefono,
        fecha_nacimiento,
        dui,
        cargo,
        fecha_ingreso,
        salario,
        sexo,
        rol
      );
    } else {
      modificarUsuario(
        id,
        estado,
        nombre,
        email,
        password,
        direccion,
        telefono,
        fecha_nacimiento,
        dui,
        cargo,
        fecha_ingreso,
        salario,
        sexo,
        rol
      );
    }
    setEdit(false);
    setOpenDialogEstado(false);
  };

  return (
    <>
      <Sidebar />

      {cargando ? (
        <Loading />
      ) : (
        <div className="contenido">
          {!usuario ? (
            <Typography variant="h4">
              No se encontró la información del usuario.
            </Typography>
          ) : (
            <div className="form">
              {edit ? (
                <Typography variant="h4">Editar Empleado</Typography>
              ) : (
                <Typography variant="h4">Visualizar Empleado</Typography>
              )}
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
                <Grid item xs={6}>
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
                    label="Estado"
                    value={estado}
                    variant="outlined"
                    fullWidth
                    disabled
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
                    color="error"
                    onClick={handleCancel} // Cancelar edición
                  >
                    Cancelar
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="error"
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
                {edit && deshabilitarUsuario ? (
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => setOpenDialogEstado(true)}
                  >
                    Deshabilitar usuario
                  </Button>
                ) : null}
                {edit && habilitarUsuario ? (
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => setOpenDialogEstado(true)}
                  >
                    Habilitar usuario
                  </Button>
                ) : null}
              </div>
            </div>
          )}
          <Dialog
            open={openDialogEstado}
            onClose={() => setOpenDialogEstado(false)}
          >
            <DialogTitle>Cambiar estado de usuario</DialogTitle>
            <DialogContent>
              {deshabilitarUsuario ? (
                <Typography variant="body1">
                  ¿Está seguro de que desea deshabilitar al usuario?
                </Typography>
              ) : (
                <Typography variant="body1">
                  ¿Está seguro de que desea habilitar al usuario?
                </Typography>
              )}
            </DialogContent>
            <DialogActions>
              <Button
                variant="contained"
                color="error"
                onClick={() => setOpenDialogEstado(false)}
              >
                Cancelar
              </Button>
              <Button
                variant="contained"
                color="success"
                onClick={handleCambiarEstadoUsuario}
              >
                Confirmar
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      )}
    </>
  );
}

async function obtenerUsuario(token, id) {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", "Bearer " + token);
  const response = await fetch(url + "/usuarios" + id, {
    method: "GET",
    headers: myHeaders,
  });
  const data = await response.json();
  return data;
}

async function modificarUsuario(
  id,
  nuevoEstado,
  nombre,
  email,
  password,
  direccion,
  telefono,
  fecha_nacimiento,
  dui,
  cargo,
  fecha_ingreso,
  salario,
  sexo,
  rol
) {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));
  const data = {
    nombre: nombre,
    email: email,
    password: password,
    telefono: telefono,
    direccion: direccion,
    edad: fecha_nacimiento,
    dui: dui,
    cuenta_planillera: "0",
    cargo: cargo,
    fecha_ingreso: fecha_ingreso,
    salario: salario,
    salario_neto: "0",
    horas: 0,
    estado: nuevoEstado,
    /* planillaEmpleado: {
      iss_mes: 0,
      afp_mes: 0,
      aguinaldo: 0,
      horas_e_diurnas: 0,
      horas_e_nocturnas: 0,
    },*/
    sexo: sexo,
    dias_descontados: 0,
    roles: [
      {
        name: rol,
      },
    ],
    horasNocturnas: {
      enero: 0,
      febrero: 0,
      marzo: 0,
      abril: 0,
      mayo: 0,
      junio: 0,
      julio: 0,
      agosto: 0,
      septiembre: 0,
      octubre: 0,
      noviembre: 0,
      diciembre: 0,
    },

    horasDiurnas: {
      enero: 0,
      febrero: 0,
      marzo: 0,
      abril: 0,
      mayo: 0,
      junio: 0,
      julio: 0,
      agosto: 0,
      septiembre: 0,
      octubre: 0,
      noviembre: 0,
      diciembre: 0,
    },
  };
  const response = await fetch(url + "/modificar/" + id, {
    method: "PUT",
    headers: myHeaders,
    body: JSON.stringify({ data }),
  });

  return data;
}
