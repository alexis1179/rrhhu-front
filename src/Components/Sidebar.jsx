import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Grid, Icon, Typography } from "@mui/material";
import {
  ManageAccounts,
  AssignmentTurnedIn,
  RequestQuote,
  Assessment,
  Logout,
} from "@mui/icons-material";
import "../Styles/Sidebar.css";
import image from "../image/DSI logo 2.png";

export default function Sidebar() {
  let navigate = useNavigate();
  let rol =
    localStorage.getItem("rol") == "ROLE_ADMIN" ||
    localStorage.getItem("rol") == "rrhh";
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
            <Typography
              onClick={() => navigate("/gestionar-usuarios")}
              style={{ cursor: "pointer" }}
            >
              Usuarios
            </Typography>
            <Typography
              onClick={() => navigate("/asistencia")}
              style={{ cursor: "pointer" }}
            >
              Asistencia
            </Typography>
            <Typography>Nómina</Typography>
            <Typography>Reportes</Typography>
          </div>
        ) : (
          <></>
        )}
      </div>
    </>
  );
}
