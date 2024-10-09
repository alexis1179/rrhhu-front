import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import GestionarUsuarios from "./pages/Usuarios/GestionarUsuarios";
import RegistrarUsuario from "./pages/Usuarios/RegistrarUsuario";
import RequireAuth from "./pages/Autenticacion/RequireAuth";
import PantallaInicioAsistencia from "./pages/Asistencia/PantallaInicioAsistencia";
import GestionarSolicitudes from "./pages/Asistencia/GestionarSolicitudes";
import SolicitarDiasLibres from "./pages/Asistencia/SolicitarDiasLibres";
import ResponderSolicitudes from "./pages/Asistencia/ResponderSolicitudes";
import RegistroHorarioLaboral from "./pages/Asistencia/RegistroHorarioLaboral";
import VisualizarUsuario from "./pages/Usuarios/VisualizarUsuario";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          element={
            <RequireAuth
              isLogged={localStorage.getItem("isLogged") === "true"}
            />
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          {/*CRUD Usuarios*/}
          <Route path="/gestionar-usuarios" element={<GestionarUsuarios />} />
          <Route path="/registrar-usuario" element={<RegistrarUsuario />} />
          <Route path="/usuarios/:id" element={<VisualizarUsuario />} />
          
          {/*Asistencia*/}
          <Route
            path="/inicio-asistencia"
            element={<PantallaInicioAsistencia />}
          />
          <Route
            path="/registrar-asistencia"
            element={<RegistroHorarioLaboral />}
          />

          {/*Solicitudes dias libres*/}
          <Route path="/solicitudes" element={<GestionarSolicitudes />} />
          <Route
            path="/solicitar-dias-libres"
            element={<SolicitarDiasLibres />}
          />
          <Route
            path="/responder-solicitud/:idUser/:idSolicitud"
            element={<ResponderSolicitudes />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
