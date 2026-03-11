import { Navbar } from "../components/navbar";
import { SupervisorProfileRecap } from "../components/dashboards/supervisor/supervisor-profile-recap";

export default function SupervisorDashboard() {
  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 gap-6 md:gap-8">
      <Navbar />
      <SupervisorProfileRecap />
    </div>
  );
}
