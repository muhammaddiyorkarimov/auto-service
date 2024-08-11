import './pieChart.css'
import { Pie, PieChart, Tooltip } from 'recharts';

function PieChartC() {
    const data = [
        { name: "Dush", users: 200, fill: "#8884d8" },
        { name: "Sesh", users: 200, fill: "#82ca9d" },
        { name: "Chor", users: 250, fill: "#423E53" },
        { name: "Pay", users: 300, fill: "#808080" },
        { name: "Juma", users: 300, fill: "#574edb" },
        { name: "Shan", users: 200, fill: "#e2a93e" },
        { name: "Yak", users: 100, fill: "#b20404" },
    ];
    return (
        <PieChart className='pie-chart' width={400} height={250}>
            <Pie
                className="pie-chart-container"
                dataKey="users"
                isAnimationActive={true}
                data={data}
                cx={200}
                cy={120}
                outerRadius={80}
                fill="#8884d8"
                label
            />
            <Tooltip />

        </PieChart>
    )
}

export default PieChartC