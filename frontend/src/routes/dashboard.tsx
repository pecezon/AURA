import { Navbar } from "../components/navbar";
import { ProfileRecap } from "../components/profile-recap";

export default function Dashboard() {
  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 gap-6 md:gap-8">
      <Navbar />
      <ProfileRecap />
    </div>
  );
}
