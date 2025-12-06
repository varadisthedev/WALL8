import React from "react";

export const RecentExpenses = () => {
  const expenses = [
    { sn: 1, amount: "₹3000.00", category: "Investment",sub: "Groww", date: "31 May 2025", mode: "Bank" },
    { sn: 2, amount: "₹560.00", category: "Food", sub: "Swiggy",date: "28 May 2025", mode: "UPI" },
    { sn: 3, amount: "₹2500.00", category: "Shopping", sub: "Amazon", date: "24 May 2025", mode: "Card" },
    { sn: 4, amount: "₹500.00", category: "Movie",sub: "PVR", date: "20 May 2025", mode: "UPI" },
    { sn: 5, amount: "₹1700.00", category: "Travel", sub: "IRCTC",date: "15 May 2025", mode: "Card" },
  ];

  return (
    <div className="bg-white rounded-xl shadow p-5 max-w-3xl mx-auto mt-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Recent Expenses</h2>

      </div>

      <table className="w-full text-left text-sm">
        <thead>
          <tr className="text-gray-600 border-b">
            <th className="py-2">S N</th>
            <th className="py-2">Amount</th>
            <th className="py-2">Category</th>
            <th className="py-2">Sub Category</th>
            <th className="py-2">Date</th>
            <th className="py-2">Mode</th>
          </tr>
        </thead>

        <tbody>
          {expenses.map((item) => (
            <tr key={item.sn} className="border-b last:border-none">
              <td className="py-2">{item.sn}.</td>
              <td className="py-2">{item.amount}</td>
              <td className="py-2">{item.category}</td>
              <td className="py-2">{item.sub}</td>
              <td className="py-2">{item.date}</td>
              <td className="py-2">{item.mode}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
