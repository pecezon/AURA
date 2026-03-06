import { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { api } from "../lib/api";
import LogoutButton from "../components/logout-button";
import InputField from "../components/input-field";
import { getUserImage } from "../lib/supabase";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Alert, AlertDescription } from "../components/ui/alert";
import { AlertCircle, Loader2, UserCircle2 } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "../components/ui/avatar";

// 1. TYPES
interface ProfileForm {
  firstName: string;
  lastName: string;
  birthDate: string;
  employeeId: string;
  area: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  birthDate?: string;
  employeeId?: string;
  area?: string;
}

// 2. SANITIZERS
const sanitizers: Record<keyof ProfileForm, (v: string) => string> = {
  // Solo letras y espacios, máx 50 chars
  firstName: (v) => v.replace(/[^a-záéíóúüñA-ZÁÉÍÓÚÜÑ\s]/g, "").slice(0, 50),
  lastName: (v) => v.replace(/[^a-záéíóúüñA-ZÁÉÍÓÚÜÑ\s]/g, "").slice(0, 50),
  // Solo alfanumérico + guión, máx 20 chars
  employeeId: (v) =>
    v
      .replace(/[^a-zA-Z0-9\-]/g, "")
      .toUpperCase()
      .slice(0, 20),
  // Solo letras, espacios y &, máx 60 chars
  area: (v) => v.replace(/[^a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s&]/g, "").slice(0, 60),
  // El input type="date" ya devuelve ISO (YYYY-MM-DD), solo limpiamos
  birthDate: (v) => v,
};

// 3. VALIDATORS
const validators: Record<keyof ProfileForm, (v: string) => string | undefined> =
  {
    firstName: (v) => {
      if (!v.trim()) return "El nombre es requerido";
      if (v.trim().length < 2) return "Mínimo 2 caracteres";
    },
    lastName: (v) => {
      if (!v.trim()) return "El apellido es requerido";
      if (v.trim().length < 2) return "Mínimo 2 caracteres";
    },
    birthDate: (v) => {
      if (!v) return "La fecha de nacimiento es requerida";
      const date = new Date(v);
      const now = new Date();
      const minAge = new Date(
        now.getFullYear() - 18,
        now.getMonth(),
        now.getDate(),
      );
      if (date > minAge) return "Debes tener al menos 18 años";
      if (date < new Date("1900-01-01")) return "Fecha inválida";
    },
    employeeId: (v) => {
      if (!v.trim()) return "El ID de empleado es requerido";
      if (v.length < 3) return "Mínimo 3 caracteres";
    },
    area: (v) => {
      if (!v.trim()) return "El área es requerida";
    },
  };

// 4. PURIFIER
function purifyPayload(form: ProfileForm) {
  return {
    firstName: form.firstName.trim(),
    lastName: form.lastName.trim(),
    birthDate: form.birthDate,
    employeeId: form.employeeId.trim().toUpperCase(),
    area: form.area.trim(),
  };
}

// 5. API CALL
async function completeProfile(form: ProfileForm) {
  const payload = purifyPayload(form);
  const { data } = await api.post("/api/profile/complete-profile", payload);
  return data;
}

// 6. COMPONENTE
export default function RegistrationForm() {
  const navigate = useNavigate();

  // Fetch User Image
  const [userImage, setUserImage] = useState<string | null>(null);
  useEffect(() => {
    getUserImage().then((image) => {
      setUserImage(image);
      if (!image) {
        console.warn("No se pudo cargar la imagen del usuario");
      }
    });
  }, []);

  const [form, setForm] = useState<ProfileForm>({
    firstName: "",
    lastName: "",
    birthDate: "",
    employeeId: "",
    area: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<
    Partial<Record<keyof ProfileForm, boolean>>
  >({});

  // ── TanStack Query mutation ──
  const mutation = useMutation({
    mutationFn: completeProfile,
    onSuccess: () => navigate({ to: "/dashboard" }),
    onError: (error: any) => {
      console.error("Failed to complete profile:", error);
    },
  });

  // ── Handlers ──

  // onChange: sanitiza en tiempo real, valida si el campo ya fue tocado
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const field = name as keyof ProfileForm;

    const sanitized = sanitizers[field](value); // ← sanitiza al instante
    const updated = { ...form, [field]: sanitized };
    setForm(updated);

    // Solo muestra error si el usuario ya interactuó con el campo
    if (touched[field]) {
      const error = validators[field](sanitized);
      setErrors((prev) => ({ ...prev, [field]: error }));
    }
  };

  // onBlur: marca el campo como tocado y valida
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const field = name as keyof ProfileForm;

    setTouched((prev) => ({ ...prev, [field]: true }));
    const error = validators[field](value);
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  // onSubmit: valida todos los campos y lanza la mutation
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Valida todos los campos a la vez
    const allErrors: FormErrors = {};
    let hasErrors = false;

    (Object.keys(form) as (keyof ProfileForm)[]).forEach((field) => {
      const error = validators[field](form[field]);
      if (error) {
        allErrors[field] = error;
        hasErrors = true;
      }
    });

    // Marca todos como tocados para mostrar errores
    setTouched({
      firstName: true,
      lastName: true,
      birthDate: true,
      employeeId: true,
      area: true,
    });
    setErrors(allErrors);

    if (!hasErrors) {
      mutation.mutate(form);
    }
  };

  return (
    <div className="min-h-screen bg-muted/40 flex items-center justify-center p-4 flex-col gap-8 bg-gradient-to-br from-[#e8edf8] via-[#dce4f5] to-[#cdd8f0]">
      <img
        src="/images/aura_logo.svg"
        alt="AURA LOGO"
        className="w-full max-w-xs"
      />
      <Card className="w-full max-w-md shadow-lg p-0">
        <CardHeader className="space-y-1 py-4 bg-gradient-to-r from-electric-royal-600 to-slate-indigo-600 rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-white/20">
              <Avatar>
                <AvatarImage src={userImage ?? undefined} />
                <AvatarFallback className="bg-transparent">
                  <UserCircle2 className="w-5 h-5 text-white" />
                </AvatarFallback>
              </Avatar>
            </div>
            <div>
              <CardTitle className="text-xl text-white">
                Completa tu Registro
              </CardTitle>
              <CardDescription className="text-indigo-200">
                Solo falta un paso para comenzar
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <form onSubmit={handleSubmit} noValidate>
          <CardContent className="space-y-4">
            {/* API error */}
            {mutation.isError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  No se pudo completar el registro. Por favor, inténtalo de
                  nuevo.
                </AlertDescription>
              </Alert>
            )}

            {/* Nombre + Apellido */}
            <div className="grid grid-cols-2 gap-3">
              <InputField
                label="Nombre"
                name="firstName"
                placeholder="Juan"
                value={form.firstName}
                error={errors.firstName}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <InputField
                label="Apellido"
                name="lastName"
                placeholder="García"
                value={form.lastName}
                error={errors.lastName}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>

            <InputField
              label="Fecha de Nacimiento"
              name="birthDate"
              type="date"
              value={form.birthDate}
              error={errors.birthDate}
              onChange={handleChange}
              onBlur={handleBlur}
            />

            <InputField
              label="ID de Empleado"
              name="employeeId"
              placeholder="EMP-001"
              value={form.employeeId}
              error={errors.employeeId}
              onChange={handleChange}
              onBlur={handleBlur}
            />

            <InputField
              label="Área"
              name="area"
              placeholder="Tecnología"
              value={form.area}
              error={errors.area}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </CardContent>

          <CardFooter className="flex flex-col gap-3 pt-2 border-t border-muted mt-4 pb-4">
            <Button
              type="submit"
              className="w-full cursor-pointer bg-gradient-to-r from-electric-royal-600 to-slate-indigo-600"
              disabled={mutation.isPending}
            >
              {mutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {mutation.isPending ? "Guardando..." : "Completar Registro"}
            </Button>

            <LogoutButton style="bg-destructive/80 cursor-pointer hover:bg-destructive" />
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
