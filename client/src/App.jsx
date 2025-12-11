import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import MainApp from "./pages/MainApp";

function App() {
  return (
    <Router>
      <Routes>
        {/* 3D Landing Page */}
        <Route path="/" element={<Landing />} />

        {/* Expense Tracker App */}
        <Route path="/app" element={<MainApp />} />
      </Routes>
    </Router>
  );
}

export default App;
