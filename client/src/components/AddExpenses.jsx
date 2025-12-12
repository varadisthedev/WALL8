import React, { useState } from "react";
import api from "../api/axios";

export const AddExpenses = ({ onExpenseAdded }) => {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!amount) {
        alert("Please enter an amount");
        return;
      }

      await api.post('/expenses', {
        amount: Number(amount),
        category: category || undefined, // Let backend handle if empty
        date,
        note
      });

      // Reset form
      setAmount("");
      setCategory("");
      setNote("");
      
      // Refresh parent if callback provided
      if (onExpenseAdded) onExpenseAdded();
      
      // alert("Expense added successfully!"); // Removed alert for smoother UX
    } catch (error) {
      console.error("Error adding expense", error);
      console.error("Error response:", error.response?.data);
      
      const message = error.response?.data?.message || "Failed to add expense";
      
      // Check if onboarding is required
      if (error.response?.data?.requiresOnboarding) {
        alert("Please complete your profile in the Profile tab before adding expenses!");
      } else {
        alert(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card p-6 h-fit text-[var(--text-primary)]">
      <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
         <span className="p-1 bg-blue-100 rounded text-blue-600">
             <span className="w-5 h-5 block bg-blue-600 rounded-sm" />
         </span>
         Add Expense
      </h3>
      
      {/* AI Helper Message */}
      {!category && note && (
        <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg text-sm text-blue-600">
          <span className="font-semibold">✨ AI Auto-Categorization:</span> Leave category blank and add a description - AI will categorize it for you!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[var(--text-secondary)] text-sm font-medium mb-1">Amount (₹) <span className="text-red-500">*</span></label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full bg-[var(--input-bg)] border border-[var(--glass-border)] text-[var(--text-primary)] rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all placeholder:text-gray-400"
            step="0.01"
            min="0"
          />
        </div>

        <div>
          <label className="block text-[var(--text-secondary)] text-sm font-medium mb-1">Category (Optional - AI will auto-categorize)</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-[var(--input-bg)] border border-[var(--glass-border)] text-[var(--text-primary)] rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all appearance-none"
            style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%236b7280%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.7rem top 50%', backgroundSize: '0.65rem auto' }}

          >
            <option value="">Select Category</option>
            <option value="Food">Food</option>
            <option value="Travel">Travel</option>
            <option value="Shopping">Shopping</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Others">Others</option>
          </select>
        </div>

        <div>
          <label className="block text-[var(--text-secondary)] text-sm font-medium mb-1">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-[var(--input-bg)] border border-[var(--glass-border)] text-[var(--text-primary)] rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all placeholder:text-gray-400"
          />
        </div>

        <div>
           <label className="block text-[var(--text-secondary)] text-sm font-medium mb-1">Note (Optional)</label>
           <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full bg-[var(--input-bg)] border border-[var(--glass-border)] text-[var(--text-primary)] rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all placeholder:text-gray-400"
            placeholder="Description..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-500/30 transition-all mt-4 disabled:opacity-50 transform hover:-translate-y-0.5"
        >
          {loading ? "Adding..." : "Add Expense"}
        </button>
      </form>
    </div>
  );
};
