import React, { useEffect, useState } from "react";
import { Line, Bar } from 'react-chartjs-2';
import { Activity } from 'lucide-react';
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

    if (loading) return <div className="text-center p-10 text-[var(--text-secondary)]">Loading insights...</div>;

    if (!chartData || chartData.length === 0) return <div className="text-center p-10 text-[var(--text-secondary)]">Not enough data for insights yet.</div>;

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
                borderColor: '#3b82f6', // blue-500
                backgroundColor: 'rgba(59, 130, 246, 0.2)',
                tension: 0.4,
                pointBackgroundColor: '#2563eb', // blue-600
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: '#2563eb',
            },
        ],
    };

    const barChartData = {
        labels: weeks,
        datasets: [
            {
                label: 'Transaction Count',
                data: counts,
                backgroundColor: 'rgba(6, 182, 212, 0.7)', // cyan-500
                hoverBackgroundColor: 'rgba(6, 182, 212, 0.9)',
                borderRadius: 8,
            },
        ],
    };

    // We can't easily adhere to CSS vars inside ChartJS options without a helper, 
    // so we'll use a neutral gray that is readable on both light(white) and dark(dark blue) backgrounds.
    // #9ca3af (gray-400) is usually good for ticks.
    
    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                labels: { color: '#94a3b8' } // slate-400, readable on dark
            },
            title: {
                display: false,
            },
        },
        scales: {
            y: {
                grid: { color: 'rgba(148, 163, 184, 0.1)' }, // slate-400 with opacity
                ticks: { color: '#94a3b8' }
            },
            x: {
                grid: { display: false },
                ticks: { color: '#94a3b8' }
            }
        }
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <h2 className="text-2xl font-bold text-[var(--text-primary)] border-l-4 border-blue-500 pl-4">Spending Insights</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Weekly Trend Line Chart */}
                <div className="glass-card p-6 bg-[var(--glass-bg)]">
                    <h3 className="text-lg font-semibold text-[var(--text-secondary)] mb-4">Spending Trend (Last 4 Weeks)</h3>
                    <div className="h-72">
                        <Line data={lineChartData} options={chartOptions} />
                    </div>
                </div>

                {/* Transaction Frequency Bar Chart */}
                <div className="glass-card p-6 bg-[var(--glass-bg)]">
                    <h3 className="text-lg font-semibold text-[var(--text-secondary)] mb-4">Transaction Frequency</h3>
                    <div className="h-72">
                        <Bar data={barChartData} options={chartOptions} />
                    </div>
                </div>
            </div>

            {/* AI Insights Placeholder/Future */}
            <div className="glass-card p-6 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 border border-blue-500/20">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-[var(--glass-bg)] rounded-full shadow-sm text-blue-500 border border-blue-500/20">
                        <Activity className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">AI Spending Analysis</h3>
                        <p className="text-[var(--text-secondary)] leading-relaxed">
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
