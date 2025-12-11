import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { useUser } from "@clerk/clerk-react";

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
                    'rgba(251, 146, 60, 0.8)', // Orange-400
                    'rgba(250, 204, 21, 0.8)', // Yellow-400
                    'rgba(248, 113, 113, 0.8)', // Red-400
                    'rgba(96, 165, 250, 0.8)', // Blue-400,
                    'rgba(52, 211, 153, 0.8)', // Emerald-400
                    'rgba(167, 139, 250, 0.8)', // Violet-400
                ],
                borderColor: [
                    'rgba(251, 146, 60, 1)',
                    'rgba(250, 204, 21, 1)',
                    'rgba(248, 113, 113, 1)',
                    'rgba(96, 165, 250, 1)',
                    'rgba(52, 211, 153, 1)',
                    'rgba(167, 139, 250, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="glass-card p-6 text-gray-800">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">Spending Overview</h2>
                <div className="text-right">
                    <p className="text-sm text-gray-500">Current Month</p>
                    <p className="text-xl font-bold text-orange-600">₹{budgetStatus.currentMonth?.total?.toFixed(2) || '0.00'}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="h-64 flex justify-center items-center">
                    {categories.length > 0 ? (
                        <Pie data={chartData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: '#4b5563' } } } }} />
                    ) : (
                         <div className="text-gray-400 italic">No expenses this month</div>
                    )}
                </div>
                
                <div className="space-y-4 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                    <h3 className="font-semibold text-gray-700 border-b border-gray-200 pb-2">Category Breakdown</h3>
                    {categories.map((cat, idx) => (
                        <div key={cat._id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0 border-dashed hover:bg-white/50 px-2 rounded-lg transition-colors">
                            <span className="capitalize text-gray-600 flex items-center gap-2">
                                <span className={`w-3 h-3 rounded-full`} style={{ backgroundColor: chartData.datasets[0].backgroundColor[idx % 6] }}></span>
                                {cat._id}
                            </span>
                            <div className="text-right">
                                <span className="block font-medium text-gray-800">₹{cat.total.toFixed(2)}</span>
                                <span className="text-xs text-gray-500">
                                    {cat.count} transactions
                                </span>
                            </div>
                        </div>
                    ))}
                    {categories.length === 0 && (
                        <p className="text-gray-400 text-sm text-center py-4 bg-orange-50/50 rounded-lg border border-orange-100 border-dashed">
                            Track your first expense to see analytics! 🚀
                        </p>
                    )}
                </div>
            </div>
            
             <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-gray-200/50">
                <StatBox label="Last Month" value={`₹${budgetStatus.lastMonth?.total.toFixed(2) || 0}`} />
                <StatBox label="This Week" value={`₹${budgetStatus.currentWeek?.total.toFixed(2) || 0}`} />
                <StatBox label="Avg. Transaction" value={`₹${budgetStatus.currentMonth?.average?.toFixed(2) || 0}`} />
                <StatBox label="Total Transactions" value={budgetStatus.currentMonth?.count || 0} />
            </div>
        </div>
    );
};

const StatBox = ({ label, value }) => (
    <div className="bg-white/60 p-4 rounded-xl border border-white/70 shadow-sm text-center hover:shadow-md transition-shadow">
        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">{label}</p>
        <p className="font-bold text-lg text-gray-800">{value}</p>
    </div>
);
