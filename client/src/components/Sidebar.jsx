import React from "react";

export const Sidebar = () => {
  return (
    <div className="w-60 bg-gray-800 text-white h-screen p-5 space-y-4">
      <h2 className="text-lg font-semibold mb-4">Menu</h2>
      <ul className="space-y-3">
        <li className="hover:text-cyan-300 cursor-pointer">Dashboard</li>
        <li className="hover:text-cyan-300 cursor-pointer">Add Expense</li>
        <li className="hover:text-cyan-300 cursor-pointer">View Expenses</li>
        <li className="hover:text-cyan-300 cursor-pointer">Insights</li>
      </ul>
    </div>
  );
};
