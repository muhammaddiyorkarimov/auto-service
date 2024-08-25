import React, { useState, useEffect } from 'react';
import useFetch from './useFetch.js';
import Statistics from '../../services/landing/statistics';
import './pieChart.css';
import { Pie, PieChart, Tooltip } from 'recharts';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import CircularProgress from '@mui/material/CircularProgress'; // Material-UI loader
import { BiLoader } from 'react-icons/bi';

function PieChartC() {
    const [startDate, setStartDate] = useState(dayjs('2024-05-15'));
    const [endDate, setEndDate] = useState(dayjs('2025-05-15'));
    const [filteredData, setFilteredData] = useState([]);

    const { data: pieChartData, loading, error } = useFetch(() =>
        Statistics.pieChart(startDate.format('YYYY-MM-DD'), endDate.format('YYYY-MM-DD'))
    );

    useEffect(() => {
        if (pieChartData) {
            const allZero = Object.values(pieChartData).every(value => value === 0);

            if (allZero) {
                // Agar barcha ma'lumotlar 0 bo'lsa, 100% to'ldiradigan ma'lumot
                const defaultData = [
                    { name: 'Xarajat mavjud emas', users: 100, fill: getRandomColor() }, // 100% bo'lim
                ];
                setFilteredData(defaultData);
            } else {
                const chartData = Object.keys(pieChartData).map((key) => ({
                    name: key,
                    users: pieChartData[key],
                    fill: getRandomColor(),
                }));
                setFilteredData(chartData);
            }
        }
    }, [pieChartData]);

    // Tasodifiy rang yaratish funksiyasi
    const getRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };

    if (loading) {
        return <BiLoader />;
    }

    if (error) {
        return <p>Xato: {error.message}</p>;
    }

    return (
        <div className="pie-chart-container">
            <div className="title">Xarajat bo'yicha statistika</div>
            <PieChart width={400} height={170}>
                <Pie
                    dataKey="users"
                    isAnimationActive={true}
                    data={filteredData}
                    outerRadius={80}
                    label
                />
                <Tooltip />
            </PieChart>
        </div>
    );
}

export default PieChartC;
