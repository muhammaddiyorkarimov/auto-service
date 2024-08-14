import React from 'react';
import { Area, AreaChart, Tooltip, XAxis, YAxis } from 'recharts';
import useFetch from './../../hooks/useFetch';
import Statistics from '../../services/landing/statistics';
import Loader from './../../helpers/loader/Loader';

function ActiveReports() {
    const { data: activeReports, loading, error } = useFetch(Statistics.getActiveReports);

    // Transform the data to fit the chart's expected format
    const transformedData = activeReports
        ? [
            { name: "Yan", profit: activeReports.jan },
            { name: "Fev", profit: activeReports.feb },
            { name: "Mart", profit: activeReports.mar },
            { name: "Apr", profit: activeReports.apr },
            { name: "May", profit: activeReports.may },
            { name: "Iyun", profit: activeReports.jun },
            { name: "Iyul", profit: activeReports.jul },
            { name: "Avg", profit: activeReports.aug },
            { name: "Sen", profit: activeReports.sep },
            { name: "Okt", profit: activeReports.oct },
            { name: "Noy", profit: activeReports.nov },
            { name: "Dek", profit: activeReports.dec },
        ]
        : [];

    return (
        <div className='active-reports-wrapper'>
            <div className="title">Sotuv bo'yicha oylik statistika</div>
            <AreaChart
            className='active-reports'
                width={700}
                height={190}
                data={transformedData}
                margin={{ top: 10, right: 30, left: 20, bottom: 0 }}
            >
                <defs>
                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="profit" stroke="#8884d8" fillOpacity={1} fill="url(#colorUv)" />
            </AreaChart>
        </div>
    );
}

export default ActiveReports;
