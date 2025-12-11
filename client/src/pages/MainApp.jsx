import { Navbar } from "../components/Navbar";
import { Sidebar } from "../components/Sidebar";
import { AddExpenses } from "../components/AddExpenses";
import { RecentExpenses } from "../components/RecentExpenses";

export default function MainApp() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <div className="p-6 flex-1">
          <AddExpenses />
          <RecentExpenses />
        </div>
      </div>
    </div>
  );
}
