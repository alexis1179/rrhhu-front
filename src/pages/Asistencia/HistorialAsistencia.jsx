import React, { useState, useEffect } from 'react'; 
import Sidebar from "../../Components/Sidebar";
import { Bar, Pie } from 'react-chartjs-2';
import dayjs from 'dayjs';
import "dayjs/locale/es";
import url from "../../backUrl"; 
import { set } from 'date-fns';

const Report = () => {
    const [fecha, setFecha] = React.useState(dayjs());  // Para obtener la fecha actual
    const [mes, setMes] = useState(fecha.month() + 1);  // Guardamos el mes actual
    const [year, setYear] = useState(fecha.year());  // Guardamos el año actual
    const [extraData, setExtraData] = useState({ diurnas: 0, nocturnas: 0, asueto: 0, diurnasNormales: 0 });
    const [loading, setLoading] = useState(true);

    const userId = localStorage.getItem("UserId");  // Obtenemos el ID del usuario logueado

    // Función para obtener las horas extra y trabajadas en asueto
    const fetchHoras = async () => {
        try {
            const token = localStorage.getItem("token");

            const headers = {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            };

            const resDiurnas = await fetch(`${url}/extras-diurnas/consultar/usuario/${userId}?mes=${mes}&año=${year}`, { headers });
            const diurnas = await resDiurnas.json();
            console.log(fecha.locale('es').format('MMMM'));
            console.log(diurnas);           

            const resNocturnas = await fetch(`${url}/extras-nocturnas/consultar/usuario/${userId}?mes=${mes}&año=${year}`, { headers });
            const nocturnas = await resNocturnas.json();      
            console.log(nocturnas);

            const resAsueto = await fetch(`${url}/asuetos-trabajados/consultar/usuario/${userId}?mes=${mes}&año=${year}`, { headers });
            const asueto = await resAsueto.json();  
            console.log(asueto);          

            const resDiurnasNormales = await fetch(`${url}/carga-laboral-diurna/consultar/usuario/${userId}?mes=${mes}&año=${year}`, { headers });
            const diurnasNormales = await resDiurnasNormales.json();
            console.log(diurnasNormales);
            try{
                setExtraData({diurnas: diurnas.filter(registro=>registro.mes==fecha.locale('es').format('MMMM'))[0].cantidad_horas})
            }
            catch{

            }
    

            /* setExtraData({
                diurnas: diurnas.filter(registro=>registro.mes==fecha.locale('es').format('MMMM'))[0].cantidad_horas ,
                nocturnas: nocturnas.filter(registro=>registro.mes==fecha.locale('es').format('MMMM'))[0].cantidad_horas ,
                asueto: asueto.filter(registro=>registro.mes==fecha.locale('es').format('MMMM'))[0].cantidad_horas ,
                diurnasNormales: diurnasNormales.filter(registro=>registro.mes==fecha.locale('es').format('MMMM'))[0].cantidad_horas
            }); */

            setLoading(false);
        } catch (error) {
            console.error("Error al obtener datos:", error);
        }
    };

    useEffect(() => {
        fetchHoras();
    }, [mes, year]);  // Actualiza cada vez que el mes o año cambian

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
                    <h1>Historial de asistencia - {capitalizeFirstLetter(fecha.locale('es').format('MMMM'))} {fecha.year()}</h1>
    
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

                        </>
                    )}
                </div>
            </>
        );
    };
    
    export default Report;
    