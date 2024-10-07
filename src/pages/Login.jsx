import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/Login.css";
import { Button, TextField } from "@mui/material";
import url from "../backUrl";

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
    console.log(error);
    return null;
  }
}

// Hook personalizado para manejar el formulario
const useLoginForm = () => {
  const [formData, setFormData] = useState({
    user: "",
    password: "",
    errorEmail: false,
    errorPassword: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
      errorEmail: name === "user" ? !value : prevFormData.errorEmail,
      errorPassword: name === "password" ? !value : prevFormData.errorPassword,
    }));
  };
  return [formData, handleChange];
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

const Login = () => {
  const navigate = useNavigate();
  const [user, serUser] = useState();
  const [password, setPassword] = useState();
  const [formData, handleChange] = useLoginForm();

  const handleSubmit = async () => {
    let r = await auth(formData.user, formData.password);
    let usuario = await obtenerUsuario(r.token, r.UserId);
    let usuarios = await obtenerUsuarios(r.token);
    if (r.Message === "Autenticacion Correcta") {
      localStorage.setItem("isLogged", true);
      localStorage.setItem("rol", r.Roles[0].authority);
      localStorage.setItem("token", r.token);
      localStorage.setItem("UserId", r.UserId);
      localStorage.setItem("usuario", usuario.nombre);
      if (usuarios.find(usuario => usuario.id === r.UserId)) {
      navigate("/dashboard");}
      else{
        console.log("Usuario inactivo");
      }
    } else {
      console.log("Error de autenticación");
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <p className="login-item">
          Sistema Integral de Gestión de Personal y Nómina
        </p>
        <TextFieldComponent
          label="Usuario"
          type="email"
          name="user"
          error={formData.errorEmail}
          helperText={formData.errorEmail ? "Usuario inválido" : ""}
          onChange={handleChange}
        />
        <TextFieldComponent
          label="Contraseña"
          type="password"
          name="password"
          error={formData.errorPassword}
          helperText={formData.errorPassword ? "Contraseña inválida" : ""}
          onChange={handleChange}
        />
        <Button
          className="login-item"
          variant="contained"
          onClick={handleSubmit}
        >
          Iniciar Sesión
        </Button>
      </div>
    </div>
  );
};

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

async function obtenerUsuarios(token) {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", "Bearer " + token);
  const response = await fetch(url + "/usuarios", {
    method: 'GET',
    headers: myHeaders
  })
  const data = await response.json();
  const usuarios = data.filter(usuario => usuario.estado == "Activo");
  return usuarios;
}

export default Login;