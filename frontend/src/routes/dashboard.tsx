import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { api } from "../lib/api";
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
