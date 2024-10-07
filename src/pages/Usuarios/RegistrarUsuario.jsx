import React, { useState, useCallback } from "react";
import Sidebar from "../../Components/Sidebar";

import "../../Styles/RegistrarUsuario.css";
import {
  Button,
  Grid,
  TextField,
  Typography,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
//import dayjs from "dayjs";
//import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { OutlinedInput, InputAdornment } from "@mui/material";
import url from "../../backUrl";

export default function RegistrarUsuario() {
  const navigate = useNavigate();
  const [emailError, setEmailError] = useState(false);
  const [identificationError, setIdentificationError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [salaryError, setSalaryError] = useState(false);
  const [rol, setRol] = useState("");
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [openError, setOpenError] = useState(false);

  //para guardar los valores del formulario
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  //const [edad, setEdad] = useState("");
  const [dui, setDui] = useState("");
  //const [cuenta_planillera, setCuentaPlanillera] = useState("");
  const [cargo, setCargo] = useState("");
  const [fecha_ingreso, setFechaIngreso] = useState("");
  const [salario, setSalario] = useState("");
  const [sexo, setSexo] = useState("");
  const [fecha_nacimiento, setFechaNacimiento] = useState("");

  //validar correo formato
  const handleEmailChange = (event) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const email = event.target.value;
    if (!emailRegex.test(email)) {
      setEmailError(true);
    } else {
      setEmailError(false);
      setEmail(email);
      console.log("email: ", email);
    }
  };

  //validar formato dui
  const handleIdentificationChange = (event) => {
    const identificationRegex = /^\d{9}$/;
    const dui = event.target.value;
    if (!identificationRegex.test(dui)) {
      setIdentificationError(true);
    } else {
      setIdentificationError(false);
      setDui(dui);
      console.log("Dui : ", dui);
    }
  };

  //validar formato telefono
  const handlePhoneChange = (event) => {
    const phoneRegex = /^\d{8}$/;
    const telefono = event.target.value;
    if (!phoneRegex.test(telefono)) {
      setPhoneError(true);
    } else {
      setPhoneError(false);
      setTelefono(telefono);
      console.log("telefono : ", telefono);
    }
  };

  //validar formato salario
  const handleSalaryChange = (event) => {
    const salaryRegex = /^\d+(\.\d{1,2})?$/;
    const salario = event.target.value;
    if (!salaryRegex.test(salario) || parseFloat(salario) <= 0) {
      setSalaryError(true);
    } else {
      setSalaryError(false);
      setSalario(salario);
      console.log("salario : ", salario);
    }
  };

  //validar cargo y asignar rol
  /* const handleCargoChange = (event) => {
    const cargo = event.target.value;
    setCargo(cargo);
      console.log("cargo : ", cargo);
    let rolValue;
    if (cargo === "Personal de RRHH") {
      rolValue = "RRHH";
      setRol(rolValue);
      console.log("rol : ", rol);
    } else if (cargo === "Administrador") {
      rolValue = "ADMIN";
      setRol(rolValue);
      console.log("rol : ", rol);
    } else {
      rolValue = "USER";
      setRol(rolValue);
      console.log("rol : ", rol);
    }
    
      
  };*/
  const handleCargoChange = (event) => {
    const cargo = event.target.value;
    setCargo(cargo);
    if (cargo === "RRHH") {
      setRol("RRHH");
    } else if (cargo === "Administrador") {
      setRol("ADMIN");
    } else {
      setRol("USER");
    }
    console.log("Cargo:  ", cargo, " Rol:  ", rol);
  };
  const handleSave = () => {
    if (
      nombre &&
      email &&
      telefono &&
      direccion &&
      //edad &&
      dui &&
      //cuenta_planillera &&
      cargo &&
      fecha_ingreso &&
      salario &&
      sexo &&
      fecha_nacimiento &&
      !emailError &&
      !identificationError &&
      !phoneError &&
      !salaryError
    ) {
      const newPassword = generatePassword();
      setPassword(newPassword);
      RegistrarUsuario(newPassword);
    } else {
      setOpenError(true);
    }
  };

  const handleErrorClose = () => {
    setOpenError(false);
  };

  const handleClose = () => {
    setOpen(false);
    navigate("/gestionar-usuarios");
  };

  const RegistrarUsuario = (password) => {
    const apiUrl = url + "/crear";

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append(
      "Authorization",
      "Bearer " + localStorage.getItem("token")
    );

    const userData = {
      nombre,
      email,
      password,
      telefono,
      direccion,
      //edad,
      dui,
      // cuenta_planillera,
      cargo,
      fecha_ingreso,
      salario,
      sexo,
      fecha_nacimiento,
      roles: [
        {
          name: rol,
        },
      ],
    };

    fetch(apiUrl, {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(userData),
    })
      .then((response) => response.json())
      .then((data) => {
        setOpen(true);
      })
      .catch((error) => {
        setOpenError(true);
      });
  };

  return (
    <>
      <Sidebar />
      <div className="contenido">
        <div className="form">
          <Typography variant="h4">Registrar Nuevo Empleado</Typography>
          <Typography variant="h5">Información Personal</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Nombre Completo"
                variant="outlined"
                fullWidth
                name="nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Fecha de nacimiento"
                    disableFuture
                    views={["year", "month", "day"]}
                    inputFormat="DD/MM/YYYY"
                    onChange={(e) => setFechaNacimiento(e.target.value)}
                    name="fecha_nacimiento"
                    renderInput={(params) => <OutlinedInput {...params} />}
                  />
                </LocalizationProvider>
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel id="sexo-label">Sexo</InputLabel>
                <Select
                  labelId="sexo-label"
                  label="Sexo"
                  variant="outlined"
                  name="sexo"
                  onChange={(e) => setSexo(e.target.value)}
                  required
                  displayEmpty
                  defaultValue={""}
                >
                  <MenuItem value=""></MenuItem>
                  <MenuItem value="Femenino">Femenino</MenuItem>
                  <MenuItem value="Masculino">Masculino</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="Documento de Identificación"
                variant="outlined"
                fullWidth
                required
                name="dui"
                onChange={handleIdentificationChange}
                error={identificationError}
                helperText={
                  identificationError ? "Debe ser un número de 9 dígitos" : ""
                }
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="Dirección"
                variant="outlined"
                fullWidth
                onChange={(e) => setDireccion(e.target.value)}
                name="direccion"
                required
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="Teléfono"
                variant="outlined"
                fullWidth
                name="telefono"
                required
                onChange={(event) => {
                  handlePhoneChange(event);
                }}
                error={phoneError}
                helperText={
                  phoneError
                    ? "Debe ser un número de teléfono con 8 caracteres"
                    : ""
                }
                inputProps={{ maxLength: 9 }}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="Correo Electrónico"
                variant="outlined"
                fullWidth
                required
                name="email"
                onChange={handleEmailChange}
                error={emailError}
                helperText={
                  emailError ? "Debe ser un correo electrónico válido" : ""
                }
              />
            </Grid>
          </Grid>

          <Typography variant="h5">Información Laboral</Typography>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="cargo-label">Cargo</InputLabel>
                <Select
                  labelId="cargo-label"
                  label="Cargo"
                  variant="outlined"
                  required
                  displayEmpty
                  name="cargo"
                  onChange={handleCargoChange}
                  defaultValue={""}
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
                label="Salario"
                variant="outlined"
                fullWidth
                required
                name="salario"
                onChange={handleSalaryChange}
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
              <FormControl fullWidth>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Fecha de ingreso"
                    name="fecha_ingreso"
                    views={["year", "month", "day"]}
                    onChange={(e) => setFechaIngreso(e.target.value)}
                    inputFormat="DD/MM/YYYY"
                    renderInput={(params) => <OutlinedInput {...params} />}
                  />
                </LocalizationProvider>
              </FormControl>
            </Grid>
          </Grid>
          <div className="buttons">
            <Button variant="contained" color="success" onClick={handleSave}>
              Guardar
            </Button>

            <Dialog open={open} onClose={handleClose}>
              <DialogTitle>Usuario creado con éxito</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Sus credenciales para ingresar son su correo electrónico y la
                  siguiente contraseña: {password}
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose}>Cerrar</Button>
              </DialogActions>
            </Dialog>

            <Dialog open={openError} onClose={handleErrorClose}>
              <DialogTitle>Error</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Por favor, complete todos los campos correctamente antes de
                  continuar.
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleErrorClose}>Cerrar</Button>
              </DialogActions>
            </Dialog>

            <Button
              variant="contained"
              color="error"
              onClick={() => navigate("/gestionar-usuarios")}
            >
              Cancelar
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

function generatePassword() {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let password = "";
  for (let i = 0; i < 8; i++) {
    password += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }
  return password;
}
