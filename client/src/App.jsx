import "./App.css";
import { AddExpenses } from "./components/AddExpenses";
import { Tailwind } from "./components/Tailwind";
import { Test } from "./components/Test";
import { RecentExpenses } from "./components/RecentExpenses";


function App() {
  return (
    <>
    
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
  <h1 className="text-3xl font-bold mb-2">1Pocket</h1>
  <p className="text-gray-600 mb-4">All your expenses, one place.</p>
  <p className="bg-orange-500 text-white px-4 py-1 rounded">Hello there!</p>

 
  <AddExpenses />
</div>

  
      <RecentExpenses />
    </>
  );
}

export default App;

