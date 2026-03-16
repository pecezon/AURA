import { Navbar } from "../components/navbar";
import { ProfileRecap } from "../components/dashboards/profile-recap";
import MyCourses from "../components/dashboards/my-courses";

export default function WorkerDashboard() {
  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 gap-6 md:gap-8">
      <Navbar role="WORKER" />
      <ProfileRecap />
      <MyCourses />
    </div>
  );
}
