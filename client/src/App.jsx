import "./App.css";
import { Card } from "./components/Card";
import { Tailwind } from "./components/Tailwind";
import { Test } from "./components/Test";
import { Navbar } from "./components/Navbar";
import { Sidebar } from "./components/Sidebar";
import { AddExpenses } from "./components/AddExpenses";
import { RecentExpenses } from "./components/RecentExpenses";
function App() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-800 via-sky-900 to-indigo-900">
      {/* bg-gray-50 */}
      <div className="flex flex-col items-center justify-center min-h-screen ">
        <h1 className="text-3xl font-bold mb-2">1Pocket</h1>
        <p className="text-gray-600 mb-4">All your expenses, one place.</p>
        <p className="bg-orange-500 text-white px-4 py-1 rounded">
          Hello there!
        </p>
          <div style={{display: "flex", flexDirection: "column"}}>
      <Navbar />
       <div style={{ display: "flex", flex: 1 }}>
        <Sidebar />
         <div style={{ padding: "20px", flex: 1 }}>
          <AddExpenses />
          <RecentExpenses />
        </div>
        </div>
        </div>
      </div>
    </div>
  );
}
export default App;
