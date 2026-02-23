// pages/LandingPage.jsx

import { useParams } from "react-router-dom";
import api from "../config/api";

function LandingPage() {
  const { slug } = useParams();

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">
        Campaign: {slug}
      </h1>

      {/* Later: fetch data by slug */}
    </div>
  );
}

export default LandingPage;