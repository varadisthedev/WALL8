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

    // Days for Y-axis (Rows)
    const days = [
        { id: 2, label: 'Mon' },
        { id: 3, label: 'Tue' },
        { id: 4, label: 'Wed' },
        { id: 5, label: 'Thu' },
        { id: 6, label: 'Fri' },
        { id: 7, label: 'Sat' },
        { id: 1, label: 'Sun' },
    ];
    
    // Hours for X-axis (Columns)
    const hours = Array.from({ length: 24 }, (_, i) => i);

    const dataMap = {};
    let maxCount = 0;
    heatmapData.forEach(item => {
        dataMap[`${item.day}-${item.hour}`] = item.count;
        if (item.count > maxCount) maxCount = item.count;
    });

    const getOpacity = (count) => {
        if (!count) return 0.05;
        // Scale opacity clearly for visible activity
        return 0.3 + (count / maxCount) * 0.7;
    };

    return (
        <div className="glass-card p-6 w-full overflow-hidden text-[var(--text-primary)] animate-fade-in relative z-0">
             <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold flex items-center gap-2">
                    <span className="p-1 bg-green-500/10 rounded text-green-500">
                        <Activity className="w-4 h-4" />
                    </span>
                    Spending Activity
                </h3>
                <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                    <span>Less</span>
                    <div className="flex gap-0.5">
                        <div className="w-2.5 h-2.5 rounded-[2px] bg-green-500/20"></div>
                        <div className="w-2.5 h-2.5 rounded-[2px] bg-green-500/50"></div>
                        <div className="w-2.5 h-2.5 rounded-[2px] bg-green-500/80"></div>
                        <div className="w-2.5 h-2.5 rounded-[2px] bg-green-500"></div>
                    </div>
                    <span>More</span>
                </div>
            </div>

            <div className="flex gap-2">
                {/* Y-Axis Labels (Days) */}
                <div className="flex flex-col justify-between pt-5 pb-1 gap-1">
                    {days.map(day => (
                        <div key={day.id} className="h-3 text-[10px] font-medium text-[var(--text-secondary)] leading-3">
                            {day.label}
                        </div>
                    ))}
                </div>

                <div className="flex-1 overflow-x-auto custom-scrollbar">
                    <div className="min-w-[600px]">
                        {/* X-Axis Labels (Hours) */}
                        <div className="flex justify-between mb-1 pl-1 text-[10px] text-[var(--text-secondary)]">
                            {hours.filter(h => h % 3 === 0).map(hour => (
                                <span key={hour} className="w-8 text-center relative -left-4">
                                    {hour === 0 ? '12 AM' : hour === 12 ? '12 PM' : hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
                                </span>
                            ))}
                        </div>

                        {/* Grid */}
                        <div className="grid grid-cols-24 gap-1">
                            {/* We need to render column by column or row by row. 
                                CSS Grid fills row first. So we iterate Days (Rows) then Hours (Cols) */}
                            {days.map(day => (
                                hours.map(hour => {
                                    const count = dataMap[`${day.id}-${hour}`] || 0;
                                    const opacity = getOpacity(count);
                                    
                                    return (
                                        <div 
                                            key={`${day.id}-${hour}`}
                                            className="aspect-square rounded-[2px] transition-all hover:scale-125 hover:z-10 relative group cursor-pointer"
                                            style={{ 
                                                backgroundColor: `rgba(16, 185, 129, ${opacity})`,
                                                border: count === 0 ? '1px solid var(--glass-border)' : 'none'
                                            }}
                                            title={`${day.label} at ${hour > 12 ? hour - 12 : hour} ${hour >= 12 ? 'PM' : 'AM'}: ${count} transaction${count !== 1 ? 's' : ''}`}
                                        >
                                           {/* Tooltip purely CSS based or rely on title for standard browser tooltip for compactness */}
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
