import React from "react";
import { useNavigate } from "react-router-dom";
import { Typography } from "@mui/material";
import { Logout } from "@mui/icons-material";
import "../Styles/Sidebar.css";
import image from "../image/DSI logo 2.png";

export default function Sidebar() {
  let navigate = useNavigate();
  let logged = localStorage.getItem("isLogged")==="true";
  let rrhh = localStorage.getItem("rol") == "ROLE_RRHH";
  let admin = localStorage.getItem("rol") == "ROLE_ADMIN";
  let user = localStorage.getItem("rol") == "ROLE_USER";
  let notEmpleado = localStorage.getItem("rol") != "ROLE_USER";
  let usuario = localStorage.getItem("usuario");
  const CerrarSesion = () => {
    localStorage.clear();
    navigate("/");
  };
  return (
    <>
      <div className="side-section">
        <div className="title-navbar">
          <img src={image} alt="logo" className="logo" onClick={() => navigate("/dashboard")} />
        </div>
        {logged ? (
          <div className="options">
            <div className="tabs">
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
            <div className="user">
              {usuario ? <Typography>Usuario: {usuario}</Typography> :
                <Typography>Sin usuario</Typography>}
              <Logout className="logout" onClick={CerrarSesion} />
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
    </>
  );
}
