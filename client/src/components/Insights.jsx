import React, { useEffect, useState } from "react";
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import api from "../api/axios";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const Insights = () => {
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch weekly trend data
                const res = await api.get('/analytics/chart?type=weekly&weeks=4');
                setChartData(res.data.data);
            } catch (error) {
                console.error("Error fetching insights", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="text-center p-10 text-gray-500">Loading insights...</div>;

    if (!chartData || chartData.length === 0) return <div className="text-center p-10 text-gray-500">No enough data for insights yet.</div>;

    // Process data for charts
    const weeks = chartData.map(d => `Week ${d._id}`);
    const totals = chartData.map(d => d.total);
    const counts = chartData.map(d => d.count);

    const lineChartData = {
        labels: weeks,
        datasets: [
            {
                label: 'Weekly Spending (₹)',
                data: totals,
                borderColor: 'rgb(249, 115, 22)', // orange-500
                backgroundColor: 'rgba(249, 115, 22, 0.5)',
                tension: 0.4,
            },
        ],
    };

    const barChartData = {
        labels: weeks,
        datasets: [
            {
                label: 'Transaction Count',
                data: counts,
                backgroundColor: 'rgba(59, 130, 246, 0.6)', // blue-500
                borderRadius: 8,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                labels: { color: '#4b5563' }
            },
            title: {
                display: false,
            },
        },
        scales: {
            y: {
                grid: { color: 'rgba(0,0,0,0.05)' },
                ticks: { color: '#6b7280' }
            },
            x: {
                grid: { display: false },
                ticks: { color: '#6b7280' }
            }
        }
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-800 border-l-4 border-orange-500 pl-4">Spending Insights</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Weekly Trend Line Chart */}
                <div className="glass-card p-6 bg-white/60">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Spending Trend (Last 4 Weeks)</h3>
                    <div className="h-72">
                        <Line data={lineChartData} options={options} />
                    </div>
                </div>

                {/* Transaction Frequency Bar Chart */}
                <div className="glass-card p-6 bg-white/60">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Transaction Frequency</h3>
                    <div className="h-72">
                        <Bar data={barChartData} options={options} />
                    </div>
                </div>
            </div>

            {/* AI Insights Placeholder/Future */}
            <div className="glass-card p-6 bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-100">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-white rounded-full shadow-sm text-2xl">🤖</div>
                    <div>
                        <h3 className="text-lg font-semibold text-indigo-900 mb-2">AI Spending Analysis</h3>
                        <p className="text-indigo-700/80 leading-relaxed">
                            Based on your recent activity, your spending in <strong>Food</strong> is 15% higher than last week. 
                            Consider setting a budget for dining out to save approximately ₹500 next month.
                            <br/>
                            <span className="text-xs opacity-75 mt-2 block">(This is a simulated AI insight based on your trends)</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
