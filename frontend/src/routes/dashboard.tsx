import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { api } from "../lib/api";
import LogoutButton from "../components/logout-button";

export default function Dashboard() {
  return (
    <div>
      Bienvenido al Dashboard
      <LogoutButton />
    </div>
  );
}
