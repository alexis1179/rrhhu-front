import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Icon, Typography } from "@mui/material";
import { ManageAccounts, AssignmentTurnedIn, RequestQuote, Assessment, Logout } from "@mui/icons-material";
import '../Styles/Sidebar.css';
import image from "../image/DSI logo 2.png"

export default function Sidebar() {

    let navigate = useNavigate();

    const CerrarSesion = () => {
        console.log("logout");
        localStorage.clear();
        navigate("/");
    }

    return <>
        <div className="side-section">
            <div className="contenido">
                <div className="title">
                    <Box
                        component="img"
                        sx={{
                            width: "100%",
                            height: "75%",
                            cursor: "pointer",
                            margin: 0,
                            padding: 0
                        }}
                        src={image}
                        alt="logo empresa"
                        onClick={() => navigate("/dashboard")}
                    />
                </div>
                <div className="options">
                    <div className="option" onClick={() => navigate('/gestionar-usuarios')}>
                        <ManageAccounts fontSize="large" />
                        <Typography variant="h6">Gestionar usuarios</Typography>
                    </div>
                    <div className="option">
                        <AssignmentTurnedIn fontSize="large" />
                        <Typography variant="h6">Asistencia</Typography>
                    </div>
                    <div className="option">
                        <RequestQuote fontSize="large" />
                        <Typography variant="h6">Nómina</Typography>
                    </div>
                    <div className="option">
                        <Assessment fontSize="large" />
                        <Typography variant="h6">Reportes</Typography>
                    </div>
                </div>
                <div className="logout" onClick={CerrarSesion}>
                    <Logout fontSize="medium" />
                    
                </div>
            </div>
        </div>
    </>
}
