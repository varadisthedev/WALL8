import FintechLandingPage from "./components/FintechLandingPage";
import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div>
      <FintechLandingPage />

      {/* CTA BUTTON */}
      <div className="flex justify-center mt-10">
        <Link
          to="/app"
          className="px-6 py-3 bg-indigo-600 text-white rounded-xl text-lg font-semibold hover:bg-indigo-700 transition-all"
        >
          Enter Dashboard
        </Link>
      </div>
    </div>
  );
}
