import React from 'react'
import { Area, AreaChart, Tooltip, XAxis, YAxis } from 'recharts';

function ActiveReports() {

    const data = [
        { id: 1, name: "Yan", users: 300, users2: 100 },
        { id: 2, name: "Fev", users: 200, users2: 300 },
        { id: 3, name: "Mart", users: 100, users2: 210 },
        { id: 4, name: "Apr", users: 300, users2: 400 },
        { id: 5, name: "May", users: 500, users2: 200 },
        { id: 6, name: "Iyun", users: 400, users2: 100 },
        { id: 7, name: "Iyul", users: 100, users2: 180 },
        { id: 8, name: "Avg", users: 300, users2: 310 },
        { id: 9, name: "Sen", users: 200, users2: 250 },
        { id: 10, name: "Okt", users: 200, users2: 200 },
        { id: 11, name: "Noy", users: 130, users2: 300 },
        { id: 12, name: "Dek", users: 330, users2: 100 },
    ];

    return (
        <AreaChart className='active-reports' eaChart width={700} height={190} data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                </linearGradient>
            </defs>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="users" stroke="#8884d8" fillOpacity={1} fill="url(#colorUv)" />
            <Area type="monotone" dataKey="users2" stroke="#82ca9d" fillOpacity={1} fill="url(#colorPv)" />
        </AreaChart>
    )
}

export default ActiveReports