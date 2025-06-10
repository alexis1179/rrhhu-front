import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, TextField, Typography } from "@mui/material";
import url from "../../backUrl";
import "../../Styles/Login.css";
import logo from  "../../image/logoCo.png";

// Simulación de autenticación de usuario y contraseña
async function auth(email, password) {
  let body = { email: email, password: password };
  try {
    const r = await fetch(url + "/login", {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!r.ok) {
      throw new Error("Error en la petición");
    }
    const data = await r.json();
    return data;
  } catch (error) {
    return null;
  }
}

// Hook personalizado para manejar el formulario
const useLoginForm = (setErrorMessage) => {
  const [formData, setFormData] = useState({
    user: "",
    password: "",
    errorEmail: false,
    errorPassword: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setErrorMessage(""); // Limpia el mensaje de error
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
      errorEmail: name === "user" && !value ? true : false,
      errorPassword: name === "password" && !value ? true : false,
    }));
  };

  return [formData, handleChange, setFormData];
};

// Componente reutilizable para los campos de texto
const TextFieldComponent = ({
  label,
  type,
  name,
  error,
  helperText,
  onChange,
}) => (
  <TextField
    className="login-item"
    label={label}
    variant="outlined"
    type={type}
    name={name}
    required
    error={error}
    helperText={helperText}
    onChange={onChange}
  />
);

const Login = ({ setIsLogged }) => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState(""); // Estado para mensaje de error
  const [formData, handleChange, setFormData] = useLoginForm(setErrorMessage);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Evitar la recarga de la página
    let r = await auth(formData.user, formData.password);
    if (r != null) {
      let usuario = await obtenerUsuario(r.token, r.UserId);
      try {
        localStorage.setItem("isLogged", false);
        localStorage.setItem("rol", r.Roles[0].authority);
        localStorage.setItem("token", r.token);
        localStorage.setItem("UserId", r.UserId);
        localStorage.setItem("usuario", usuario.nombre);
        if (usuario.estado === "Activo") {
          localStorage.setItem("isLogged", true);
          setIsLogged(true); // Actualizar estado de autenticación en el componente
          navigate("/dashboard");
        } else {
          navigate("/usuario/inactivo");
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      // Actualizar los estados de error
      setFormData((prevFormData) => ({
        ...prevFormData,
        errorEmail: true,
        errorPassword: true,
      }));
      // Mostrar el mensaje de error
      setErrorMessage("Usuario y/o contraseña incorrectos");
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <img
          src={logo} className="logo"></img>
        <p className="login-item title">
          Sistema Integral de Gestión de Personal y Nómina
        </p>
        <TextFieldComponent
          label="Usuario"
          type="email"
          name="user"
          onChange={handleChange}
        />
        <TextFieldComponent
          label="Contraseña"
          type="password"
          name="password"
          onChange={handleChange}
        />
        {errorMessage && (
          <Typography variant="subtitle1" sx={{ color: "red", textAlign: "center" }}>
            {errorMessage}
          </Typography>
        )}
        <Button className="login-item" variant="contained" type="submit">
          Iniciar Sesión
        </Button>
      </form>
    </div>
  );
};

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

export default Login;
