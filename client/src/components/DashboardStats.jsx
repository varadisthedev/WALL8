import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { useUser } from "@clerk/clerk-react";
import { Heatmap } from './Heatmap';

ChartJS.register(ArcElement, Tooltip, Legend);

export const DashboardStats = () => {
    const { user } = useUser();
    const [budgetStatus, setBudgetStatus] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBudget = async () => {
            try {
                await api.post('/user/sync', { clerkUser: user });
                const res = await api.get('/analytics/summary');
                setBudgetStatus(res.data.data);
            } catch (error) {
                console.error("Error fetching budget", error);
            } finally {
                setLoading(false);
            }
        };

        if (user) fetchBudget();
    }, [user]);

    if (loading) return <div className="text-gray-600 font-medium text-center p-4">Loading stats...</div>;

    if (!budgetStatus) return <div className="text-gray-500 text-center p-4">No data available</div>;

    const categories = budgetStatus.categoryBreakdown || [];
    const chartData = {
        labels: categories.map(c => c._id),
        datasets: [
            {
                data: categories.map(c => c.total),
                backgroundColor: [
                    'rgba(10, 65, 116, 0.8)', // Darkest Blue
                    'rgba(73, 118, 159, 0.8)', // Medium Blue
                    'rgba(123, 189, 232, 0.8)', // Light Blue
                    'rgba(189, 216, 233, 0.8)', // Lightest Blue
                    'rgba(100, 160, 200, 0.8)', // Muted Blue
                    'rgba(150, 190, 220, 0.8)', // Another Blue
                ],
                borderColor: [
                    'rgba(10, 65, 116, 1)',
                    'rgba(73, 118, 159, 1)',
                    'rgba(123, 189, 232, 1)',
                    'rgba(189, 216, 233, 1)',
                    'rgba(100, 160, 200, 1)',
                    'rgba(150, 190, 220, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="glass-card p-6 text-[var(--text-primary)]">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">Spending Overview</h2>
                <div className="text-right">
                    <p className="text-sm text-[var(--text-secondary)]">Current Month</p>
                    <p className="text-xl font-bold text-blue-600">₹{budgetStatus.currentMonth?.total?.toFixed(2) || '0.00'}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="h-64 flex justify-center items-center">
                    {categories.length > 0 ? (
                        <Pie data={chartData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: '#9ca3af' } } } }} />
                    ) : (
                         <div className="text-[var(--text-secondary)] italic">No expenses this month</div>
                    )}
                </div>
                
                <div className="space-y-4 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                    <h3 className="font-semibold text-[var(--text-secondary)] border-b border-[var(--glass-border)] pb-2">Category Breakdown</h3>
                    {categories.map((cat, idx) => (
                        <div key={cat._id} className="flex justify-between items-center py-2 border-b border-[var(--glass-border)] last:border-0 border-dashed hover:bg-[var(--glass-bg)] px-2 rounded-lg transition-colors">
                            <span className="capitalize text-[var(--text-secondary)] flex items-center gap-2">
                                <span className={`w-3 h-3 rounded-full`} style={{ backgroundColor: chartData.datasets[0].backgroundColor[idx % 6] }}></span>
                                {cat._id}
                            </span>
                            <div className="text-right">
                                <span className="block font-medium text-[var(--text-primary)]">₹{cat.total.toFixed(2)}</span>
                                <span className="text-xs text-[var(--text-secondary)]">
                                    {cat.count} transactions
                                </span>
                            </div>
                        </div>
                    ))}
                    {categories.length === 0 && (
                        <p className="text-[var(--text-secondary)] text-sm text-center py-4 bg-[var(--glass-bg)] rounded-lg border border-[var(--glass-border)] border-dashed">
                            Track your first expense to see analytics! 🚀
                        </p>
                    )}
                </div>
            </div>
            
             <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-[var(--glass-border)]">
                <StatBox label="Last Month" value={`₹${budgetStatus.lastMonth?.total.toFixed(2) || 0}`} />
                <StatBox label="This Week" value={`₹${budgetStatus.currentWeek?.total.toFixed(2) || 0}`} />
                <StatBox label="Avg. Transaction" value={`₹${budgetStatus.currentMonth?.average?.toFixed(2) || 0}`} />
                <StatBox label="Total Transactions" value={budgetStatus.currentMonth?.count || 0} />
            </div>

        </div>
    );
};

const StatBox = ({ label, value }) => (
    <div className="bg-[var(--input-bg)] p-4 rounded-xl border border-[var(--glass-border)] shadow-sm text-center hover:shadow-md transition-shadow">
        <p className="text-xs text-[var(--text-secondary)] font-medium uppercase tracking-wider mb-1">{label}</p>
        <p className="font-bold text-lg text-[var(--text-primary)]">{value}</p>
    </div>
);
