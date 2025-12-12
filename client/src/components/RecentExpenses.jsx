import React, { useEffect, useState } from "react";
import api from "../api/axios";

export const RecentExpenses = ({ refreshTrigger }) => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await api.get('/expenses?limit=10');
        setExpenses(res.data.data);
      } catch (error) {
        console.error("Error fetching recent expenses", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, [refreshTrigger]);

  if (loading) return <div className="text-[var(--text-secondary)] text-center p-4">Loading expenses...</div>;

  return (
    <div className="glass-card p-6 h-fit text-[var(--text-primary)]">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
            <span className="p-1 bg-blue-500/10 rounded text-blue-500">
                <span className="w-5 h-5 block border-2 border-blue-500 rounded-full" />
            </span>
            Recent Expenses
        </h2>
        <button className="text-sm text-blue-500 hover:text-blue-600 font-medium">View All</button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-[var(--text-secondary)]">
          <thead>
            <tr className="text-[var(--text-secondary)] border-b border-[var(--glass-border)] opacity-70">
              <th className="py-3 px-2 font-medium uppercase tracking-wider text-xs">Date</th>
              <th className="py-3 px-2 font-medium uppercase tracking-wider text-xs">Category</th>
              <th className="py-3 px-2 font-medium uppercase tracking-wider text-xs">Description</th>
              <th className="py-3 px-2 text-right font-medium uppercase tracking-wider text-xs">Amount</th>
            </tr>
          </thead>

          <tbody>
            {expenses.length > 0 ? (
              expenses.map((item) => (
                <tr key={item._id} className="border-b border-[var(--glass-border)] last:border-none hover:bg-[var(--glass-border)] transition-colors">
                  <td className="py-3 px-2 whitespace-nowrap font-medium text-[var(--text-primary)]">
                    {new Date(item.date).toLocaleDateString(undefined, { day: '2-digit', month: 'short' })}
                  </td>
                  <td className="py-3 px-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(item.category)}`}>
                        {item.category}
                    </span>
                  </td>
                  <td className="py-3 px-2 max-w-[150px] truncate text-[var(--text-secondary)]">{item.note || '-'}</td>
                  <td className="py-3 px-2 text-right font-bold text-[var(--text-primary)]">
                    ₹{item.amount.toFixed(2)}
                  </td>
                </tr>
              ))
            ) : (
               <tr>
                 <td colSpan="4" className="py-8 text-center text-[var(--text-secondary)] italic bg-[var(--glass-bg)] rounded-lg mt-2">
                    No recent expenses found
                 </td>
               </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Helper for category colors - Blue/Neutral Theme
const getCategoryColor = (category) => {
    switch (category) {
        case 'Food': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
        case 'Travel': return 'bg-cyan-500/10 text-cyan-600 border-cyan-500/20';
        case 'Shopping': return 'bg-sky-500/10 text-sky-600 border-sky-500/20';
        case 'Entertainment': return 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20';
        default: return 'bg-slate-500/10 text-slate-600 border-slate-500/20';
    }
};
