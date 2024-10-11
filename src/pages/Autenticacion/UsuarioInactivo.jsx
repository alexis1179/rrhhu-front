import React from "react";
import Sidebar from "../../Components/Sidebar";
import { useNavigate } from "react-router-dom";

import "../../Styles/UsuarioInactivo.css";
import { Button, Typography } from "@mui/material";

export default function UsuarioInactivo() {
    const navigate = useNavigate();
    return (
        <div>
            <Sidebar />
            <div className="contenido">
                <div className="page-title">
                    <Typography variant="h2">Usuario Inactivo</Typography>
                    <Typography variant="h5">
                        El usuario no se encuentra activo en el sistema
                    </Typography>
                </div>
                <Button onClick={() => navigate("/")} variant="contained">
                    Regresar
                </Button>
            </div>
        </div>
    )
}
