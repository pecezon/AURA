import LogoutButton from "../components/logout-button";
import { Navbar } from "../components/navbar";

export default function Dashboard() {
  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100">
      <Navbar />
      Bienvenido al Dashboard
      <LogoutButton />
    </div>
  );
}
