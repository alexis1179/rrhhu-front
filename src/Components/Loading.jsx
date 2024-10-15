import React from "react";
import { CircularProgress } from "@mui/material";
import "../Styles/Loading.css";

export default function Loading() {

    return (
        <div className="loading">
            <h3>Cargando...</h3>
            <CircularProgress />
        </div>
    );
}
