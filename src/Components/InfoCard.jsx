import React from "react";
import { Icon, Typography } from "@mui/material";
import { InfoRounded, ConnectWithoutContact, CarRental } from "@mui/icons-material";
import '../Styles/Dashboard.css';

export default function InfoCard(props) {
    return <>
        <div className="dashboard-content">
            <div className="card-title">
                <Typography variant="h6">{props.title}</Typography>
            </div>
            <div className="card-content">
                <Typography variant="subtitle1">{props.description}</Typography>
            </div>
        </div>
    </>
}