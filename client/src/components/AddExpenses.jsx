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
      <form onSubmit={handleSubmit}
      className="flex flex-col gap-4 p-6 bg-white rounded-lg shadow-md max-w-md mx-auto mt-10"
    >
        <label className="text-gray-700 font-medium">Enter Amount :</label>
        <input type="text" placeholder="enter amount" value={amount} onChange={(e) => setAmount(e.target.value)}
        className="border rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-green-400"
/>
        <label className="text-gray-700 font-medium">Category:</label>
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
      <label className="text-gray-700 font-medium">Date:</label>
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
         className="border rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-green-400"
      />
      <label className="text-gray-700 font-medium">Description:</label>
      <input
        type="text"
        placeholder="Optional"
        value={note}
        onChange={(e) => setNote(e.target.value)}
         className="border rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-green-400"
      />
       <button
          type="submit"
          style={{
            padding: "8px 16px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Add Expense
        </button>
      </form>
    </>
  );
};