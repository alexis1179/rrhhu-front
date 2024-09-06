import React from "react";
import { useNavigate } from "react-router-dom";
import { Icon, Typography } from "@mui/material";
import { ManageAccounts, AssignmentTurnedIn, RequestQuote, Assessment, Logout } from "@mui/icons-material";
import '../Styles/Dashboard.css';

export default function Sidebar() {

    let navigate = useNavigate();

    return <>
        <div className="side-section-title">
            <Typography
                variant="h5"
                align="center"
            >Importaciones E y V</Typography>
        </div>
        <div>
            <div className="side-section-option" onClick={()=>navigate('/gestionar-usuarios')}>
                <ManageAccounts fontSize="large"/>
                <Typography
                    variant="h6"
                >Gestionar usuarios</Typography>
            </div>
            <div className="side-section-option">
                <AssignmentTurnedIn fontSize="large"/>
                <Typography
                    variant="h6"
                >Asistencia</Typography>
            </div>
            <div className="side-section-option">
                <RequestQuote fontSize="large"/>
                <Typography
                    variant="h6"
                >Nómina</Typography>
            </div>
            <div className="side-section-option">
                <Assessment fontSize="large"/>
                <Typography
                    variant="h6"
                >Reportes</Typography>
            </div>
        </div>
        <div className="side-section-logout"
            onClick={()=>navigate('/login')}>
            <Logout fontSize="medium"/>
            <Typography
                variant="subtitle1">
                Cerrar sesión
            </Typography>
        </div>
    </>
}
