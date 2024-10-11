import React from "react";
import { CircularProgress } from "@mui/material";
import "../Styles/Loading.css";

export default function Loading() {

    return (
        <div className="loading">
            <h1>Cargando...</h1>
            <CircularProgress />
        </div>
    );
}
