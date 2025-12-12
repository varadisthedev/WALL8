import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Activity } from 'lucide-react';

export const Heatmap = () => {
    const [heatmapData, setHeatmapData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHeatmap = async () => {
            try {
                const res = await api.get('/analytics/chart?type=heatmap');
                if (res.data.success) {
                    setHeatmapData(res.data.data);
                }
            } catch (error) {
                console.error("Error fetching heatmap data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchHeatmap();
    }, []);

    if (loading) return <div className="text-center p-4 text-[var(--text-secondary)]">Loading activity...</div>;

    // MongoDB Days: 1=Sun, 2=Mon, ..., 7=Sat
    // We want display: Mon, Tue, Wed, Thu, Fri, Sat, Sun
    const days = [
        { id: 2, label: 'Mon' },
        { id: 3, label: 'Tue' },
        { id: 4, label: 'Wed' },
        { id: 5, label: 'Thu' },
        { id: 6, label: 'Fri' },
        { id: 7, label: 'Sat' },
        { id: 1, label: 'Sun' },
    ];
    
    const hours = Array.from({ length: 24 }, (_, i) => i); // 0-23

    // Process data into a lookup map "day-hour" -> count
    const dataMap = {};
    let maxCount = 0;
    heatmapData.forEach(item => {
        dataMap[`${item.day}-${item.hour}`] = item.count;
        if (item.count > maxCount) maxCount = item.count;
    });

    const getOpacity = (count) => {
        if (!count) return 0.05; // Base opacity for empty cells
        // Scale opacity from 0.2 to 1.0 based on count relative to max
        return 0.2 + (count / maxCount) * 0.8;
    };

    return (
        <div className="glass-card p-6 h-fit text-[var(--text-primary)] animate-fade-in">
             <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold flex items-center gap-2">
                    <span className="p-1 bg-blue-500/10 rounded text-blue-500">
                        <Activity className="w-5 h-5" />
                    </span>
                    Spending Activity
                </h3>
                <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                    <span>Low</span>
                    <div className="w-16 h-2 rounded bg-gradient-to-r from-blue-100 to-blue-600 dark:from-blue-900 dark:to-blue-400"></div>
                    <span>High</span>
                </div>
            </div>

            <div className="grid grid-cols-[auto_1fr] gap-4">
                {/* Y-Axis Labels (Time) - Showing every 3 hours to save space, or just start/mid/end */}
                <div className="flex flex-col justify-between text-xs text-[var(--text-secondary)] font-medium pt-8 pb-2">
                    {hours.filter(h => h % 3 === 0).map(hour => (
                        <div key={hour} className="h-6 flex items-center justify-end pr-2">
                            {hour === 0 ? '12 AM' : hour === 12 ? '12 PM' : hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
                        </div>
                    ))}
                </div>

                {/* Heatmap Grid */}
                <div className="overflow-x-auto">
                    <div className="grid grid-cols-7 gap-1 min-w-[300px]">
                         {/* X-Axis Labels (Days) */}
                         {days.map(day => (
                            <div key={day.id} className="text-center text-xs font-semibold text-[var(--text-secondary)] mb-2">
                                {day.label}
                            </div>
                        ))}

                        {/* Grid Cells */}
                        {/* We map columns (days) first, then rows (hours) inside? 
                            No, CSS grid flows row by row usually. But we want columns of days.
                            We can use grid-flow-col or just map accordingly.
                            Let's map: for each Hour (row), render 7 Day cells.
                        */}
                       
                        <div className="contents">
                           {/* Transposing to simpler mapping: We want columns to be days. 
                               Actually, standard heatmap often has Time on Y and Days on X.
                               So we render Row 0 (Hour 0) for all Days, then Row 1, etc.
                           */}
                           {/* Wait, standard grid fills rows. So if I have 7 cols, I should just render cells in order:
                               (Mon, 0), (Tue, 0)... (Sun, 0)
                               (Mon, 1), ...
                           */}
                           {hours.map(hour => (
                               days.map(day => {
                                   const count = dataMap[`${day.id}-${hour}`] || 0;
                                   const opacity = getOpacity(count);
                                   return (
                                       <div 
                                            key={`${day.id}-${hour}`}
                                            className="h-6 rounded-sm transition-all hover:scale-110 relative group"
                                            style={{ 
                                                backgroundColor: `rgba(59, 130, 246, ${opacity})`, // Blue-500
                                                // Border to separate empty cells better
                                                border: count === 0 ? '1px solid var(--glass-border)' : 'none'
                                            }}
                                            title={`${day.label} ${hour}:00 - ${count} transactions`}
                                       >
                                           {count > 0 && (
                                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none z-10 whitespace-nowrap">
                                                    {count} txn{count !== 1 && 's'}
                                                </div>
                                           )}
                                       </div>
                                   );
                               })
                           ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
