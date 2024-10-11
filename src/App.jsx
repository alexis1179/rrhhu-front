import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Autenticacion/Login";
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
import HistorialAsistencia from "./pages/Asistencia/HistorialAsistencia.jsx";
import UsuarioInactivo from "./pages/Autenticacion/UsuarioInactivo";

const App = () => {
  const [isLogged, setIsLogged] = useState(false);
  const [loading, setLoading] = useState(true);

  // Verificar el estado de autenticación al cargar la aplicación
  useEffect(() => {
    const loggedIn = localStorage.getItem("isLogged") === "true";
    setIsLogged(loggedIn);
    setLoading(false);
  }, []);

  return (
    <BrowserRouter>
      {!loading && (
        <Routes>
          <Route path="/" element={<Login setIsLogged={setIsLogged} />} />
          <Route path="/usuario/inactivo" element={<UsuarioInactivo />} />
          <Route element={<RequireAuth isLogged={isLogged} />}>
            <Route path="/dashboard" element={<Dashboard />} />
            {/* CRUD Usuarios */}
            <Route path="/usuarios" element={<GestionarUsuarios />} />
            <Route path="/usuario/registrar" element={<RegistrarUsuario />} />
            <Route path="/asistencia" element={<PantallaInicioAsistencia />} />
            <Route path="/solicitudes" element={<GestionarSolicitudes />} />
            <Route path="/solicitud" element={<ResponderSolicitudes />} />
            <Route path="/usuario/:id" element={<VisualizarUsuario />} />
            {/* Asistencia */}
            <Route path="/asistencia/inicio" element={<PantallaInicioAsistencia />} />
            <Route path="/asistencia/registrar" element={<RegistroHorarioLaboral />} />
            <Route path="/asistencia/historial" element={<HistorialAsistencia />} />
            {/* Solicitudes dias libres */}
            <Route path="/libres/solicitar" element={<SolicitarDiasLibres />} />
            <Route path="/solicitud/responder/:idUser/:idSolicitud" element={<ResponderSolicitudes />} />
          </Route>
        </Routes>
      )}
    </BrowserRouter>
  );
};

export default App;
