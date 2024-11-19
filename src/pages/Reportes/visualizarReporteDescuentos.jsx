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
import jsPDF from "jspdf";
import "jspdf-autotable";
import html2canvas from "html2canvas";
import {
  Button
} from "@mui/material";

// Registrar los componentes de Chart.js para que se puedan usar en los gráficos
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

const VisualizarReporteDescuentos = () => {
    // Definición de estados iniciales
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
    const [usuarios, setUsuario] = useState([]);
    const [isss, setIsss] = useState();
    const [afp, setAfp] = useState();
    const [renta, setRenta] = useState();

    // Obtener el ID del usuario de la URL o del localStorage
    const user = localStorage.getItem("UserId");  // Obtenemos el ID del usuario logueado
    const { id } = useParams();
    if (id != null) {
        var userId = id;
    } else {
        var userId = user;
    }

    // Función para obtener los datos de los usuarios
    const obtenerUsuarios = async () => {
        const idOcultos = [1, 2, 3];
        var usuarios;
        var usuariosFiltrados;
        try {
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));
            const response = await fetch(url + "/usuarios", {
                method: "GET",
                headers: myHeaders,
            });
            usuarios = await response.json();
            setUsuario(usuarios.filter((usuario) => !idOcultos.includes(usuario.id)));
            usuariosFiltrados = usuarios.filter((usuario) => !idOcultos.includes(usuario.id));
        } catch (error) {
            console.log(error);
        }

        // Si no hay usuarios, actualizamos los estados
        if (usuariosFiltrados.length === 0) {
            setData(false);
            setLoading(false);
            return;
        }
        const totalRenta = usuariosFiltrados.flatMap(usuario => usuario.planillaEmpleado || [])
            .filter(planilla => planilla.mes === mesLetras && planilla.anio === year)
            .reduce((suma, planilla) => suma + (planilla.descuentoRenta || 0), 0);

        const totalIsss = usuariosFiltrados.flatMap(usuario => usuario.planillaEmpleado || [])
            .filter(planilla => planilla.mes === mesLetras && planilla.anio === year)
            .reduce((suma, planilla) => suma + (planilla.descuentoIsss || 0), 0);

        const totalAfp = usuariosFiltrados.flatMap(usuario => usuario.planillaEmpleado || [])
            .filter(planilla => planilla.mes === mesLetras && planilla.anio === year)
            .reduce((suma, planilla) => suma + (planilla.descuetoAfp || 0), 0);

        const aniosUnicos = Array.from(
            new Set(
                usuarios.flatMap(usuario => usuario.planillaEmpleado || [])
                    .map(planilla => planilla.anio)
            )
        ).sort();
        setAnios(aniosUnicos);

        if (totalRenta === 0 && totalIsss === 0 && totalAfp === 0) {
            setData(false);
            setLoading(false);
            return;
        }
        setData(true);
        setResultado(true);
        setRenta(parseFloat(totalRenta.toFixed(2)));
        setIsss(parseFloat(totalIsss.toFixed(2)));
        setAfp(parseFloat(totalAfp.toFixed(2)));
        setLoading(false);
    }

    // Efecto para cargar los datos al montar el componente o cambiar mes/año
    useEffect(() => {
        setLoading(true);
        setDisplayYear(year);
        console.log(mesLetras, year);
        obtenerUsuarios();
    }, [mes, year]);

    // Configuración del gráfico de pastel
    const pieData = {
        labels: ['Renta', 'ISSS', 'AFP'],
        datasets: [{
            label: 'Distribución Horas',
            data: [renta, isss, afp],
            backgroundColor: ['#36A2EB', '#FFCE56', '#66BB6A'],
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

    // Función para exportar la gráfica y datos a un archivo PDF
    const exportToPDF = async () => {
        const pdf = new jsPDF();
    
        // Configurar el título y centrarlo
        const titleText = `Reporte de descuentos - ${capitalizeFirstLetter(
            dayjs()
                .locale("es")
                .month(mes - 1)
                .format("MMMM")
        )} ${displayYear}`;
        pdf.setFontSize(20);

        // Obtener el ancho del texto
        const pageWidth = pdf.internal.pageSize.getWidth();
        const textWidth = pdf.getTextWidth(titleText);

        // Calcular la posición 'x' para centrar el texto
        const xPosition = (pageWidth - textWidth) / 2;

        // Agregar el título centrado
        pdf.text(titleText, xPosition, 20); // '20' es la posición vertical del título
    
        // Convertir gráfico a imagen y agregarlo al PDF
        const pieChartElement = document.getElementById("pie-chart");
        if (pieChartElement) {
            const canvas = await html2canvas(pieChartElement);
            const imgData = canvas.toDataURL("image/png");
            const imgWidth = 175;
            const imgHeight = 100;
            const xPosition = (pdf.internal.pageSize.getWidth() - imgWidth) / 2; // Centrado horizontal del gráfico
    
            // Verificar que se generó correctamente y agregar imagen debajo del título
            if (imgData) {
                pdf.addImage(imgData, "PNG", xPosition, 30, imgWidth, imgHeight);
            } else {
                console.error("Error al generar la imagen del gráfico.");
            }
        } else {
            console.error("El gráfico no se encuentra en el DOM.");
        }
    
        // Agregar tabla de datos después del gráfico
        pdf.autoTable({
            startY: 140, // Ajuste de la posición vertical para la tabla debajo del gráfico
            head: [['Descuento', 'Monto']],
            body: [
                ['Renta', `$${renta}`],
                ['ISSS', `$${isss}`],
                ['AFP', `$${afp}`],
            ],
            styles: {
                halign: 'center', // Alinea el texto horizontalmente al centro
                valign: 'middle', // Alinea el texto verticalmente al centro
            },
        });
    
        // Guardar el archivo PDF
        pdf.save(`reporte_descuentos_${mesLetras}_${year}.pdf`);
    };

    return (
        <>
            <Sidebar />
            <div style={{ textAlign: 'center', margin: '20px' }}>
                <h1>Reporte de descuentos - {capitalizeFirstLetter(dayjs().locale('es').month(mes - 1).format('MMMM'))} {displayYear}</h1>
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
                                        <div id="pie-chart" style={{ width: '40%', margin: '10px' }}>
                                            <Pie data={pieData} options={options} />
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <div style={{ display: 'flex', justifyContent: 'center', margin: '20px' }}>
                                                <div style={{ width: '25vw', margin: '10px' }}>
                                                    <h2>Renta</h2>
                                                    <p>${renta}</p>
                                                </div>
                                                <div style={{ width: '50%', margin: '10px' }}>
                                                    <h2>ISSS</h2>
                                                    <p>${isss}</p>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'center', margin: '20px' }}>
                                                <div style={{ width: '50%', margin: '10px' }}>
                                                    <h2>AFP</h2>
                                                    <p>${afp}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "center", margin: "10px 0"}}>
                                        <Button variant="contained" color="primary" onClick={exportToPDF}>
                                            Exportar a PDF
                                        </Button>
                                    </div>
                                </div>
                        ) : <p>No hay registros</p>}
                        </>
                    )}
            </div>
        </>
    );
};



export default VisualizarReporteDescuentos;

