import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import InputField from "@/components/input-field";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface EditProfileModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  initialData: {
    firstName: string;
    lastName: string;
    birthDate: string;
    employeeId: string;
    area: string;
  };
  onSuccess?: () => void;
}

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

// SANITIZERS
const sanitizers: Record<keyof ProfileForm, (v: string) => string> = {
  firstName: (v) => v.replace(/[^a-záéíóúüñA-ZÁÉÍÓÚÜÑ\s]/g, "").slice(0, 50),
  lastName: (v) => v.replace(/[^a-záéíóúüñA-ZÁÉÍÓÚÜÑ\s]/g, "").slice(0, 50),
  employeeId: (v) =>
    v
      .replace(/[^a-zA-Z0-9\-]/g, "")
      .toUpperCase()
      .slice(0, 20),
  area: (v) => v.replace(/[^a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s&]/g, "").slice(0, 60),
  birthDate: (v) => v,
};

// VALIDATORS
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

// PURIFIER
function purifyPayload(form: ProfileForm) {
  return {
    firstName: form.firstName.trim(),
    lastName: form.lastName.trim(),
    birthDate: form.birthDate,
    employeeId: form.employeeId.trim().toUpperCase(),
    area: form.area.trim(),
  };
}

// API CALL
async function updateProfile(form: ProfileForm) {
  const payload = purifyPayload(form);
  const { data } = await api.put("/api/profile/update", payload);
  return data;
}

export function EditProfileModal({
  isOpen,
  onOpenChange,
  initialData,
  onSuccess,
}: EditProfileModalProps) {
  const [form, setForm] = useState<ProfileForm>(initialData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<
    Partial<Record<keyof ProfileForm, boolean>>
  >({});

  const mutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      onOpenChange(false);
      onSuccess?.();
    },
    onError: (error: any) => {
      console.error("Failed to update profile:", error);
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const field = name as keyof ProfileForm;

    const sanitized = sanitizers[field](value);
    const updated = { ...form, [field]: sanitized };
    setForm(updated);

    if (touched[field]) {
      const error = validators[field](sanitized);
      setErrors((prev) => ({ ...prev, [field]: error }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const field = name as keyof ProfileForm;

    setTouched((prev) => ({ ...prev, [field]: true }));
    const error = validators[field](value);
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const allErrors: FormErrors = {};
    let hasErrors = false;

    (Object.keys(form) as (keyof ProfileForm)[]).forEach((field) => {
      const error = validators[field](form[field]);
      if (error) {
        allErrors[field] = error;
        hasErrors = true;
      }
    });

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
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Perfil</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {mutation.isError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                No se pudo actualizar el perfil. Por favor, inténtalo de nuevo.
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-2 gap-3">
            <InputField
              label="Nombre"
              name="firstName"
              value={form.firstName}
              error={errors.firstName}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <InputField
              label="Apellido"
              name="lastName"
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
            value={form.employeeId}
            error={errors.employeeId}
            onChange={handleChange}
            onBlur={handleBlur}
          />

          <InputField
            label="Área"
            name="area"
            value={form.area}
            error={errors.area}
            onChange={handleChange}
            onBlur={handleBlur}
          />

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                "Guardar Cambios"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
