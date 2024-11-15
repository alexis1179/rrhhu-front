import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Typography } from "@mui/material";
import { Logout } from "@mui/icons-material";
import "../Styles/Sidebar.css";
import image from "../image/DSI logo 2.png";

export default function Sidebar() {
  let navigate = useNavigate();
  let logged = localStorage.getItem("isLogged") === "true";
  let rrhh = localStorage.getItem("rol") === "ROLE_RRHH";
  let admin = localStorage.getItem("rol") === "ROLE_ADMIN";
  let user = localStorage.getItem("rol") === "ROLE_USER";
  let notEmpleado = localStorage.getItem("rol") !== "ROLE_USER";
  let usuario = localStorage.getItem("usuario");
  let id = localStorage.getItem("UserId");

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const CerrarSesion = () => {
    localStorage.clear();
    navigate("/");
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <>
      <div className="side-section">
        <div className="title-navbar">
          {logged ? (
            <img
              src={image}
              alt="logo"
              className="logo"
              onClick={() => navigate("/dashboard")}
            />
          ) : (
            <img src={image} alt="logo" className="logo" />
          )}
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
                  onClick={() => navigate("/usuarios")}
                  style={{ cursor: "pointer" }}
                >
                  Usuarios
                </Typography>
              ) : null}
              <Typography
                onClick={() => navigate("/asistencia/inicio")}
                style={{ cursor: "pointer" }}
              >
                Asistencia
              </Typography>
              <Typography
                onClick={() =>
                  navigate(`/nomina/visualizarPlanillaUsuario/${id}`)
                }
                style={{ cursor: "pointer" }}
              >
                Nómina
              </Typography>
              {rrhh ? (
                <div className="reportes">
                  <Typography
                    onClick={toggleDropdown}
                    style={{ cursor: "pointer" }}
                  >
                    Reportes
                  </Typography>
                  {dropdownOpen && (
                    <div className="dropdown-content">
                      <Typography
                        onClick={() => navigate("/reportes/asistencia")}
                        style={{ cursor: "pointer" }}
                      >
                        Reporte general de asistencia
                      </Typography>
                      <Typography
                        onClick={() => navigate("/Dashboard")}
                        style={{ cursor: "pointer" }}
                      >
                        Reporte 2
                      </Typography>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
            <div className="user">
              {usuario ? (
                <Typography>Usuario: {usuario}</Typography>
              ) : (
                <Typography>Sin usuario</Typography>
              )}
              <Logout className="logout" onClick={CerrarSesion} />
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}
