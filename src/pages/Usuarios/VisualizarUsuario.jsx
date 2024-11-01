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
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  InputAdornment,
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
  //mensajes
  const [openDialogEstado, setOpenDialogEstado] = useState(false);
  const [openDialogDescartar, setOpenDialogDescartar] = useState(false);
  const [openDialogModificar, setOpenDialogModificar] = useState(false);
  const [openDialogConfirmar, setOpenDialogConfirmar] = useState(false);
  const [openDialogEstadoActualizado, setOpenDialogEstadoActualizado] =
    useState(false);
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

  // validaciones

  const [phoneError, setPhoneError] = useState(false);
  const [salaryError, setSalaryError] = useState(false);

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

        if (data.estado === "Inactivo") {
          setHabilitarUsuario(true);
        } else {
          setHabilitarUsuario(false);
        }
      })
      .catch((error) => {
        setError("Error al obtener la información del usuario.");
        setCargando(false);
      });
  }, [id]);

  const isValidForm = () => {
    return !phoneError && !salaryError && direccion !== "" && cargo !== "";
  };

  const handleSave = async () => {
    setOpenDialogConfirmar(true);
  };
  const handleConfirmar = async () => {
    try {
      await modificarUsuario(
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
      setOpenDialogModificar(true);
      setOpenDialogConfirmar(false);
      setEdit(false);
    } catch (error) {
      console.error("Error al modificar el usuario:", error);
    }
  };

  const handleDescartar = () => {
    setOpenDialogDescartar(true);
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
    setRol(valoresOriginales.rol);
    setEdit(false);
    setOpenDialogDescartar(false);
  };

  if (error) {
    return (
      <Typography variant="h4" color="error">
        {error}
      </Typography>
    );
  }

  //validar formato telefono
  const handlePhoneChange = (event) => {
    const phoneRegex = /^\d{8}$/;
    const telefono = event.target.value;
    if (!phoneRegex.test(telefono)) {
      setPhoneError(true);
    } else {
      setPhoneError(false);
    }
    setTelefono(telefono); // Update the telefono state variable
  };

  const handleSalaryChange = (event) => {
    const salario = event.target.value;
    if (salario === "") {
      setSalario(salario);
      setSalaryError(false);
    } else {
      const salaryRegex = /^\d+(\.\d{1,2})?$/;
      if (!salaryRegex.test(salario) || parseFloat(salario) <= 0) {
        setSalaryError(true);
      } else {
        setSalaryError(false);
        setSalario(salario);
      }
    }
  };

  // validar cambio cargo
  const handleCargoChange = (event) => {
    const cargo = event.target.value;
    let rolValue;
    switch (cargo) {
      case "RRHH":
        rolValue = "RRHH";
        break;
      case "Administrador":
        rolValue = "ADMIN";
        break;
      default:
        rolValue = "USER";
        break;
    }
    setRol(rolValue);
    setCargo(cargo);
    console.log("Cargo: ", cargo, " Rol: ", rolValue);
  };

  const handleCambiarEstadoUsuario = () => {
    const nuevoEstado = habilitarUsuario ? "Activo" : "Inactivo";
    setTelefono(valoresOriginales.telefono);
    setDireccion(valoresOriginales.direccion);
    setCargo(valoresOriginales.cargo);
    setSalario(valoresOriginales.salario);
    setRol(valoresOriginales.rol);
    modificarUsuario(
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
    );
    setEstado(nuevoEstado);
    setOpenDialogEstado(false);
    setOpenDialogEstadoActualizado(true);
    setHabilitarUsuario(!habilitarUsuario);
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
                    disabled
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    label="Documento de Identificación"
                    value={dui}
                    onChange={(e) => setDui(e.target.value)}
                    variant="outlined"
                    fullWidth
                    disabled
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    label="Correo Electrónico"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    variant="outlined"
                    fullWidth
                    disabled
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    label="Teléfono"
                    value={telefono}
                    required
                    onChange={handlePhoneChange} // Use the handlePhoneChange function
                    error={phoneError}
                    helperText={
                      phoneError
                        ? "Debe ser un número de teléfono con 8 caracteres"
                        : ""
                    }
                    variant="outlined"
                    inputProps={{ maxLength: 8 }}
                    fullWidth
                    disabled={!edit}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Dirección"
                    value={direccion}
                    required
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
                  <FormControl fullWidth>
                    <InputLabel id="cargo-label">Cargo</InputLabel>
                    <Select
                      labelId="cargo-label"
                      label="Cargo"
                      variant="outlined"
                      required
                      displayEmpty
                      name="cargo"
                      disabled={!edit}
                      onChange={handleCargoChange}
                      value={cargo}
                    >
                      <MenuItem value=""></MenuItem>
                      <MenuItem value="RRHH">Personal de RRHH</MenuItem>
                      <MenuItem value="Administrador">Administrador</MenuItem>
                      <MenuItem value="Vendedor">Vendedor</MenuItem>
                      <MenuItem value="Gerente">Gerente</MenuItem>
                      <MenuItem value="Cajero">Cajero</MenuItem>
                      <MenuItem value="Contador">Contador</MenuItem>
                      <MenuItem value="IT">IT</MenuItem>
                    </Select>
                  </FormControl>
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
                    variant="outlined"
                    fullWidth
                    required
                    name="salario"
                    value={salario}
                    disabled={!edit}
                    onChange={(event) => {
                      if (event.target.value !== "") {
                        handleSalaryChange(event);
                      } else {
                        setSalario(event.target.value);
                        setSalaryError(false);
                      }
                    }}
                    error={salaryError}
                    helperText={salaryError ? "Debe ser un monto positivo" : ""}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">$</InputAdornment>
                      ),
                    }}
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
                    onClick={handleDescartar} // Cancelar edición
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
                    onClick={handleSave}
                    disabled={!isValidForm()}
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
                {edit && !habilitarUsuario ? (
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
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate(`/asistencia/historial/${id}`)}
              >
                Historial de Asistencia
              </Button>
            </div>
          )}
          <Dialog
            open={openDialogEstadoActualizado}
            onClose={() => setOpenDialogEstadoActualizado(false)}
          >
            <DialogTitle>Actualizar estado</DialogTitle>
            <DialogContent>
              {!habilitarUsuario ? (
                <Typography variant="body1">
                  Usuario deshabilitado con éxito
                </Typography>
              ) : (
                <Typography variant="body1">
                  Usuario habilitado con éxito
                </Typography>
              )}
            </DialogContent>
            <DialogActions>
              <Button
                variant="contained"
                //color="error"
                onClick={() => setOpenDialogEstadoActualizado(false)}
              >
                Cerrar
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog
            open={openDialogConfirmar}
            onClose={() => setOpenDialogConfirmar(false)}
          >
            <DialogTitle>Actualizar usuario</DialogTitle>
            <DialogContent>
              <Typography variant="body1">
                ¿Está seguro de que desea guardar los cambios?
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button
                variant="contained"
                color="error"
                onClick={() => setOpenDialogConfirmar(false)}
              >
                Cancelar
              </Button>
              <Button
                variant="contained"
                color="success"
                onClick={handleConfirmar}
              >
                Confirmar
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog
            open={openDialogModificar}
            onClose={() => setOpenDialogModificar(false)}
          >
            <DialogTitle>actualizar usuario</DialogTitle>
            <DialogContent>
              <Typography variant="body1">
                Usuario actualizado con éxito
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setOpenDialogModificar(false)}
              >
                Cerrar
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog
            open={openDialogDescartar}
            onClose={() => setOpenDialogDescartar(false)}
          >
            <DialogTitle>Descartar cambios</DialogTitle>
            <DialogContent>
              ¿Está seguro de que desea descartar los cambios?
              <DialogActions>
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleCancel}
                >
                  Descartar
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setOpenDialogDescartar(false)}
                >
                  Seguir editando
                </Button>
              </DialogActions>
            </DialogContent>
          </Dialog>
          <Dialog
            open={openDialogEstado}
            onClose={() => setOpenDialogEstado(false)}
          >
            <DialogTitle>Cambiar estado de usuario</DialogTitle>
            <DialogContent>
              {!habilitarUsuario ? (
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
  /*var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));*/
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
  /*const response = await fetch(url + "/modificar/" + id, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
    body: JSON.stringify({ data }),
  });
  */
  try {
    const response = await fetch(url + "/modificar/" + id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const result = await response.json();
      console.log("Empleado actualizado:", result);
    } else {
      console.error("Error al actualizar el empleado:", response.statusText);
    }
  } catch (error) {
    console.error("Error en la solicitud:", error);
  }

  return data;
}
