import React, { useState, useEffect } from 'react';
import Sidebar from "../../Components/Sidebar";
import { Bar, Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';
import dayjs from 'dayjs';
import "dayjs/locale/es";
import url from "../../backUrl";
import { set } from 'date-fns';
import "../../Styles/HistorialAsistencia.css";
import Loading from '../../Components/Loading';
import { useNavigate, useParams } from "react-router-dom";
let rol = localStorage.getItem("rol") == "ROLE_RRHH"; // Validar el rol
import jsPDF from "jspdf";
import "jspdf-autotable";
import html2canvas from "html2canvas";
import {
  Button
} from "@mui/material";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

const Report = () => {
    const [fecha, setFecha] = React.useState(dayjs());  // Para obtener la fecha actual
    const [mes, setMes] = useState(fecha.month() + 1);  // Guardamos el mes actual
    const [mesLetras, setMesLetras] = useState(fecha.locale('es').format('MMMM'));  // Guardamos el mes actual en letras
    const [year, setYear] = useState(fecha.year().toString());  // Guardamos el año actual
    const [extraData, setExtraData] = useState({ diurnas: 0, nocturnas: 0, asueto: 0, diurnasNormales: 0 });
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(true);
    const [anios, setAnios] = useState([]);
    const [displayYear, setDisplayYear] = useState(year);
    const [resultados, setResultado] = useState(false);
    const [nombreEmpleado, setNombreEmpleado] = useState(""); // Nuevo estado para el nombre del empleado

    const userRole = localStorage.getItem("rol");
    const user = localStorage.getItem("UserId");  // Obtenemos el ID del usuario logueado
    const { id } = useParams();
    if (id != null) {
        var userId = id;
    } else {
        var userId = user;
    }

    // Función para obtener las horas extra y trabajadas en asueto
    const fetchHoras = async () => {
        let diurnasVal = 0;
        let nocturnasVal = 0;
        let asuetoVal = 0;
        let diurnasNormalesVal = 0;
        let diurnas = [];
        let nocturnas = [];
        let asueto = [];
        let diurnasNormales = [];

        const token = localStorage.getItem("token");
        const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        };
        try {

            try {
                const resDiurnas = await fetch(`${url}/extras-diurnas/consultar/usuario/${userId}?mes=${mes}&año=${year}`, { headers });
                diurnas = await resDiurnas.json();
                diurnasVal = diurnas.find(registro => registro.mes === mesLetras && registro.año === year)?.cantidad_horas || 0;
                if (diurnas.length > 0) {
                    setExtraData(prevData => ({
                        ...prevData,
                        diurnas: parseFloat(diurnasVal.toFixed(1))
                    }));
                }
            } catch (error) {
            }

            try {
                const resNocturnas = await fetch(`${url}/extras-nocturnas/consultar/usuario/${userId}?mes=${mes}&año=${year}`, { headers });
                nocturnas = await resNocturnas.json();
                nocturnasVal = nocturnas.find(registro => registro.mes === mesLetras && registro.año === year)?.cantidad_horas || 0;
                if (nocturnas.length > 0) {
                    setExtraData(prevData => ({
                        ...prevData,
                        nocturnas: parseFloat(nocturnasVal.toFixed(1))
                    }));
                }
            } catch (error) {
            }

            try {
                const resAsueto = await fetch(`${url}/asuetos-trabajados/consultar/usuario/${userId}?mes=${mes}&año=${year}`, { headers });
                asueto = await resAsueto.json();
                asuetoVal = asueto.find(registro => registro.mes === mesLetras && registro.año === year)?.cantidad_horas || 0;
                if (asueto.length > 0) {
                    setExtraData(prevData => ({
                        ...prevData,
                        asueto: parseFloat(asuetoVal.toFixed(1))
                    }));
                }
            } catch (error) {
            }

            try {
                const resDiurnasNormales = await fetch(`${url}/carga-laboral-diurna/consultar/usuario/${userId}?mes=${mes}&año=${year}`, { headers });
                diurnasNormales = await resDiurnasNormales.json();
                diurnasNormalesVal = diurnasNormales.find(registro => registro.mes === mesLetras && registro.año === year)?.cantidad_horas || 0;
                if (diurnasNormales.length > 0) {
                    setExtraData(prevData => ({
                        ...prevData,
                        diurnasNormales: parseFloat(diurnasNormalesVal.toFixed(1))
                    }));
                }
            } catch (error) {
            }
            const anio = (diurnas.map(registro => registro.año) + "," + nocturnas.map(registro => registro.año) + "," + asueto.map(registro => registro.año) + "," + diurnasNormales.map(registro => registro.año));
            const anioUnico = [...new Set(anio.split(","))].sort();
            setAnios(anioUnico);
            if (diurnasVal === 0 && nocturnasVal === 0 && asuetoVal === 0 && diurnasNormalesVal === 0) {
                setData(false);
            } else {
                setData(true);
            }
            setLoading(false);

            if (diurnas.length === 0 && nocturnas.length === 0 && asueto.length === 0 && diurnasNormales.length === 0) {
                setResultado(false);
            } else {
                setResultado(true);
            }

        } catch (error) {
            console.error("Error al obtener datos:", error);
            setData(false);
            setLoading(false);
            setResultado(false);
        }
    };

    useEffect(() => {
        setLoading(true);
        setDisplayYear(year);
        fetchHoras();
        fetchNombreEmpleado();
    }, [mes, year]);

    // Función para obtener el nombre del empleado
    const fetchNombreEmpleado = async () => {
        const token = localStorage.getItem("token");
        const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        };
    
        try {
            const response = await fetch(`${url}/usuarios/${userId}`, { headers });
            if (!response.ok) {
                throw new Error("No se pudo obtener el nombre del empleado");
            }
    
            const data = await response.json();
            console.log("Respuesta de la API:", data); // Verifica la estructura de la respuesta
            setNombreEmpleado(data.usuario.nombre|| "Nombre no disponible"); // Ajusta según la respuesta
        } catch (error) {
            console.error("Error al obtener nombre del empleado:", error);
            setNombreEmpleado("Nombre no disponible");
        }
    };

    // Configuración del gráfico de pastel
    const pieData = {
        labels: ['Jornada Laboral', 'Extras Diurnas', 'Extras Nocturnas', 'Asueto'],
        datasets: [{
            label: 'Distribución Horas',
            data: [extraData.diurnasNormales, extraData.diurnas, extraData.nocturnas, extraData.asueto],
            backgroundColor: ['#36A2EB', '#FFCE56', '#66BB6A', '#FF6384'],
            hoverOffset: 4
        }]
    };

    // Opciones para los gráficos
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom',
            },
        },
        maintainAspectRatio: false,
    };

    // Función para cambiar el mes desde el selector
    const handleMonthChange = (e) => {
        setMesLetras(dayjs().locale('es').month(e.target.value - 1).format('MMMM'));  // Actualiza el mes en letras
        setMes(e.target.value);  // Actualiza el mes seleccionado
        setDisplayYear(year);  // Actualiza el año seleccionado
    };

    // Función para poner la primera letra en mayúscula
    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    // Función para centrar y generar el PDF
    const generatePDF = async () => {
        if (!nombreEmpleado) {
            console.log("Nombre del empleado no disponible");
            return; // Asegura que el nombre esté disponible
        }

        const pdf = new jsPDF();
        const titleText = `Historial de asistencia ${nombreEmpleado} - ${mesLetras} ${year}`;
        pdf.setFontSize(20);

        // Centrar el título
        const pageWidth = pdf.internal.pageSize.getWidth();
        const textWidth = pdf.getTextWidth(titleText);
        const xPosition = (pageWidth - textWidth) / 2;
        pdf.text(titleText, xPosition, 20);

        // Convertir el gráfico a imagen
        const pieChartElement = document.querySelector(".pie-chart-class");  // Ajusta el selector
        const canvas = await html2canvas(pieChartElement);
        const imgData = canvas.toDataURL("image/png");

        // Centrar la imagen
        const imgWidth = 100;
        const imgHeight = 100;
        const xPositionImage = (pageWidth - imgWidth) / 2;
        pdf.addImage(imgData, "PNG", xPositionImage, 30, imgWidth, imgHeight);

        // Agregar la tabla
        pdf.autoTable({
            startY: 140,
            head: [['Tipo de horas', 'Cantidad (horas)']],
            body: [
                ['Horas Diurnas', `${extraData.diurnas}`],
                ['Horas Nocturnas', `${extraData.nocturnas}`],
                ['Horas en Asueto', `${extraData.asueto}`],
                ['Horas Diurnas Normales', `${extraData.diurnasNormales}`],
            ],
            styles: {
                halign: 'center',
                valign: 'middle',
            },
        });

        // Guardar el archivo con el nombre correcto
        pdf.save(`historial_asistencia_${nombreEmpleado}_${mesLetras}_${year}.pdf`);
    };

    return (
        <>
            <Sidebar />
            <div style={{ textAlign: 'center', margin: '20px' }}>
                <h1>Historial de asistencia - {capitalizeFirstLetter(dayjs().locale('es').month(mes - 1).format('MMMM'))} {displayYear}</h1>
                {resultados ?
                    <div className='filters'>
                        <label>Seleccionar año: </label>
                        <select value={year} onChange={(e) => setYear(e.target.value)}>
                            {anios.map((anio) => (
                                <option key={anio} value={anio}>
                                    {anio}
                                </option>
                            ))}
                        </select>
                        <label>Seleccionar mes: </label>
                        <select value={mes} onChange={handleMonthChange}>
                            {Array.from({ length: 12 }, (_, i) => (
                                <option key={i} value={i + 1}>
                                    {capitalizeFirstLetter(dayjs().locale('es').month(i).format('MMMM'))}  {/* Capitaliza manualmente */}
                                </option>
                            ))}
                        </select>
                    </div>
                    : <></>}
                {loading ?
                    <Loading /> : (
                        <>
                            {data ? (
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'center', margin: '20px' }}>
                                        <div class="pie-chart-class" style={{ width: '40%', margin: '10px' }}>
                                            <Pie data={pieData} options={options} />
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <div style={{ display: 'flex', justifyContent: 'center', margin: '20px' }}>
                                                <div style={{ width: '25vw', margin: '10px' }}>
                                                    <h2>Horas Diurnas</h2>
                                                    <p>{extraData.diurnas} horas</p>
                                                </div>
                                                <div style={{ width: '50%', margin: '10px' }}>
                                                    <h2>Horas Nocturnas</h2>
                                                    <p>{extraData.nocturnas} horas</p>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'center', margin: '20px' }}>
                                                <div style={{ width: '50%', margin: '10px' }}>
                                                    <h2>Horas en asueto</h2>
                                                    <p>{extraData.asueto} horas</p>
                                                </div>
                                                <div style={{ width: '50%', margin: '10px' }}>
                                                    <h2>Horas Diurnas Normales</h2>
                                                    <p>{extraData.diurnasNormales} horas</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {rol ? (
                                        <Button variant="contained" color="primary" onClick={generatePDF}>
                                            Exportar a PDF
                                        </Button>
                                    ) : (
                                        <></>
                                    )}
                                </div>
                            ) : <p>No hay registros</p>}
                        </>
                    )}
            </div>
        </>
    );
};

export default Report;
