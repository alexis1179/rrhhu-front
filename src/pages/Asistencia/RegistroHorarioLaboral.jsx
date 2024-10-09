import React, { useEffect, useState } from "react";
import Sidebar from "../../Components/Sidebar";
import { useNavigate } from "react-router-dom";
import { Button, Grid, Typography, Box } from "@mui/material";
import url from "../../backUrl";

export default function ResponderSolicitudes() {
  const navigate = useNavigate();

  return (
    <>
      <Sidebar> </Sidebar>
      <div className="contenido">
        <div className="form">
          <Typography> Registrar</Typography>
        </div>
      </div>
    </>
  );
}
