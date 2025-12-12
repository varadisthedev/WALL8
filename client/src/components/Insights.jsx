import React, { useEffect, useState } from "react";
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { Activity, TrendingUp, Calendar, DollarSign, AlertTriangle } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
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
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export const Insights = () => {
    const [chartData, setChartData] = useState(null);
    const [categoryData, setCategoryData] = useState(null);
    const [aiInsights, setAiInsights] = useState(null);
    const [loading, setLoading] = useState(true);
    const [duration, setDuration] = useState('1month'); // 3days, 1week, 1month, 3months, 1year
    const [budgetStatus, setBudgetStatus] = useState(null);

    const durationMap = {
        '3days': { weeks: 1, label: '3 Days' },
        '1week': { weeks: 1, label: '1 Week' },
        '1month': { weeks: 4, label: '1 Month' },
        '3months': { weeks: 12, label: '3 Months' },
        '1year': { weeks: 52, label: '1 Year' }
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const weeks = durationMap[duration].weeks;
                
                // Fetch weekly trend data
                const weeklyRes = await api.get(`/analytics/chart?type=weekly&weeks=${weeks}`);
                setChartData(weeklyRes.data.data);

                // Fetch category breakdown
                const summaryRes = await api.get('/analytics/summary');
                if (summaryRes.data.success) {
                    setCategoryData(summaryRes.data.data);
                }

                // Fetch budget status
                try {
                    const budgetRes = await api.get('/user/budget-status');
                    if (budgetRes.data.success) {
                        setBudgetStatus(budgetRes.data.data);
                    }
                } catch (err) {
                    console.log("Budget status not available");
                }

                // Fetch AI insights (if available)
                try {
                    const aiRes = await api.get('/analytics/ai-insights');
                    if (aiRes.data.success) {
                        setAiInsights(aiRes.data.data);
                    }
                } catch (err) {
                    console.log("AI insights not available");
                }
            } catch (error) {
                console.error("Error fetching insights", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [duration]);

    if (loading) return <div className="text-center p-10 text-[var(--text-secondary)]">Loading insights...</div>;

    if (!chartData || chartData.length === 0) return <div className="text-center p-10 text-[var(--text-secondary)]">Not enough data for insights yet. Start adding expenses!</div>;

    // Process data for charts
    const weeks = chartData.map(d => `Week ${d._id}`);
    const totals = chartData.map(d => d.total || 0);
    const counts = chartData.map(d => d.count || 0);
    const averages = chartData.map(d => d.average || 0);

    // Calculate budget warning
    const totalSpent = totals.reduce((a, b) => a + b, 0);
    const monthlyAllowance = budgetStatus?.monthlyAllowance || 0;
    const budgetPercentage = monthlyAllowance > 0 ? (totalSpent / monthlyAllowance) * 100 : 0;
    const isOverBudget = budgetPercentage > 100;
    const isNearBudget = budgetPercentage > 80 && budgetPercentage <= 100;

    const lineChartData = {
        labels: weeks,
        datasets: [
            {
                label: 'Weekly Spending (₹)',
                data: totals,
                borderColor: isOverBudget ? '#ef4444' : isNearBudget ? '#f59e0b' : '#3b82f6',
                backgroundColor: isOverBudget ? 'rgba(239, 68, 68, 0.1)' : isNearBudget ? 'rgba(245, 158, 11, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                tension: 0.4,
                pointBackgroundColor: isOverBudget ? '#dc2626' : isNearBudget ? '#d97706' : '#2563eb',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: isOverBudget ? '#dc2626' : isNearBudget ? '#d97706' : '#2563eb',
                fill: true,
            },
        ],
    };

    const barChartData = {
        labels: weeks,
        datasets: [
            {
                label: 'Transaction Count',
                data: counts,
                backgroundColor: 'rgba(6, 182, 212, 0.7)',
                hoverBackgroundColor: 'rgba(6, 182, 212, 0.9)',
                borderRadius: 8,
            },
        ],
    };

    const avgChartData = {
        labels: weeks,
        datasets: [
            {
                label: 'Avg. Transaction (₹)',
                data: averages,
                backgroundColor: [
                    'rgba(59, 130, 246, 0.7)',
                    'rgba(16, 185, 129, 0.7)',
                    'rgba(245, 158, 11, 0.7)',
                    'rgba(239, 68, 68, 0.7)',
                    'rgba(139, 92, 246, 0.7)',
                    'rgba(236, 72, 153, 0.7)',
                    'rgba(14, 165, 233, 0.7)',
                    'rgba(34, 197, 94, 0.7)',
                ],
                borderWidth: 0,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: { color: '#94a3b8', font: { size: 11 } }
            },
            title: {
                display: false,
            },
        },
        scales: {
            y: {
                grid: { color: 'rgba(148, 163, 184, 0.1)' },
                ticks: { color: '#94a3b8', font: { size: 11 } }
            },
            x: {
                grid: { display: false },
                ticks: { color: '#94a3b8', font: { size: 11 } }
            }
        }
    };

    const doughnutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right',
                labels: { color: '#94a3b8', font: { size: 10 }, padding: 8 }
            },
        },
    };

    const totalTransactions = counts.reduce((a, b) => a + b, 0);

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header with Duration Toggle */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <h2 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2">
                    <TrendingUp className="w-7 h-7 text-blue-500" />
                    Spending Insights
                </h2>
                
                {/* Duration Toggle */}
                <div className="flex items-center gap-2 bg-[var(--input-bg)] p-1 rounded-lg border border-[var(--glass-border)]">
                    {Object.entries(durationMap).map(([key, { label }]) => (
                        <button
                            key={key}
                            onClick={() => setDuration(key)}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                                duration === key
                                    ? 'bg-blue-600 text-white shadow-md transform scale-105'
                                    : 'text-[var(--text-secondary)] hover:bg-[var(--glass-bg)]'
                            }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Budget Warning Banner */}
            {monthlyAllowance > 0 && (isOverBudget || isNearBudget) && (
                <div className={`glass-card p-4 flex items-center gap-3 border-l-4 ${
                    isOverBudget 
                        ? 'bg-red-500/10 border-red-500' 
                        : 'bg-yellow-500/10 border-yellow-500'
                }`}>
                    <AlertTriangle className={`w-5 h-5 ${isOverBudget ? 'text-red-500' : 'text-yellow-500'}`} />
                    <div className="flex-1">
                        <p className={`font-semibold ${isOverBudget ? 'text-red-600' : 'text-yellow-600'}`}>
                            {isOverBudget ? '⚠️ Over Budget!' : '⚡ Approaching Budget Limit'}
                        </p>
                        <p className="text-sm text-[var(--text-secondary)]">
                            You've spent ₹{totalSpent.toFixed(2)} ({budgetPercentage.toFixed(1)}%) of your ₹{monthlyAllowance} monthly allowance
                        </p>
                    </div>
                </div>
            )}

            {/* AI Insights Section */}
            {aiInsights && (
                <div className="glass-card p-6 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 border border-blue-500/20">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-[var(--glass-bg)] rounded-full shadow-sm text-blue-500 border border-blue-500/20">
                            <Activity className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-3">AI Spending Analysis</h3>
                            <div className="prose prose-sm text-[var(--text-secondary)] space-y-2">
                                {aiInsights.insights?.map((insight, idx) => (
                                    <p key={idx} className="leading-relaxed">{insight}</p>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Chart Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Spending Trend */}
                <div className="glass-card p-6 bg-[var(--glass-bg)]">
                    <h3 className="text-md font-semibold text-[var(--text-secondary)] mb-4 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Spending Trend
                    </h3>
                    <div className="h-64">
                        <Line data={lineChartData} options={chartOptions} />
                    </div>
                </div>

                {/* Transaction Frequency */}
                <div className="glass-card p-6 bg-[var(--glass-bg)]">
                    <h3 className="text-md font-semibold text-[var(--text-secondary)] mb-4 flex items-center gap-2">
                        <Activity className="w-4 h-4" />
                        Transaction Frequency
                    </h3>
                    <div className="h-64">
                        <Bar data={barChartData} options={chartOptions} />
                    </div>
                </div>

                {/* Average Transaction Size */}
                <div className="glass-card p-6 bg-[var(--glass-bg)]">
                    <h3 className="text-md font-semibold text-[var(--text-secondary)] mb-4 flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        Average per Week
                    </h3>
                    <div className="h-64">
                        <Doughnut data={avgChartData} options={doughnutOptions} />
                    </div>
                </div>

                {/* Key Metrics */}
                <div className="glass-card p-6 bg-[var(--glass-bg)]">
                    <h3 className="text-md font-semibold text-[var(--text-secondary)] mb-4">Key Metrics</h3>
                    <div className="space-y-4">
                        <StatCard 
                            label="Total Spending" 
                            value={`₹${totalSpent.toFixed(2)}`}
                            trend={totals[totals.length - 1] > totals[totals.length - 2] ? 'up' : 'down'}
                            isWarning={isOverBudget}
                            isAlert={isNearBudget}
                        />
                        <StatCard 
                            label="Total Transactions" 
                            value={totalTransactions}
                            trend="neutral"
                        />
                        <StatCard 
                            label="Avg per Week" 
                            value={`₹${totals.length > 0 ? (totalSpent / totals.length).toFixed(2) : '0.00'}`}
                            trend="neutral"
                        />
                        <StatCard 
                            label="Highest Week" 
                            value={`₹${totals.length > 0 ? Math.max(...totals).toFixed(2) : '0.00'}`}
                            trend="up"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ label, value, trend, isWarning, isAlert }) => (
    <div className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
        isWarning 
            ? 'bg-red-500/10 border-red-500/30' 
            : isAlert 
            ? 'bg-yellow-500/10 border-yellow-500/30' 
            : 'bg-[var(--input-bg)] border-[var(--glass-border)]'
    }`}>
        <span className="text-sm text-[var(--text-secondary)]">{label}</span>
        <span className={`text-lg font-bold flex items-center gap-2 ${
            isWarning ? 'text-red-600' : isAlert ? 'text-yellow-600' : 'text-[var(--text-primary)]'
        }`}>
            {value}
            {trend === 'up' && <span className="text-red-500 text-xs">↑</span>}
            {trend === 'down' && <span className="text-green-500 text-xs">↓</span>}
        </span>
    </div>
);
