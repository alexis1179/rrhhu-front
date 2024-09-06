import React from "react";
import { Grid, Icon, Typography } from "@mui/material";
import { InfoRounded, ConnectWithoutContact, CarRental } from "@mui/icons-material";
import '../Styles/Dashboard.css';
import Sidebar from "../Components/Sidebar";
import InfoCard from "../Components/InfoCard";

export default function Dashboard() {

    return <>
        <div className="dashboard">
            <section className="side-section">
                <Sidebar />
            </section>
            <div className="menu">
                <Grid container>
                    <Grid item xs={12} >
                        <div className="dashboard-title">
                        <Typography
                            variant="h5"
                            align="center"
                        >¡Te damos la bienvenida al Sistema Integral de Gestión de Personal y Nómina!</Typography>
                        </div>
                    </Grid>
                    <Grid item xs={4}>
                        <InfoCard title="Sobre Nosotros" description="Somos una empresa fundada en 2014 por Ervin Domínguez, dedicada a la importación y venta de vehículos automotores. Ofrecemos vehículos usados en excelente estado y a precios competitivos, importados desde Estados Unidos y Corea."/>
                    </Grid>
                    <Grid item xs={4}>
                        <InfoCard title="Nuestro Compromiso" description="Ofrecer vehículos accesibles y de calidad. Beneficiar a los salvadoreños. Generar empleos indirectos en el sector de grúas y talleres."/>
                    </Grid>
                    <Grid item xs={4}>
                        <InfoCard title="Modalidades de Venta" description="Por encargo: Pago inicial en el exterior, pago complementario al recibir en aduana. Inversiones Propias: Compras financiadas, venta en aduana anunciada previamente en redes sociales."/>
                    </Grid>
                </Grid>
            </div>
        </div>
    </>
}
