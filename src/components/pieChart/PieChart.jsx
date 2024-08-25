import React, { useState, useEffect } from 'react';
import useFetch from './useFetch.js';
import Statistics from '../../services/landing/statistics';
import './pieChart.css';
import { Pie, PieChart, Tooltip } from 'recharts';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { BiLoader } from 'react-icons/bi';

function PieChartC({ startDate, endDate }) {
    const [filteredData, setFilteredData] = useState([]);
    const { data: pieChartData, loading, error } = useFetch(() =>
        Statistics.pieChart(startDate.format('YYYY-MM-DD'), endDate.format('YYYY-MM-DD'))
    );

    useEffect(() => {
        if (pieChartData) {
            const allZero = Object.values(pieChartData).every(value => value === 0);

            if (allZero) {
                const defaultData = [
                    { name: 'Xarajat mavjud emas', users: 100, fill: getRandomColor() },
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

    // Generate a random color
    const getRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };

    return (
        <div className="pie-chart-container">
            <div className="title">Xarajat bo'yicha statistika</div>
            {loading ? <BiLoader /> : error ? <p>{error.message}</p> : <PieChart width={400} height={170}>
                <Pie
                    dataKey="users"
                    isAnimationActive={true}
                    data={filteredData}
                    outerRadius={80}
                    label
                />
                <Tooltip />
            </PieChart>}
        </div>
    );
}

export default PieChartC;
