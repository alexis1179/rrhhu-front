import React, { useEffect, useState } from "react";
import Sidebar from "../../Components/Sidebar";
import { useNavigate } from "react-router-dom";
import url from "../../backUrl";

export default function ResponderSolicitudes() {
  const navigate = useNavigate();

  return (
    <>
      <Sidebar></Sidebar>
    </>
  );
}
