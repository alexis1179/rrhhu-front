import React from "react";
import { Grid, Icon, Typography } from "@mui/material";
import { InfoRounded, ConnectWithoutContact, CarRental } from "@mui/icons-material";
import '../Styles/Dashboard.css';
import Sidebar from "../Components/Sidebar";
import InfoCard from "../Components/InfoCard";

export default function Dashboard() {

    return <>
        <div className="dashboard">
            <Sidebar/>
            <div className="menu">
                <Grid container spacing={3}>
                    <Grid item xs={12} >
                        <div className="dashboard-title">
                        <Typography
                            variant="h5"
                            align="center"
                        >¡Te damos la bienvenida al Sistema Integral de Gestión de Personal y Nómina!</Typography>
                        </div>
                    </Grid>
                    <Grid item xs={4}>
                        <InfoCard title="Sobre Nosotros" description="CoAgro nació en 1985 en medio de un contexto adverso, cuando un grupo de 
pequeños agricultores de zonas rurales en San Salvador decidió unirse para hacer frente 
a las difíciles condiciones generadas por la guerra civil salvadoreña"/>
                    </Grid>
                    <Grid item xs={4}>
                        <InfoCard title="Nuestro Compromiso" description="Contribuir al desarrollo integral de nuestros asociados mediante una agricultura 
sostenible, inclusiva y orientada al comercio justo, generando bienestar económico, 
social y ambiental para nuestras comunidades."/>
                    </Grid>
                    <Grid item xs={4}>
                        <InfoCard title="Nuestra Visión" description="Ser una cooperativa agrícola líder en El Salvador, reconocida por su compromiso 
con la calidad, la sostenibilidad y el impacto positivo en el entorno rural, tanto a nivel 
nacional como internacional."/>
                    </Grid>
                </Grid>
            </div>
        </div>
    </>
}
