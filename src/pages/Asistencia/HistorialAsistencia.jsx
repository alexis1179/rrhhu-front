import React from 'react';
import Sidebar from "../../Components/Sidebar";
import { Pie, Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const Report = () => {
    // Datos del gráfico de pastel
    const pieData = {
        labels: ['Días trabajados 2024', 'Días libres 2024'],
        datasets: [{
            label: 'Días 2024',
            data: [260, 105], // Ajusta estos valores según los datos reales
            backgroundColor: ['#d0f123', '#d10ae8'], // Colores del gráfico
            hoverOffset: 4
        }]
    };

    // Datos del gráfico de líneas de evolución
    const lineData = {
        labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        datasets: [
            {
                label: 'Usuarios Activos',
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                data: [29, 68, 54, 35, 48, 62, 57, 46, 62, 75, 53, 65],
                fill: true
            },
            {
                label: 'Usuarios Inactivos',
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                data: [19, 45, 30, 28, 36, 42, 40, 30, 40, 45, 35, 40],
                fill: true
            }
        ]
    };

    // Opciones comunes para los gráficos de líneas
    const lineOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            }
        }
    };

    return (
        <>
            <Sidebar />
            <div style={{ textAlign: 'center', margin: '20px' }}>
                <h1>MES DE OCTUBRE</h1>
                <div style={{ marginBottom: '40px' }}>
                    <Pie data={pieData} options={{ responsive: true, plugins: { legend: { position: 'right' } } }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                    <div style={{ width: '30%' }}>
                        <Line data={lineData} options={lineOptions} />
                    </div>
                    <div style={{ width: '30%' }}>
                        <Line data={lineData} options={lineOptions} />
                    </div>
                    <div style={{ width: '30%' }}>
                        <Line data={lineData} options={lineOptions} />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Report;