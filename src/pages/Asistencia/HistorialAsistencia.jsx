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
    const [year, setYear] = useState(fecha.year());  // Guardamos el año actual
    const [extraData, setExtraData] = useState({ diurnas: 0, nocturnas: 0, asueto: 0, diurnasNormales: 0 });
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(true);

    const userId = localStorage.getItem("UserId");  // Obtenemos el ID del usuario logueado

    // Función para obtener las horas extra y trabajadas en asueto
    const fetchHoras = async () => {
        try {
            const token = localStorage.getItem("token");
            const headers = {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            };
            const [resDiurnas, resNocturnas, resAsueto, resDiurnasNormales] = await Promise.all([
                fetch(`${url}/extras-diurnas/consultar/usuario/${userId}?mes=${mes}&año=${year}`, { headers }),
                fetch(`${url}/extras-nocturnas/consultar/usuario/${userId}?mes=${mes}&año=${year}`, { headers }),
                fetch(`${url}/asuetos-trabajados/consultar/usuario/${userId}?mes=${mes}&año=${year}`, { headers }),
                fetch(`${url}/carga-laboral-diurna/consultar/usuario/${userId}?mes=${mes}&año=${year}`, { headers })
            ]);
            //Todos los registros
            const diurnas = await resDiurnas.json();
            console.log(diurnas);
            //Registro filtrado del mes elegido
            const diurnasData = diurnas.find(registro => registro.mes === mesLetras)?.cantidad_horas || 0;
            const nocturnas = await resNocturnas.json();
            const nocturasData = nocturnas.find(registro => registro.mes === mesLetras)?.cantidad_horas || 0;
            const asueto = await resAsueto.json();
            const asuetoData = asueto.find(registro => registro.mes === mesLetras)?.cantidad_horas || 0;
            const diurnasNormales = await resDiurnasNormales.json();
            const diurnasNormalesData = diurnasNormales.find(registro => registro.mes === mesLetras)?.cantidad_horas || 0;
            //Verificar si hay registros para actualizarlos en el extraData
            if (diurnas.length > 0) {
                setExtraData(prevData => ({
                    ...prevData,
                    diurnas: diurnasData
                }));
            }

            if (nocturnas.length > 0) {
                setExtraData(prevData => ({
                    ...prevData,
                    nocturnas: nocturasData
                }));
            }

            if (asueto.length > 0) {
                setExtraData(prevData => ({
                    ...prevData,
                    asueto: asuetoData
                }));
            }

            if (diurnasNormales.length > 0) {
                setExtraData(prevData => ({
                    ...prevData,
                    diurnasNormales: diurnasNormalesData
                }));
            }
            
            //Verificar si hay datos para mostrar
            if (diurnasData === 0 && nocturasData === 0 && asuetoData === 0 && diurnasNormalesData === 0) {
                setData(false);
            }else{
                setData(true);
            }
            
            setLoading(false);
        } catch (error) {
            console.error("Error al obtener datos:", error);
        }
    };

    useEffect(() => {
        setLoading(true);
        fetchHoras();
    }, [mes]);  // Actualiza cada vez que el mes o año cambian

    // Configuración del gráfico de barras
    const barData = {
        labels: ['Horas Diurnas', 'Horas Nocturnas', 'Horas Asueto'],
        datasets: [{
            label: 'Horas en el mes',
            data: [extraData.diurnas, extraData.nocturnas, extraData.asueto],
            backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726'],
        }]
    };

    // Configuración del gráfico de pastel
    const pieData = {
        labels: ['Horas Asueto', 'Horas Diurnas Normales'],
        datasets: [{
            label: 'Distribución Horas',
            data: [extraData.asueto, extraData.diurnasNormales],
            backgroundColor: ['#FF6384', '#36A2EB'],
            hoverOffset: 4
        }]
    };

    // Opciones para los gráficos
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'right',
            },
        },
    };

    // Función para cambiar el mes desde el selector
    const handleMonthChange = (e) => {
        setMesLetras(dayjs().locale('es').month(e.target.value - 1).format('MMMM'));  // Actualiza el mes en letras
        setMes(e.target.value);  // Actualiza el mes seleccionado
    };

    // Función para poner la primera letra en mayúscula
    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    return (
        <>
            <Sidebar />
            <div style={{ textAlign: 'center', margin: '20px' }}>
                <h1>Historial de asistencia - {capitalizeFirstLetter(dayjs().locale('es').month(mes - 1).format('MMMM'))}</h1>
                <label>Seleccionar mes: </label>
                <select value={mes} onChange={handleMonthChange}>
                    {Array.from({ length: 12 }, (_, i) => (
                        <option key={i} value={i + 1}>
                            {capitalizeFirstLetter(dayjs().locale('es').month(i).format('MMMM'))}  {/* Capitaliza manualmente */}
                        </option>
                    ))}
                </select>

                {loading ? <p>Cargando datos...</p> : (
                    <>
                        {data ? (
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'center', margin: '20px' }}>
                                    <div style={{ width: '50%', margin: '10px' }}>
                                        <h2>Horas extra</h2>
                                        <Bar data={barData} options={options} />
                                    </div>
                                    <div style={{ width: '50%', margin: '10px' }}>
                                        <h2>Horas en asueto</h2>
                                        <Pie data={pieData} options={options} />
                                    </div>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'center', margin: '20px' }}>
                                    <div style={{ width: '50%', margin: '10px' }}>
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
                        ) : <p>No hay datos para mostrar</p>}
                    </>
                )}
            </div>
        </>
    );
};

export default Report;
