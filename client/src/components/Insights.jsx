import React, { useEffect, useState } from "react";
import { Line, Bar } from 'react-chartjs-2';
import { Activity, TrendingUp, Calendar, DollarSign, AlertTriangle, Lightbulb, Brain, Target } from 'lucide-react';
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
  Filler
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
  Legend,
  Filler
);

export const Insights = ({ refreshTrigger }) => {
    const [chartData, setChartData] = useState(null);
    const [dailyData, setDailyData] = useState(null);
    const [categoryData, setCategoryData] = useState(null);
    const [aiInsights, setAiInsights] = useState(null);
    const [loading, setLoading] = useState(true);
    const [aiLoading, setAiLoading] = useState(false);
    const [duration, setDuration] = useState('1month');
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

                // Fetch today's hourly data
                const todayRes = await api.get('/analytics/chart?type=today');
                if (todayRes.data.success) {
                    setDailyData(todayRes.data.data);
                }

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

                // Fetch AI insights
                fetchAIInsights();
            } catch (error) {
                console.error("Error fetching insights", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [duration, refreshTrigger]);

    const fetchAIInsights = async () => {
        setAiLoading(true);
        try {
            const aiRes = await api.get('/analytics/ai-insights');
            if (aiRes.data.success) {
                setAiInsights(aiRes.data.data);
            }
        } catch (err) {
            console.log("AI insights not available:", err.message);
        } finally {
            setAiLoading(false);
        }
    };

    if (loading) return <div className="text-center p-10 text-[var(--text-secondary)]">Loading insights...</div>;

    if (!chartData || chartData.length === 0) return <div className="text-center p-10 text-[var(--text-secondary)]">Not enough data for insights yet. Start adding expenses!</div>;

    // Process data for charts
    const weeks = chartData.map(d => d.week || `Week ${d._id || 'N/A'}`);
    const totals = chartData.map(d => d.total || 0);
    const counts = chartData.map(d => d.count || 0);

    // Process today's hourly data
    const hourlyLabels = dailyData ? dailyData.map(d => d.label) : [];
    const hourlyTotals = dailyData ? dailyData.map(d => d.total || 0) : [];

    // Calculate budget warning
    const monthlyAllowance = budgetStatus?.monthlyAllowance || 0;
    const totalSpent = budgetStatus?.currentMonth?.total || 0;
    const budgetPercentage = monthlyAllowance > 0 ? (totalSpent / monthlyAllowance) * 100 : 0;
    const isOverBudget = budgetPercentage > 100;
    const isNearBudget = budgetPercentage > 80 && budgetPercentage <= 100;

    // Determine line color based on budget
    const lineColor = isOverBudget ? '#DC2626' : isNearBudget ? '#F59E0B' : '#3B82F6';
    const lineBgColor = isOverBudget ? 'rgba(220, 38, 38, 0.1)' : isNearBudget ? 'rgba(245, 158, 11, 0.1)' : 'rgba(59, 130, 246, 0.1)';

    // Weekly Spending Trend
    const weeklySpendingData = {
        labels: weeks,
        datasets: [{
            label: 'Weekly Spending (₹)',
            data: totals,
            borderColor: lineColor,
            backgroundColor: lineBgColor,
            tension: 0.4,
            fill: true,
            pointRadius: 5,
            pointHoverRadius: 7
        }]
    };

    // Transaction Frequency
    const transactionFrequencyData = {
        labels: weeks,
        datasets: [{
            label: 'Number of Transactions',
            data: counts,
            backgroundColor: '#8B5CF6',
            borderColor: '#7C3AED',
            borderWidth: 1
        }]
    };

    // Today's Hourly Spending Trend
    const todaySpendingData = {
        labels: hourlyLabels,
        datasets: [{
            label: 'Spending (₹)',
            data: hourlyTotals,
            borderColor: '#10B981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            tension: 0.4,
            fill: true,
            pointRadius: 4,
            pointHoverRadius: 6
        }]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'bottom',
                labels: { color: '#94a3b8', font: { size: 11 } }
            },
            tooltip: {
                backgroundColor: '#1e293b',
                titleColor: '#f1f5f9',
                bodyColor: '#cbd5e1'
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: { color: '#94a3b8' },
                grid: { color: 'rgba(148, 163, 184, 0.1)' }
            },
            x: {
                ticks: { color: '#94a3b8' },
                grid: { display: false }
            }
        }
    };

    // Key Metrics
    const totalTransactions = counts.reduce((a, b) => a + b, 0);
    const totalAmount = totals.reduce((a, b) => a + b, 0);
    const avgPerTransaction = totalTransactions > 0 ? totalAmount / totalTransactions : 0;

    const StatCard = ({ title, value, icon: Icon, color, isWarning, isAlert }) => (
        <div className={`glass-card p-4 border-l-4 ${
            isAlert ? 'border-red-500 bg-red-500/5' : 
            isWarning ? 'border-yellow-500 bg-yellow-500/5' : 
            `border-${color}-500`
        }`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-xs text-[var(--text-secondary)] font-medium mb-1">{title}</p>
                    <p className={`text-2xl font-bold ${
                        isAlert ? 'text-red-500' : 
                        isWarning ? 'text-yellow-500' : 
                        'text-[var(--text-primary)]'
                    }`}>{value}</p>
                </div>
                <div className={`p-3 rounded-full bg-${color}-500/10`}>
                    <Icon className={`w-6 h-6 text-${color}-500`} />
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
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

            {/* AI Insights & Tips Section */}
            <div className="glass-card p-6 bg-gradient-to-br from-purple-500/5 to-pink-500/5 border border-purple-500/20">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full">
                            <Brain className="w-6 h-6 text-purple-500" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-[var(--text-primary)]">AI-Powered Spending Analysis</h3>
                            <p className="text-xs text-[var(--text-secondary)]">Personalized insights & recommendations</p>
                        </div>
                    </div>
                    <button
                        onClick={fetchAIInsights}
                        disabled={aiLoading}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-semibold transition-all disabled:opacity-50"
                    >
                        {aiLoading ? '🔄 Analyzing...' : '✨ Refresh Insights'}
                    </button>
                </div>

                {aiLoading ? (
                    <div className="text-center py-8">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                        <p className="mt-3 text-[var(--text-secondary)]">AI is analyzing your spending patterns...</p>
                    </div>
                ) : aiInsights ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Insights */}
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <Activity className="w-5 h-5 text-blue-500" />
                                <h4 className="font-semibold text-[var(--text-primary)]">Key Insights</h4>
                            </div>
                            <ul className="space-y-2">
                                {aiInsights.insights?.map((insight, idx) => (
                                    <li key={idx} className="flex gap-3 p-3 bg-[var(--glass-bg)] rounded-lg border border-[var(--glass-border)]">
                                        <span className="text-blue-500 font-bold text-sm mt-0.5">{idx + 1}.</span>
                                        <span className="text-sm text-[var(--text-primary)]">{insight}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Tips */}
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <Lightbulb className="w-5 h-5 text-yellow-500" />
                                <h4 className="font-semibold text-[var(--text-primary)]">Smart Tips</h4>
                            </div>
                            <ul className="space-y-2">
                                {aiInsights.tips?.map((tip, idx) => (
                                    <li key={idx} className="flex gap-3 p-3 bg-[var(--glass-bg)] rounded-lg border border-[var(--glass-border)]">
                                        <Target className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                        <span className="text-sm text-[var(--text-primary)]">{tip}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <Brain className="w-12 h-12 text-purple-500 mx-auto mb-3 opacity-50" />
                        <p className="text-[var(--text-secondary)] mb-3">AI insights are not available yet</p>
                        <p className="text-xs text-[var(--text-secondary)]">
                            {budgetStatus ? 'Click "Refresh Insights" to generate analysis' : 'Complete your profile to get AI-powered tips'}
                        </p>
                    </div>
                )}
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard 
                    title="Total Spending" 
                    value={`₹${totalAmount.toFixed(2)}`} 
                    icon={DollarSign} 
                    color="blue"
                    isWarning={isNearBudget}
                    isAlert={isOverBudget}
                />
                <StatCard 
                    title="Total Transactions" 
                    value={totalTransactions} 
                    icon={Calendar} 
                    color="green"
                />
                <StatCard 
                    title="Avg per Transaction" 
                    value={`₹${avgPerTransaction.toFixed(2)}`} 
                    icon={Activity} 
                    color="purple"
                />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Spending Trend */}
                <div className="glass-card p-6">
                    <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-blue-500" />
                        Weekly Spending Trend
                    </h3>
                    <div className="h-64">
                        <Line data={weeklySpendingData} options={chartOptions} />
                    </div>
                </div>

                {/* Transaction Frequency */}
                <div className="glass-card p-6">
                    <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-purple-500" />
                        Transaction Frequency
                    </h3>
                    <div className="h-64">
                        <Bar data={transactionFrequencyData} options={chartOptions} />
                    </div>
                </div>

                {/* Today's Hourly Spending */}
                <div className="glass-card p-6 lg:col-span-2">
                    <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-green-500" />
                        Today's Spending (Hourly Breakdown)
                    </h3>
                    <div className="h-64">
                        {dailyData && dailyData.length > 0 ? (
                            <Line data={todaySpendingData} options={chartOptions} />
                        ) : (
                            <div className="flex items-center justify-center h-full text-[var(--text-secondary)]">
                                No spending data for today yet
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
