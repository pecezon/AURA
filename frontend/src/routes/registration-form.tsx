import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { api } from "../lib/api";
import LogoutButton from "../components/logout-button";

export default function RegistrationForm() {
  const navigate = useNavigate();

  // Form Handling
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    birthDate: "",
    employeeId: "",
    area: "",
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      await api.post("api/profile/complete-profile", form);
      navigate({ to: "/dashboard" });
    } catch (error) {
      console.error("Failed to complete profile:", error);
      alert("No se pudo completar el registro. Por favor, inténtalo de nuevo.");
    }
  };

  return (
    <div>
      <h1>Completa tu Registro</h1>

      <form onSubmit={handleSubmit}>
        <input
          name="firstName"
          placeholder="Nombre"
          onChange={handleChange}
          required
        />
        <input
          name="lastName"
          placeholder="Apellido"
          onChange={handleChange}
          required
        />
        <input type="date" name="birthDate" onChange={handleChange} required />
        <input
          name="employeeId"
          placeholder="ID Empleado"
          onChange={handleChange}
          required
        />
        <input
          name="area"
          placeholder="Área"
          onChange={handleChange}
          required
        />

        <button type="submit">Completar Registro</button>
      </form>
      <LogoutButton />
    </div>
  );
}
