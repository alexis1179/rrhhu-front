import * as React from "react";
import Sidebar from "../../Components/Sidebar";

import dayjs from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import "../../Styles/SolicitarDiasLibres.css";
import { Button, Grid, DemoItem, Typography } from "@mui/material";
const tomorrow = dayjs().add(1, "day");

export default function SolicitarDiasLibres() {
  return (
    <>
      <Sidebar />
      <div className="contenido">
        <div className="form">
          <Typography variant="h3"> Solicitud de días libres</Typography>
          <Grid container className="input" spacing={2}>
            <Grid item size xs={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={["DatePicker"]}>
                  <DemoItem label="Fecha de inicio">
                    <DatePicker
                      defaultValue={tomorrow}
                      disablePast
					  minDate={tomorrow}
                      views={["year", "month", "day"]}
                    />
                  </DemoItem>
                </DemoContainer>
              </LocalizationProvider>
            </Grid>
          </Grid>

          <div className="buttons">
            <Button variant="contained" color="success" size="large">
              Guardar
            </Button>
            <Button variant="contained" color="error" size="large">
              Cancelar
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
