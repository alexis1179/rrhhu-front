import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import GestionarUsuarios from "./pages/Usuarios/GestionarUsuarios";
import RegistrarUsuario from "./pages/Usuarios/RegistrarUsuario";
import RequireAuth from "./pages/Autenticacion/RequireAuth";
import PantallaInicioAsistencia from "./pages/Asistencia/PantallaInicioAsistencia";
import GestionarSolicitudes from "./pages/Asistencia/GestionarSolicitudes";

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
          <Route path="/gestionar-usuarios" element={<GestionarUsuarios />} />
          <Route path="/registrar-usuario" element={<RegistrarUsuario />} />
          <Route path="/registrar-usuario" element={<RegistrarUsuario />} />
          <Route path="/asistencia" element={<PantallaInicioAsistencia />} />
          <Route path="/solicitudes" element={<GestionarSolicitudes /> } />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
