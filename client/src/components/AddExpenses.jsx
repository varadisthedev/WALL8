import React, { useState } from "react";

export const AddExpenses = () => {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [note, setNote] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(amount, category, date, note);
  };
  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="flex flex-row flex-wrap gap-8 p-10 backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl shadow-xl max-w-6xl mx-auto mt-10 items-end
        bg-linear-to-br before:from-white/20 before:to-transparent"
      >
        <div className="w-36">
          <label className="text-white/95 font-medium">Enter Amount :</label>
          <input
            type="text"
            placeholder="amount in INR"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="border rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        <div className="w-36">
          {" "}
          <label className="text-white/95 font-medium">Category:</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            <option value="">Select</option>
            <option value="Food">Food</option>
            <option value="Travel">Travel</option>
            <option value="Shopping">Shopping</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Others">Others</option>
          </select>
        </div>

        <div className="w-56">
          <label className="text-white/95 font-medium">Date:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        <div className="w-56">
          <label className="text-white/95 font-medium">Description:</label>
          <input
            type="text"
            placeholder="Optional"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="border rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>
        <button
          type="submit"
          className="px-6 py-3 bg-emerald-400/80 text-white font-semibold rounded-xl shadow-md shadow-emerald-500/40 
          hover:bg-emerald-400 transition-all duration-200"
        >
          Add
        </button>
      </form>
    </>
  );
};
