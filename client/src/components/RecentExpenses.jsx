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

  if (loading) return <div className="text-gray-500 text-center p-4">Loading expenses...</div>;

  return (
    <div className="glass-card p-6 h-fit text-gray-800">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
            <span className="p-1 bg-blue-100 rounded text-blue-600">🕘</span>
            Recent Expenses
        </h2>
        <button className="text-sm text-orange-600 hover:text-orange-700 font-medium">View All</button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-600">
          <thead>
            <tr className="text-gray-400 border-b border-gray-200">
              <th className="py-3 px-2 font-medium uppercase tracking-wider text-xs">Date</th>
              <th className="py-3 px-2 font-medium uppercase tracking-wider text-xs">Category</th>
              <th className="py-3 px-2 font-medium uppercase tracking-wider text-xs">Description</th>
              <th className="py-3 px-2 text-right font-medium uppercase tracking-wider text-xs">Amount</th>
            </tr>
          </thead>

          <tbody>
            {expenses.length > 0 ? (
              expenses.map((item) => (
                <tr key={item._id} className="border-b border-gray-100 last:border-none hover:bg-orange-50/50 transition-colors">
                  <td className="py-3 px-2 whitespace-nowrap font-medium text-gray-700">
                    {new Date(item.date).toLocaleDateString(undefined, { day: '2-digit', month: 'short' })}
                  </td>
                  <td className="py-3 px-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(item.category)}`}>
                        {item.category}
                    </span>
                  </td>
                  <td className="py-3 px-2 max-w-[150px] truncate text-gray-500">{item.note || '-'}</td>
                  <td className="py-3 px-2 text-right font-bold text-gray-800">
                    ₹{item.amount.toFixed(2)}
                  </td>
                </tr>
              ))
            ) : (
               <tr>
                 <td colSpan="4" className="py-8 text-center text-gray-400 italic bg-gray-50/50 rounded-lg mt-2">
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

// Helper for category colors
const getCategoryColor = (category) => {
    switch (category) {
        case 'Food': return 'bg-orange-50 text-orange-600 border-orange-200';
        case 'Travel': return 'bg-blue-50 text-blue-600 border-blue-200';
        case 'Shopping': return 'bg-pink-50 text-pink-600 border-pink-200';
        case 'Entertainment': return 'bg-purple-50 text-purple-600 border-purple-200';
        default: return 'bg-gray-50 text-gray-600 border-gray-200';
    }
};
