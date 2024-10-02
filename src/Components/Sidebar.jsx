import React from "react";
import { useNavigate } from "react-router-dom";
import { Typography } from "@mui/material";
import { Logout } from "@mui/icons-material";
import "../Styles/Sidebar.css";
import image from "../image/DSI logo 2.png";

export default function Sidebar() {
  let navigate = useNavigate();
  let rol = true;
  let rrhh = localStorage.getItem("rol") == "ROLE_RRHH";
  let admin = localStorage.getItem("rol") == "ROLE_ADMIN";
  let user = localStorage.getItem("rol") == "ROLE_USER";
  let notEmpleado = localStorage.getItem("rol") != "ROLE_USER";
  let usuario = localStorage.getItem("usuario");
  console.log(usuario);
  const CerrarSesion = () => {
    console.log("logout");
    localStorage.clear();
    navigate("/");
  };
  return (
    <>
      <div className="side-section">
        <div className="title-navbar">
          <img src={image} alt="logo" className="logo" />
          {usuario ? (
            <Typography variant="h6">{usuario.nombre}</Typography>
          ) : (
            <Typography variant="h6">Usuario</Typography>
          )}

          <Logout className="logout" onClick={CerrarSesion} />
        </div>
        {rol ? (
          <div className="options">
            <Typography
              onClick={() => navigate("/dashboard")}
              style={{ cursor: "pointer" }}
            >
              Inicio
            </Typography>
            {notEmpleado ? (
              <Typography
                onClick={() => navigate("/gestionar-usuarios")}
                style={{ cursor: "pointer" }}
              >
                Usuarios
              </Typography>
            ) : (
              <></>
            )}

            <Typography
              onClick={() => navigate("/inicio-asistencia")}
              style={{ cursor: "pointer" }}
            >
              Asistencia
            </Typography>
            {admin ? <Typography>Nómina</Typography> : <></>}
            {admin ? <Typography>Reportes</Typography> : <></>}
          </div>
        ) : (
          <></>
        )}
      </div>
    </>
  );
}
